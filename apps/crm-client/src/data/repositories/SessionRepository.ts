import { db, auth } from '../../lib/firebase';
import {
    collection,
    collectionGroup,
    query,
    where,
    getDocs,
    getDoc,
    updateDoc,
    doc,
    writeBatch,
    arrayUnion
} from 'firebase/firestore';
import { Session, Patient } from '../../lib/types';

export const SessionRepository = {
    /**
     * Fetch sessions globally by date range.
     * Uses Collection Group Query: 'sessions'.
     * @requires Index: collectionId: 'sessions', fields: [userId: ASC, date: ASC]
     */
    getSessionsByDateRange: async (startDate: string, endDate: string): Promise<(Session & { patientId: string })[]> => {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("No authenticated user");

        // Ideally, we use ISO dates 'YYYY-MM-DD' for lexicographical range queries.
        // Legacy dates are 'DD/MM/YYYY', which fail range queries (30/01 > 01/02).
        // For TITANIUM RIGOR, we expect ISO. 
        // If data is 'DD/MM/YYYY', this query will return garbage sorting.
        // We will assume data is migrated or we fetch all and filter in memory (temporary fallback).

        // 1. Try Collection Group
        const sessionsRef = collectionGroup(db, 'sessions');
        // We filter by userId to ensure we only get this therapist's sessions
        const q = query(
            sessionsRef,
            where('userId', '==', uid),
            where('date', '>=', startDate),
            where('date', '<=', endDate)
        );

        try {
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => {
                const data = d.data() as Session;
                // Extract PatientID from path: patients/{patientId}/sessions/{sessionId}
                // d.ref.parent is 'sessions' collection
                // d.ref.parent.parent is 'patients/{patientId}' document
                const patientId = d.ref.parent.parent?.id || 'unknown';
                return { ...data, id: d.id, patientId };
            });
        } catch (error: unknown) {
            console.error("SessionRepository: Index missing or query failed", error);
            // Fallback for "First Run" or Missing Index: Return empty or handle gracefully
            throw error;
        }
    },

    /**
     * Fetch all sessions for a specific patient from their subcollection.
     * This is the Source of Truth, creating a fallback for the legacy array.
     */
    getSessionsByPatientId: async (patientId: string): Promise<Session[]> => {
        const sessionsRef = collection(db, 'patients', patientId, 'sessions');
        const snapshot = await getDocs(sessionsRef);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Session));
    },

    /**
     * Fetch ALL group sessions for History.
     * Order by date descending.
     */
    getAllGroupSessions: async (): Promise<(Session & { patientId: string })[]> => {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("No authenticated user");

        const sessionsRef = collectionGroup(db, 'sessions');
        const q = query(
            sessionsRef,
            where('userId', '==', uid),
            where('type', '==', 'group')
            // orderBy('date', 'desc') // Requires Index
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => {
            const data = d.data() as Session;
            const patientId = d.ref.parent.parent?.id || 'unknown';
            return { ...data, id: d.id, patientId };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // In-memory sort fallback
    },

    /**
     * Create a session in the patient's subcollection.
     */
    create: async (patientId: string, session: Session): Promise<string> => {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("No authenticated user");

        // Force string ID
        const sessionId = session.id ? String(session.id) : String(Date.now());
        const ref = doc(db, 'patients', patientId, 'sessions', sessionId);

        // Inject userId for collectionGroup security/filtering
        const payload = { ...session, id: sessionId, userId: uid, createdAt: new Date().toISOString() };

        // TITANIUM STANDARD: Atomic Batch Write
        const batch = writeBatch(db);

        // 1. Write to Subcollection (Titanium Source of Truth)
        batch.set(ref, payload);

        // 2. Dual-Write to Legacy Array (For UI Compatibility)
        // This ensures usePatients() query sees the new session immediately without refactoring the whole frontend.
        const patientRef = doc(db, 'patients', patientId);
        batch.update(patientRef, {
            sessions: arrayUnion(payload)
        });

        await batch.commit();
        // console.log('GroupSession: Atomic Create Success'); // Protocol: Silence

        return sessionId;
    },

    update: async (patientId: string, sessionId: string, data: Partial<Session>): Promise<void> => {
        const ref = doc(db, 'patients', patientId, 'sessions', String(sessionId));
        await updateDoc(ref, data);
    },

    delete: async (patientId: string, sessionId: string): Promise<void> => {
        const batch = writeBatch(db);

        // 1. Delete from Subcollection (Source of Truth)
        const sessionRef = doc(db, 'patients', patientId, 'sessions', sessionId);
        batch.delete(sessionRef);

        // 2. Remove from Legacy Array (UI Consistency)
        // rigorous consistency check: read parent, filter, write back.
        const patientRef = doc(db, 'patients', patientId);
        try {
            const patientSnap = await getDoc(patientRef);
            if (patientSnap.exists()) {
                const p = patientSnap.data() as Patient;
                const updatedSessions = (p.sessions || []).filter(s => String(s.id) !== String(sessionId));
                batch.update(patientRef, { sessions: updatedSessions });
            }
        } catch (e) {
            console.error('TitaniumDelete: Error sync legacy array', e);
        }

        await batch.commit();
    },

    /**
     * MIGRATION TOOL:
     * Moves sessions from Patient.sessions (Array) to patients/{id}/sessions (Subcollection).
     * This is atomic per patient.
     */
    migratePatientSessions: async (patient: Patient): Promise<void> => {
        const uid = auth.currentUser?.uid;
        if (!uid || !patient.id) return;

        if (!patient.sessions || patient.sessions.length === 0) return;

        const batch = writeBatch(db);
        const sessionsRef = collection(db, 'patients', String(patient.id), 'sessions');

        // 1. Move sessions to subcollection
        patient.sessions.forEach(session => {
            const newDoc = doc(sessionsRef); // Auto-ID
            batch.set(newDoc, {
                ...session,
                userId: uid,
                migratedAt: new Date().toISOString()
            });
        });

        // 2. Clear legacy array
        const patientRef = doc(db, 'patients', String(patient.id));
        batch.update(patientRef, { sessions: [] }); // Empty the array

        await batch.commit();
        console.log(`Migrated ${patient.sessions.length} sessions for patient ${patient.name}`);
    }
};
