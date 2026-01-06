import React from 'react';
import { Crown, Check as CheckIcon, Zap as ZapIcon } from 'lucide-react';
import { Button } from './Button';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    limitType: 'patient' | 'session';
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
    isOpen,
    onClose,
    limitType,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
                        <Crown size={32} className="text-white" />
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                        Desbloquea el Potencial Ilimitado
                    </h2>
                    <p className="text-slate-300 font-medium">
                        Has alcanzado el límite de tu Demo Gratuita.
                    </p>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6">
                        <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                            <ZapIcon size={16} />
                            Límites de la Demo:
                        </h3>
                        <ul className="space-y-2 text-sm text-yellow-700">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                Máximo 1 Paciente ({limitType === 'patient' ? 'Alcanzado' : '1/1'})
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                Máximo 1 Sesión ({limitType === 'session' ? 'Alcanzado' : '1/1'})
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 text-lg">
                            La Licencia Vitalicia Incluye:
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                'Pacientes Ilimitados',
                                'Sesiones Ilimitadas',
                                'Modo Hospital (Offline)',
                                'Analítica Avanzada',
                                'Generador de Informes',
                                'Soporte Prioritario'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <CheckIcon size={12} className="text-emerald-600" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex items-end justify-center gap-2 mb-4">
                            <span className="text-xs text-slate-400 line-through font-medium mb-1">499€</span>
                            <span className="text-3xl font-black text-slate-900">299€</span>
                            <span className="text-xs font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full mb-1">
                                OFERTA FOUNDERS
                            </span>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full py-4 text-lg shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30"
                            onClick={() => window.open('https://activamusicoterapia.lemonsqueezy.com/checkout/buy/311e8710-d3d8-454c-81f7-200df2a59455', '_blank')}
                        >
                            Obtener Licencia de Por Vida
                        </Button>

                        <button
                            onClick={onClose}
                            className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Quizás más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
