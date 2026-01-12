import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Invoice } from '@monorepo/shared';

const COLLECTION = 'invoices';

export const InvoiceRepository = {
    async getAll(): Promise<Invoice[]> {
        const user = auth.currentUser;
        if (!user) return [];

        try {
            const q = query(
                collection(db, COLLECTION),
                where('userId', '==', user.uid),
                orderBy('date', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => doc.data() as Invoice);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            return [];
        }
    },

    async getByPatient(patientId: string): Promise<Invoice[]> {
        try {
            const q = query(collection(db, COLLECTION), where('patientId', '==', patientId), orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => doc.data() as Invoice);
        } catch (error) {
            console.error('Error fetching patient invoices:', error);
            // Fallback for index issues: client-side filtering
            const all = await this.getAll();
            return all.filter(inv => inv.patientId === patientId);
        }
    },

    async save(invoice: Invoice): Promise<void> {
        const docRef = doc(db, COLLECTION, invoice.id);
        const data = {
            ...invoice,
            updatedAt: new Date().toISOString()
        };
        await setDoc(docRef, data, { merge: true });
    },

    async updateStatus(id: string, status: Invoice['status'], paidAt?: string, method?: Invoice['paymentMethod']): Promise<void> {
        const docRef = doc(db, COLLECTION, id);
        const updates: Partial<Invoice> & { updatedAt: string } = { status, updatedAt: new Date().toISOString() };
        if (paidAt) updates.paidAt = paidAt;
        if (method) updates.paymentMethod = method;

        await updateDoc(docRef, updates);
    },

    async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION, id));
    },

    // Helper: Generate next Invoice Number
    async getNextInvoiceNumber(): Promise<string> {
        try {
            const q = query(collection(db, COLLECTION), orderBy('number', 'desc'), where('number', '>=', 'INV-'), where('number', '<=', 'INV-\uf8ff'));
            // Limit 1 is ideal but ordering by string desc ensures we get highest 2024 over 2023 etc.
            const snapshot = await getDocs(q);
            if (snapshot.empty) return `INV-${new Date().getFullYear()}-001`;

            const lastInv = snapshot.docs[0].data() as Invoice;
            const parts = lastInv.number.split('-');
            if (parts.length === 3) {
                const currentYear = new Date().getFullYear().toString();
                if (parts[1] !== currentYear) return `INV-${currentYear}-001`; // New year reset

                const nextSeq = parseInt(parts[2]) + 1;
                return `INV-${currentYear}-${nextSeq.toString().padStart(3, '0')}`;
            }
            return `INV-${new Date().getFullYear()}-001`;
        } catch {
            return `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`; // Fallback
        }
    }
};
