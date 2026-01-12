import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    writeBatch,
    query,
    where
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { GroupSession } from '../../lib/types';

// REFACTOR: Use Subcollections for Security (users/{uid}/group_sessions)
// This avoids root-level permission issues and missing composite indexes.
const getCollectionRef = (uid: string) => collection(db, 'users', uid, 'group_sessions');

export const GroupSessionRepository = {
    /**
     * Create a new group session in User's subcollection
     */
    create: async (session: GroupSession & { id?: string }): Promise<void> => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuario no autenticado');

            // Subcollection Path
            const collectionRef = getCollectionRef(user.uid);
            const sessionId = session.id || doc(collectionRef).id;

            // Clean Payload
            const sessionData = {
                ...session,
                id: sessionId,
                userId: user.uid,
                updatedAt: new Date().toISOString()
            };

            // Write to users/{uid}/group_sessions/{sessionId}
            await setDoc(doc(collectionRef, sessionId), sessionData);

        } catch (error) {
            console.error('GroupSessionRepository: Create Error', error);
            throw error;
        }
    },

    /**
     * Get all group sessions from User's subcollection
     */
    getAll: async (): Promise<GroupSession[]> => {
        try {
            const user = auth.currentUser;
            if (!user) return [];

            // Simple Query on Subcollection (Implicitly secure, no complex index needed for basic fetch)
            const q = query(getCollectionRef(user.uid));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // FORCE ID from metadata to ensure it's never missing
            } as GroupSession));
        } catch (error) {
            console.error('GroupSessionRepository: GetAll Error', error);
            return [];
        }
    },

    /**
     * Update a group session
     */
    update: async (sessionId: string, updates: Partial<GroupSession>): Promise<void> => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Unauthorized');

            const docRef = doc(db, 'users', user.uid, 'group_sessions', sessionId);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error('GroupSessionRepository: Update Error', error);
            throw error;
        }
    },

    /**
     * Delete a group session
     */
    delete: async (sessionId: string): Promise<void> => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Unauthorized');

            // TITANIUM STANDARD: Atomic Batch Delete
            const batch = writeBatch(db);

            // 1. Delete from Subcollection (Standard)
            const docRef = doc(db, 'users', user.uid, 'group_sessions', sessionId);
            batch.delete(docRef);

            // 2. Delete from Root Collection (Legacy/Fallback)
            const rootDocRef = doc(db, 'group_sessions', sessionId);
            batch.delete(rootDocRef);

            await batch.commit();
        } catch (error) {
            console.error('GroupSessionRepository: Delete Error', error);
            throw error;
        }
    },

    /**
     * Delete ALL sessions for a specific group name
     * (Effectively deletes the "Group")
     */
    deleteAllSessionsForGroup: async (groupName: string): Promise<void> => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Unauthorized');

            // 1. Query all sessions with this groupName
            const q = query(
                getCollectionRef(user.uid),
                where('groupName', '==', groupName)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) return;

            // 2. Batch Delete
            const batch = writeBatch(db);

            snapshot.docs.forEach(docSnap => {
                // Delete from Subcollection
                batch.delete(docSnap.ref);
                // Try delete from legacy root (best effort, assuming ID match)
                batch.delete(doc(db, 'group_sessions', docSnap.id));
            });

            await batch.commit();

        } catch (error) {
            console.error('GroupSessionRepository: DeleteAllSessions Error', error);
            throw error;
        }
    }
};
