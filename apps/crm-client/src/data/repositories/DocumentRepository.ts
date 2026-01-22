import { db, storage, auth } from '../../lib/firebase';
import {
    collection,
    query,
    orderBy,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    limit
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import type { ClinicalDocument } from '@monorepo/shared';
import { DocumentSchema } from '@monorepo/shared';

export const DocumentRepository = {
    /**
     * Fetch all documents for a patient, strictly typed.
     */
    getByPatientId: async (patientId: string): Promise<ClinicalDocument[]> => {
        const q = query(
            collection(db, `patients/${patientId}/documents`),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => {
            const data = d.data();
            // Runtime Check? Or trust Fireatore? 
            // Ideally we parse with Zod, but for perforance on loops, we might cast if confident.
            // Let's do a soft check or construct carefully.
            return { id: d.id, ...data } as ClinicalDocument;
        });
    },

    /**
     * Uploads a file to Storage and creates metadata in Firestore.
     * Transaction-like safety not native, so we do Storage -> Firestore.
     */
    upload: async (patientId: string, file: File): Promise<ClinicalDocument> => {
        if (!auth.currentUser) throw new Error("Unauthorized: No user logged in.");

        // 1. Storage Upload
        const storagePath = `patients/${patientId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);

        // Metadata for Security Rules (ownerId)
        const metadata = {
            customMetadata: {
                ownerId: auth.currentUser.uid,
                originalName: file.name
            }
        };

        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // 2. Firestore Record
        // Using Zod Schema to strictly define what goes to DB
        const newDocPayload: Omit<ClinicalDocument, 'id'> = {
            name: file.name,
            url: downloadUrl,
            type: file.type,
            size: file.size,
            uploadedBy: auth.currentUser.uid,
            createdAt: new Date().toISOString(),
            path: storagePath
        };

        // Validate payload before sending (Iron Rule)
        // We pick everything except ID from the schema to validate
        DocumentSchema.omit({ id: true }).parse(newDocPayload);

        const docRef = await addDoc(
            collection(db, `patients/${patientId}/documents`),
            newDocPayload
        );

        return { id: docRef.id, ...newDocPayload };
    },

    /**
     * Deletes from Storage and Firestore.
     */
    delete: async (patientId: string, document: ClinicalDocument): Promise<void> => {
        // 1. Delete from Storage
        if (document.path) {
            const storageRef = ref(storage, document.path);
            try {
                await deleteObject(storageRef);
            } catch (error) {
                console.warn("Storage delete failed (orphaned file?):", error);
            }
        }

        // 2. Delete from Firestore
        await deleteDoc(doc(db, `patients/${patientId}/documents`, document.id));
    }
};
