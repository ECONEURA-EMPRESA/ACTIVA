import React from 'react';
import { Button } from '../../../../components/ui/Button';
import { FileText } from 'lucide-react';
import { useBilling } from '../../hooks/useBilling';
import { InvoiceGenerator } from '../../../../components/ui/InvoiceGenerator';
import { Patient, ClinicSettings, Session } from '../../../../lib/types'; // Import Session

interface BillingTabProps {
    patient: Patient;
    onUpdate: (updated: Patient) => void;
    clinicSettings: ClinicSettings;
    activeSessions: Session[];
}

export const BillingTab: React.FC<BillingTabProps> = ({ patient, onUpdate, clinicSettings, activeSessions }) => {
    const {
        totalDebt,
        showInvoice,
        setShowInvoice,
        invoiceData,
        handlePrintGlobalInvoice,
        togglePaymentStatus
    } = useBilling({ patient, onUpdate, activeSessions });

    return (
        <div className="animate-in fade-in">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Control de Pagos</h3>
                    <div className="flex gap-3">
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Deuda Total</p>
                            <p className="text-xl font-black text-red-600">
                                {totalDebt} €
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handlePrintGlobalInvoice}
                            icon={FileText}
                        >
                            Generar Factura Global
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Concepto</th>
                                <th className="px-6 py-3">Importe</th>
                                <th className="px-6 py-3 text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeSessions.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-slate-500 whitespace-nowrap">
                                        {s.date}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900 min-w-[200px]">
                                        Sesión {s.type === 'group' ? 'Grupal' : 'Individual'}
                                        {s.isAbsent && (
                                            <span className="text-red-500 ml-2 text-xs font-bold">(Ausencia)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{s.price || 0}€</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => togglePaymentStatus(s.id, !!s.paid, s.price || 0)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${s.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {s.paid ? 'PAGADO' : 'PENDIENTE'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showInvoice && invoiceData && (
                <InvoiceGenerator
                    data={invoiceData}
                    onClose={() => setShowInvoice(false)}
                    clinicSettings={clinicSettings}
                />
            )}
        </div>
    );
};
