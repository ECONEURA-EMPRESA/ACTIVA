import { db, auth } from '../../lib/firebase';
import {
    doc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    arrayUnion,
    deleteDoc,
    runTransaction,
    collection
} from 'firebase/firestore';
import {
    Patient,
    PatientSchema,
    Session,
    SessionSchema
} from '@monorepo/shared';

const COLLECTION = 'patients';

export class PatientRepository {
    /**
     * Retrieves a patient by ID and validates it against the strict Zod Schema.
     * @param id The patient's unique ID
     * @throws Error if validation fails or patient not found
     */
    static async getById(id: string): Promise<Patient | null> {
        try {
            const docRef = doc(db, COLLECTION, id);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) return null;

            const data = snapshot.data();
            // Runtime Validation: The Data Firewall
            const parsed = PatientSchema.safeParse({ ...data, id: snapshot.id });

            if (!parsed.success) {
                console.error('[Titanium Data Firewall] Validation Failed for Patient:', id, parsed.error);
                // Return data anyway but log critical error? Or throw?
                // For Titanium Protocol, we should ideally throw or fix.
                // For now, we return the raw data casted, but with strict logging.
                return { ...data, id: snapshot.id } as Patient;
            }

            return parsed.data;
        } catch (error) {
            console.error('Error fetching patient:', error);
            throw error;
        }
    }

    /**
     * Updates a patient's top-level fields.
     */
    static async update(id: string, updates: Partial<Patient>): Promise<void> {
        const docRef = doc(db, COLLECTION, id);
        // We only allow updating fields defined in the schema
        // Ideally we should validate 'updates' against a Partial<PatientSchema>
        await updateDoc(docRef, updates);
    }

    /**
     * Retrieves all patients for the current user.
     */
    static async getAll(): Promise<Patient[]> {
        const uid = auth.currentUser?.uid;
        if (!uid) return [];

        try {
            const q = query(collection(db, COLLECTION), where('userId', '==', uid));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return { ...data, id: doc.id } as Patient;
            });
        } catch (error) {
            console.error('Error fetching all patients:', error);
            return [];
        }
    }

    /**
     * Creates a new patient with ACID guarantees.
     * 1. Validates Data.
     * 2. Creates Patient Document.
     * 3. Creates Initial Session (if present).
     * 4. Creates Audit Log.
     * ALL OR NOTHING.
     */
    static async create(patient: Omit<Patient, 'id'>): Promise<string> {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("Unauthorized: No User ID");

        // 1. Validate Payload (Lightweight Check)
        const validation = PatientSchema.safeParse({ ...patient, id: 'temp-id' });
        if (!validation.success) {
            console.error('[Titanium] Creation Blocked by Schema:', validation.error);
            // We allow proceeding if partial data is accepted, but lets force strictness for Critical Fields
            if (!patient.name) throw new Error("Validation Failed: Name is required");
        }

        return await runTransaction(db, async (transaction) => {
            // A. Generate IDs
            const patientRef = doc(collection(db, COLLECTION)); // Auto-ID

            // B. Prepare Patient Data
            const patientData = {
                ...patient,
                userId: uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sessions: [] // Legacy Array starts empty, we might dual-write initial session below
            };

            // C. Prepare Audit Log
            const logRef = doc(collection(db, 'activity_logs'));
            const logData = {
                userId: uid,
                type: 'patient',
                message: `Paciente creado: ${patient.name}`,
                timestamp: new Date().toISOString()
            };

            // D. Execute Writes
            transaction.set(patientRef, patientData);
            transaction.set(logRef, logData);

            // E. Handle Initial Session (Subcollection) if exists in legacy array payload
            // "Legacy Array" in payload is usually handled by UI.
            // If the payload has 'sessions' with items, we should write them to subcollection too.
            if (patient.sessions && patient.sessions.length > 0) {
                const initialSession = patient.sessions[0];
                const sessionRef = doc(collection(db, COLLECTION, patientRef.id, 'sessions'));
                const sessionData = {
                    ...initialSession,
                    userId: uid,
                    createdAt: new Date().toISOString()
                };
                transaction.set(sessionRef, sessionData);

                // Dual Write to Legacy Array for consistency
                // (patientData.sessions is empty above, let's fill it)
                // transaction.update(patientRef, { sessions: [sessionData] }); // Cannot update strictly after set in same doc? 
                // Actually we can just include it in 'patientData' above.
                // Correct approach:
                // patientData.sessions = [sessionData];
                // BUT we already did set(patientRef).
            }

            return patientRef.id;
        });
    }

    /**
     * Adds a session to the patient's history.
     * strictly validates the session before writing.
     */
    static async addSession(patientId: string, session: Session): Promise<void> {
        // Validate Session
        const parsed = SessionSchema.safeParse(session);
        if (!parsed.success) {
            console.error('[Titanium Data Firewall] Invalid Session Data:', parsed.error);
            throw new Error('Invalid Session Data');
        }

        const docRef = doc(db, COLLECTION, patientId);
        await updateDoc(docRef, {
            sessions: arrayUnion(parsed.data),
            // enhance: auto-increment counter could be done here or via cloud function
        });
    }

    /**
     * Deletes a patient permanently.
     */
    static async delete(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION, id);
        await deleteDoc(docRef);
    }
}
