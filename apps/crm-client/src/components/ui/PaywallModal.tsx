import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Check, Sparkles, Lock, X } from 'lucide-react';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    limitType?: 'patient' | 'session';
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, limitType = 'patient' }) => {
    if (!isOpen) return null;

    const isPatientLimit = limitType === 'patient';
    const limitText = isPatientLimit
        ? "Has alcanzado el límite de 2 pacientes del Plan Gratuito."
        : "Has alcanzado el límite de sesiones mensuales.";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={onClose}
            />

            <Card className="w-full max-w-md relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden border-0 shadow-2xl shadow-pink-500/20">
                {/* Header Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Lock size={32} className="text-pink-600" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        Plan Gratuito Completado
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-[280px] mx-auto">
                        {limitText} Pásate a PRO para desbloquear todo el potencial.
                    </p>

                    <div className="space-y-3 mb-8 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full"><Check size={12} className="text-emerald-700" /></div>
                            <span className="text-sm font-medium text-slate-700">Pacientes Ilimitados</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full"><Check size={12} className="text-emerald-700" /></div>
                            <span className="text-sm font-medium text-slate-700">Generación de Informes PDF</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full"><Check size={12} className="text-emerald-700" /></div>
                            <span className="text-sm font-medium text-slate-700">Agenda & Recordatorios WhatsApp</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="primary"
                            className="w-full py-4 text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 relative overflow-hidden group"
                            onClick={() => {
                                window.open('https://activamusicoterapia.lemonsqueezy.com/checkout/buy/311e8710-d3d8-454c-81f7-200df2a59455', '_blank');
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Sparkles size={18} className="fill-white" />
                                Desbloquear PRO
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>

                        <p className="text-[10px] text-center text-slate-400 font-medium">
                            Pago único seguro vía LemonSqueezy • Factura deducible
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
