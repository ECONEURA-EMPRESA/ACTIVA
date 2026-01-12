import {
    collection,
    doc,
    writeBatch,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Invoice } from '@monorepo/shared';

export interface BillableSessionRef {
    id: string;
    type: 'individual' | 'group';
    patientId?: string; // Required for individual
    price: number;
    date: string;
}

export const BillingRepository = {
    /**
     * ATOMIC INVOICE CREATION
     * Creates the invoice AND updates all related sessions to 'paid: true' in a single transaction.
     * Use this instead of separate calls to prevent "Phantom Revenue".
     */
    createInvoiceBatch: async (invoice: Invoice, sessions: BillableSessionRef[]): Promise<void> => {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("Unauthorized");

        const batch = writeBatch(db);

        // 1. Create Invoice Document
        const invoiceRef = doc(db, 'invoices', invoice.id);
        const invoiceData = {
            ...invoice,
            userId: uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        batch.set(invoiceRef, invoiceData);

        // 2. Update Sessions (Mark as Paid)
        for (const session of sessions) {
            if (session.type === 'individual') {
                if (!session.patientId) {
                    console.error("Skipping individual session without patientId:", session);
                    continue;
                }
                // Path: patients/{patientId}/sessions/{sessionId}
                const sessionRef = doc(db, 'patients', session.patientId, 'sessions', session.id);
                batch.update(sessionRef, { paid: true, invoiceId: invoice.id });

                // NOTE: We are NOT updating the legacy 'sessions' array on the Patient document here.
                // This means the array might show 'paid: false' until the patient is re-saved.
                // The Subcollection is the Source of Truth for Billing.
            }
            else if (session.type === 'group') {
                // Path: users/{uid}/group_sessions/{sessionId}
                const groupRef = doc(db, 'users', uid, 'group_sessions', session.id);
                batch.update(groupRef, { paid: true, invoiceId: invoice.id });
            }
        }

        // 3. Commit Atomically
        await batch.commit();

    },

    /**
     * Get unbilled sessions for a group
     * This is a specific query to help the Wizard
     */
    getUnbilledGroupSessions: async (groupName: string): Promise<BillableSessionRef[]> => {
        const uid = auth.currentUser?.uid;
        if (!uid) return [];

        try {
            // Query users/{uid}/group_sessions where groupName == X and paid == false
            // Query users/{uid}/group_sessions where groupName == X
            // Removed orderBy('date', 'desc') to avoid Composite Index dependency.
            // We sort in memory.
            const q = query(
                collection(db, 'users', uid, 'group_sessions'),
                where('groupName', '==', groupName)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs
                .map(d => {
                    const data = d.data();
                    return { ...data, id: d.id } as any;
                })
                .filter(d => !d.paid) // Memory filter to avoid composite index requirement immediately
                .map(d => ({
                    id: d.id,
                    type: 'group' as const,
                    price: d.price || 0,
                    date: d.date,
                    // Group sessions might not have a single patientId
                }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (e) {
            console.error("Error fetching unbilled group sessions:", e);
            return [];
        }
    }
};
