import { useState, useMemo } from 'react';
import { Patient, Session, InvoiceData } from '../../../lib/types';
import { useActivityLog } from '../../../hooks/useActivityLog';

interface UseBillingProps {
    patient: Patient;
    onUpdate: (updated: Patient) => void;
    activeSessions: Session[]; // Receive pre-sorted sessions
}

export const useBilling = ({ patient, onUpdate, activeSessions }: UseBillingProps) => {
    const { logActivity } = useActivityLog();
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

    // Calculate Total Debt
    const totalDebt = useMemo(() => {
        return activeSessions.reduce((acc, s) => acc + (s.paid ? 0 : s.price || 0), 0);
    }, [activeSessions]);

    const handlePrintGlobalInvoice = () => {
        const allBillableSessions = activeSessions
            .filter((s) => !s.isAbsent || (s.price && s.price > 0))
            .sort((a, b) => {
                const parseDate = (dStr: string) => {
                    const [d, m, y] = dStr.split('/');
                    return new Date(`${y}-${m}-${d}`).getTime();
                }
                return parseDate(a.date) - parseDate(b.date);
            });

        if (allBillableSessions.length === 0) {
            alert('No se encontraron sesiones para facturar.');
            return;
        }

        const defaultNum = `FACT-${Date.now().toString().slice(-6)}`;
        setInvoiceData({
            clientName: patient.name,
            clientMeta: `Paciente Ref: ${patient.reference || '-'}`,
            sessions: allBillableSessions,
            invoiceNumber: defaultNum,
        });
        setShowInvoice(true);
    };

    const togglePaymentStatus = (sessionId: string | number, currentPaidStatus: boolean, price: number) => {
        const updatedSessions = patient.sessions?.map((sess) =>
            sess.id === sessionId ? { ...sess, paid: !currentPaidStatus } : sess
        );

        if (updatedSessions) {
            onUpdate({ ...patient, sessions: updatedSessions });
            if (!currentPaidStatus) {
                logActivity('finance', `Pago registrado: Sesión de ${patient.name} (${price}€)`);
            }
        }
    };

    return {
        activeSessions,
        totalDebt,
        showInvoice,
        setShowInvoice,
        invoiceData,
        handlePrintGlobalInvoice,
        togglePaymentStatus
    };
};
