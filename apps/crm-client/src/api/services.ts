import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Patient, ClinicSettings } from '../lib/types';

// Helper to enforce auth
const getUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");
  return user.uid;
};

export const PatientsService = {
  getAll: async (): Promise<Patient[]> => {
    const uid = getUserId();
    const q = query(collection(db, "patients"), where("userId", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
  },

  getById: async (id: string): Promise<Patient> => {
    const docRef = doc(db, "patients", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Paciente no encontrado");
    return { id: docSnap.id, ...docSnap.data() } as Patient;
  },

  create: async (data: Omit<Patient, 'id'>): Promise<Patient> => {
    const uid = getUserId();
    // Inject userId for security rules
    const payload = { ...data, userId: uid, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "patients"), payload);
    return { id: docRef.id, ...payload } as Patient;
  },

  update: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    const docRef = doc(db, "patients", id);
    await updateDoc(docRef, data);
    return { id, ...data } as Patient;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    await deleteDoc(doc(db, "patients", id));
    return { success: true };
  },
};

export const SettingsService = {
  get: async (): Promise<ClinicSettings> => {
    const uid = getUserId();
    const docRef = doc(db, "config", `settings_${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ClinicSettings;
    }
    return {} as ClinicSettings;
  },

  save: async (data: ClinicSettings): Promise<{ success: boolean }> => {
    const uid = getUserId();
    const docRef = doc(db, "config", `settings_${uid}`);
    // Merge true to avoid overwriting existing fields if partial
    await setDoc(docRef, { ...data, userId: uid }, { merge: true });
    return { success: true };
  },
};
