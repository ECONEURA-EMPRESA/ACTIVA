import { db, auth } from '../../lib/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';

export interface NoteItem {
    id: string;
    text: string;
    isCompleted: boolean;
    createdAt: number;
}

export interface DailyNote {
    id: string; // usually `${userId}_${date}`
    userId: string;
    date: string; // YYYY-MM-DD
    content: string; // Legacy
    items: NoteItem[]; // New
    color?: string;
    updatedAt?: unknown;
}

export const NoteRepository = {
    /**
     * Get note for a specific date and current user
     */
    getByDate: async (dateStr: string): Promise<DailyNote | null> => {
        const uid = auth.currentUser?.uid;
        if (!uid) return null;

        const notesRef = collection(db, 'daily_notes');
        const q = query(
            notesRef,
            where('userId', '==', uid),
            where('date', '==', dateStr)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as DailyNote;
    },

    /**
     * Save or Update a note (Flexible)
     */
    save: async (dateStr: string, data: Partial<DailyNote>): Promise<void> => {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("No authenticated user");

        const noteId = `note_${uid}_${dateStr}`;
        const docRef = doc(db, 'daily_notes', noteId);

        await setDoc(docRef, {
            userId: uid,
            date: dateStr,
            updatedAt: serverTimestamp(),
            ...data
        }, { merge: true });
    },

    delete: async (dateStr: string): Promise<void> => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const noteId = `note_${uid}_${dateStr}`;
        const docRef = doc(db, 'daily_notes', noteId);
        await import('firebase/firestore').then(m => m.deleteDoc(docRef));
    }
};
