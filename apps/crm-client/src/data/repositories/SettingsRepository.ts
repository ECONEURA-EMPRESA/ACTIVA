import { db } from '../../lib/firebase';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { ClinicSettings } from '../../lib/types'; // We will enhance types next if needed

const DEFAULT_SETTINGS: Partial<ClinicSettings> = {
    notificationsEnabled: true,
    name: '',
    email: '',
    phone: '',
    address: ''
};

export const SettingsRepository = {
    /**
     * Get settings for the current user.
     * Returns defaults if no document exists yet.
     */
    get: async (userId: string): Promise<ClinicSettings> => {
        const docRef = doc(db, 'settings', userId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            return { ...DEFAULT_SETTINGS, ...snapshot.data() } as ClinicSettings;
        } else {
            return DEFAULT_SETTINGS as ClinicSettings;
        }
    },

    /**
     * Update or Create settings for the current user.
     * Merges with existing data.
     */
    update: async (userId: string, data: Partial<ClinicSettings>): Promise<void> => {
        const docRef = doc(db, 'settings', userId);
        const payload = {
            ...data,
            updatedAt: serverTimestamp()
        };
        // merge: true ensures we don't wipe fields not present in 'data'
        await setDoc(docRef, payload, { merge: true });
    }
};
