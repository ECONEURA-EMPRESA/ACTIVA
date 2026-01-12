import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Check, Sparkles, X } from 'lucide-react';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    limitType?: 'patient' | 'session';
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, limitType = 'patient' }) => {
    if (!isOpen) return null;

    const isPatientLimit = limitType === 'patient';
    const limitText = isPatientLimit
        ? "Has alcanzado el límite gratuito de 2 pacientes."
        : "Has alcanzado el límite de sesiones mensuales.";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            <Card className="w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden border-0 shadow-2xl shadow-pink-500/20 bg-white">
                {/* Header Decor - Commercial Gradient */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600" />

                {/* Close Button - Subtle */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-20"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Content Section */}
                    <div className="p-8 w-full">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-pink-200">
                                <Sparkles size={12} className="fill-current" /> Oferta Limitada Titanium
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                                Desbloquea tu Potencial
                            </h2>
                            <p className="text-slate-500 text-sm">{limitText}</p>
                        </div>

                        {/* Pricing Anchor - THE CORE SELLING POINT */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                -40% DTO
                            </div>
                            <p className="text-slate-400 text-sm font-medium decoration-slate-400/50 mb-1">
                                Precio Habitual: <span className="line-through decoration-red-400 decoration-2">500€</span>
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                    299€
                                </span>
                                <span className="text-sm font-bold text-slate-600">/ único</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Pago único de por vida. Sin suscripciones.</p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0"><Check size={14} className="text-emerald-700" /></div>
                                <div>
                                    <span className="text-sm font-bold text-slate-800 block">Pacientes Ilimitados</span>
                                    <span className="text-xs text-slate-500">Gestiona toda tu cartera sin restricciones.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0"><Check size={14} className="text-emerald-700" /></div>
                                <div>
                                    <span className="text-sm font-bold text-slate-800 block">Informes Clínicos Profesionales (PDF)</span>
                                    <span className="text-xs text-slate-500">Genera devoluciones automáticas en un clic.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0"><Check size={14} className="text-emerald-700" /></div>
                                <div>
                                    <span className="text-sm font-bold text-slate-800 block">Soporte Prioritario & Actualizaciones</span>
                                    <span className="text-xs text-slate-500">Acceso VIP a futuras mejoras del software.</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="space-y-4">
                            <Button
                                variant="primary"
                                className="w-full py-6 text-xl shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 relative overflow-hidden group transition-all transform hover:-translate-y-1"
                                onClick={() => {
                                    // Using the specific checkout link
                                    window.open('https://activamusicoterapia.lemonsqueezy.com/checkout/buy/311e8710-d3d8-454c-81f7-200df2a59455', '_blank');
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 font-black">
                                    <Sparkles size={20} className="fill-white" />
                                    APROVECHAR OFERTA (299€)
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>

                            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1"><Check size={10} /> Pago 100% Seguro</span>
                                <span>•</span>
                                <span>Factura Deducible</span>
                                <span>•</span>
                                <span>Garantía de Satisfacción</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
