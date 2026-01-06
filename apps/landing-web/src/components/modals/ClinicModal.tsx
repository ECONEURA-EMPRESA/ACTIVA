import { User, Users, Clock, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface ClinicModalProps {
    formStep: number;
    setFormStep: Dispatch<SetStateAction<number>>;
}

export const ClinicModal = ({ formStep, setFormStep }: ClinicModalProps) => {
    return (
        <div className="space-y-8 font-['Inter']">
            <div className="grid grid-cols-2 gap-5">
                <button
                    onClick={() => setFormStep(1)}
                    className={`p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden group text-left ${formStep === 1 ? 'border-[#EC008C] bg-[#FDF2F8]/40 ring-1 ring-[#EC008C]/20 shadow-xl' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1'}`}
                >
                    <div className={`p-4 rounded-2xl w-fit mb-6 transition-colors duration-300 ${formStep === 1 ? 'bg-[#EC008C] text-white shadow-lg shadow-[#EC008C]/30' : 'bg-slate-50 text-[#64748B] group-hover:text-[#0A0F1D] group-hover:bg-white'}`}><User size={24} strokeWidth={1.5} /></div>
                    <h4 className="font-['Outfit'] font-bold text-[#0A0F1D] text-2xl tracking-tight">Individual</h4>
                    <p className="text-sm text-[#64748B] mt-1 font-medium">Neurocognitivo</p>
                    <div className="mt-6 pt-4 border-t border-gray-100/80 flex items-baseline gap-1">
                        <span className="text-[#0A0F1D] font-bold text-xl">$60</span><span className="text-xs text-gray-400">/sesión</span>
                    </div>
                </button>
                <button
                    onClick={() => setFormStep(2)}
                    className={`p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden group text-left ${formStep === 2 ? 'border-[#EC008C] bg-[#FDF2F8]/40 ring-1 ring-[#EC008C]/20 shadow-xl' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1'}`}
                >
                    <div className={`p-4 rounded-2xl w-fit mb-6 transition-colors duration-300 ${formStep === 2 ? 'bg-[#EC008C] text-white shadow-lg shadow-[#EC008C]/30' : 'bg-slate-50 text-[#64748B] group-hover:text-[#0A0F1D] group-hover:bg-white'}`}><Users size={24} strokeWidth={1.5} /></div>
                    <h4 className="font-['Outfit'] font-bold text-[#0A0F1D] text-2xl tracking-tight">Grupal</h4>
                    <p className="text-sm text-[#64748B] mt-1 font-medium">Talleres Memoria</p>
                    <div className="mt-6 pt-4 border-t border-gray-100/80 flex items-baseline gap-1">
                        <span className="text-[#0A0F1D] font-bold text-xl">$25</span><span className="text-xs text-gray-400">/sesión</span>
                    </div>
                </button>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100">
                <h4 className="font-['Outfit'] font-bold text-[#0A0F1D] text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-400"><Clock size={16} /> Disponibilidad Próxima</h4>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {['Lun 12', 'Mar 13', 'Mié 14', 'Jue 15'].map((day, i) => (
                        <div key={i} className="flex-shrink-0 w-24 h-28 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#EC008C] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-[#EC008C] transition-colors"></div>
                            <span className="text-[10px] uppercase font-bold text-[#94A3B8] group-hover:text-[#EC008C] mb-1 tracking-wider">{day.split(' ')[0]}</span>
                            <span className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D]">{day.split(' ')[1]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => {
                    import('../../utils/confetti').then(({ triggerConfetti }) => triggerConfetti());
                }}
                className="w-full bg-[#EC008C] text-white py-5 rounded-2xl font-['Outfit'] font-bold hover:bg-[#D6007E] transition-all shadow-2xl shadow-[#EC008C]/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] duration-300 relative overflow-hidden"
            >
                Confirmar Reserva <ChevronRight size={20} />
            </button>
        </div>
    );
};
