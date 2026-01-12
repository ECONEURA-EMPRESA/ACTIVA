import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Euro, TrendingUp, AlertCircle, CheckCircle, Clock, Plus, Trash2, FileText, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useInvoiceController } from '../../hooks/controllers/useInvoiceController';
import { Invoice, InvoiceStatus } from '@monorepo/shared';
import { useSettingsController } from '../../hooks/controllers/useSettingsController';
import { PdfGenerator } from '../../lib/PdfGenerator';
import { InvoiceWizardModal } from './modals/InvoiceWizardModal';
import { Skeleton } from '../../components/ui/Skeleton'; // TITANIUM SKELETON

export const BillingView = () => {
    const { invoices, updateStatus, deleteInvoice, isLoading } = useInvoiceController();
    const { settings } = useSettingsController(); // TITANIUM SETTINGS
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // Calc KPIs
    const stats = useMemo(() => {
        const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.total, 0);
        const pendingAmount = invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + curr.total, 0);
        const currentMonthRevenue = invoices
            .filter(i => i.status === 'PAID' && i.date.startsWith(new Date().toISOString().slice(0, 7)))
            .reduce((acc, curr) => acc + curr.total, 0);
        return { totalRevenue, pendingAmount, currentMonthRevenue };
    }, [invoices]);

    // Filter
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || inv.number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleMarkPaid = async (inv: Invoice) => {
        if (confirm(`¿Marcar factura ${inv.number} como PAGADA?`)) {
            await updateStatus({ id: inv.id, status: 'PAID', paidAt: new Date().toISOString() });
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Facturación</h1>
                    <p className="text-slate-500">Gestión financiera, ingresos y control de cobros.</p>
                </div>
                <Button onClick={() => setIsWizardOpen(true)} icon={Plus}>Nueva Factura</Button>
            </header>

            {/* KPIs */}
            {/* KPIs - MOBILE: HORIZONTAL SCROLL / DESKTOP: GRID */}
            <div className="flex overflow-x-auto snap-x snap-mandatory pt-2 pb-4 gap-4 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-6 md:mx-0 md:px-0 md:overflow-visible hide-scrollbar">
                <Card className="min-w-[85vw] snap-center md:min-w-0 p-6 border-l-4 border-emerald-500 shadow-sm md:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ingresos (Año)</p>
                            <p className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.totalRevenue.toFixed(2)}€</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="min-w-[85vw] snap-center md:min-w-0 p-6 border-l-4 border-amber-500 shadow-sm md:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pendiente</p>
                            <p className="text-3xl font-black text-amber-600 tracking-tighter">{stats.pendingAmount.toFixed(2)}€</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="min-w-[85vw] snap-center md:min-w-0 p-6 border-l-4 border-indigo-500 shadow-sm md:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Este Mes</p>
                            <p className="text-3xl font-black text-indigo-600 tracking-tighter">{stats.currentMonthRevenue.toFixed(2)}€</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                            <Euro size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & List */}
            <Card>
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-80 focus-within:ring-2 ring-indigo-100 transition-all shadow-sm">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente o número..."
                            className="bg-transparent border-none outline-none text-sm w-full font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-1 -mx-1 scrollbar-hide">
                        {['ALL', 'DRAFT', 'PENDING', 'PAID'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as any)}
                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap active:scale-95 ${statusFilter === status
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'bg-white text-slate-500 border border-slate-200'
                                    }`}
                            >
                                {status === 'ALL' ? 'Todos' : status === 'DRAFT' ? 'Borrador' : status === 'PENDING' ? 'Pendiente' : 'Pagado'}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-slate-100 rounded-xl bg-white">
                                <Skeleton className="h-6 w-24" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText size={32} className="text-slate-300" />
                        </div>
                        <p>No se encontraron facturas.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* MOBILE VIEW (CARDS) - TITANIUM ADAPTATION */}
                        <div className="md:hidden space-y-4">
                            {filteredInvoices.map((inv) => (
                                <div key={inv.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-mono text-xs font-bold text-slate-500 mb-1">{inv.number}</p>
                                            <h3 className="font-bold text-slate-900 text-lg">{inv.patientName}</h3>
                                            <p className="text-xs text-slate-400">{format(new Date(inv.date), 'dd/MM/yyyy')}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide border ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                inv.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {inv.status === 'PAID' && <CheckCircle size={10} />}
                                                {inv.status === 'PENDING' && <Clock size={10} />}
                                                {inv.status}
                                            </span>
                                            <p className="text-xl font-black text-slate-900 mt-1">{inv.total.toFixed(2)}€</p>
                                        </div>
                                    </div>

                                    {/* MOBILE ACTIONS (ALWAYS VISIBLE) */}
                                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                                        {inv.status === 'PENDING' ? (
                                            <button
                                                onClick={() => handleMarkPaid(inv)}
                                                className="flex flex-col items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 active:bg-emerald-100"
                                            >
                                                <CheckCircle size={18} />
                                                <span className="text-[10px] font-bold uppercase">Cobrar</span>
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 text-slate-400">
                                                <CheckCircle size={18} />
                                                <span className="text-[10px] font-bold uppercase">Pagado</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                if (settings) {
                                                    PdfGenerator.generateInvoice(inv, settings, settings.billing?.logoUrl);
                                                } else {
                                                    alert("Configuración no cargada.");
                                                }
                                            }}
                                            className="flex flex-col items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 text-blue-700 active:bg-blue-100"
                                        >
                                            <FileText size={18} />
                                            <span className="text-[10px] font-bold uppercase">Factura</span>
                                        </button>

                                        <button
                                            onClick={() => deleteInvoice(inv.id)}
                                            className="flex flex-col items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-700 active:bg-red-100"
                                        >
                                            <Trash2 size={18} />
                                            <span className="text-[10px] font-bold uppercase">Borrar</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* DESKTOP VIEW (TABLE) - EXACTAMENTE IGUAL QUE ANTES */}
                        <table className="hidden md:table w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Número</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                inv.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {inv.status === 'PAID' && <CheckCircle size={10} />}
                                                {inv.status === 'PENDING' && <Clock size={10} />}
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{inv.number}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{inv.patientName}</td>
                                        <td className="px-6 py-4 text-slate-500">{format(new Date(inv.date), 'dd/MM/yyyy')}</td>
                                        <td className="px-6 py-4 text-right font-black text-slate-900">{inv.total.toFixed(2)}€</td>
                                        <td className="px-6 py-4 text-center flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {inv.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleMarkPaid(inv)}
                                                    className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
                                                    title="Marcar como Pagado"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (settings) {
                                                        PdfGenerator.generateInvoice(inv, settings, settings.billing?.logoUrl);
                                                    } else {
                                                        alert("Configuración no cargada.");
                                                    }
                                                }}
                                                className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                                title="Descargar PDF"
                                            >
                                                <FileText size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteInvoice(inv.id)}
                                                className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <InvoiceWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
        </div>
    );
};
