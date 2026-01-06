import { HeartPulse, Stethoscope, Brain } from 'lucide-react';
import { RevealSection } from '../ui/RevealSection';
import heroImg from '../../assets/images/hero-main.jpg';

interface HeroProps {
    onOpenModal: (modal: string) => void;
}

export const Hero = ({ onOpenModal }: HeroProps) => {
    return (
        <div className="relative bg-slate-50 min-h-screen flex items-center pt-20 pb-32">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#EC008C] rounded-full blur-[180px] opacity-[0.06] translate-x-1/3 -translate-y-1/4 animate-breathe pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#3B82F6] rounded-full blur-[200px] opacity-[0.06] -translate-x-1/4 translate-y-1/4 animate-breathe-slow pointer-events-none"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full relative z-10">
                <RevealSection>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Text Area */}
                        <div className="lg:col-span-7 flex flex-col gap-10 z-20">
                            <div className="flex justify-start">
                                <div className="glass-card inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/40 shadow-sm hover:shadow-md transition-shadow cursor-default group backdrop-blur-md">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3B82F6]"></span>
                                    </span>
                                    <span className="text-[#0A0F1D] text-xs font-['Outfit'] font-bold uppercase tracking-widest">Ecosistema Integral de Salud</span>
                                </div>
                            </div>

                            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-['Outfit'] font-extrabold tracking-tighter text-[#0A0F1D] leading-[0.95]">
                                La Música es <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC008C] to-[#3B82F6] relative inline-block pb-2">
                                    Ciencia
                                </span>, Arte<br /> y Salud.
                            </h1>

                            <p className="text-xl text-[#64748B] font-['Inter'] leading-relaxed font-light max-w-2xl">
                                Descubre el <strong className="text-[#0A0F1D] font-bold">Método Activa</strong>: una fusión pionera de neurorehabilitación clínica, tecnología avanzada y formación académica diseñada para transformar vidas a través del sonido.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 pt-4">
                                <button onClick={() => onOpenModal('clinic')} className="h-16 px-10 rounded-full bg-[#EC008C] text-white text-lg font-['Outfit'] font-bold shadow-2xl shadow-[#EC008C]/30 hover:bg-[#D6007E] hover:shadow-[#EC008C]/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-95">
                                    <HeartPulse size={22} className="group-hover:scale-110 transition-transform" />
                                    Soy Paciente
                                </button>
                                <button onClick={() => onOpenModal('course')} className="h-16 px-10 rounded-full bg-white border border-gray-200 text-[#0A0F1D] text-lg font-['Outfit'] font-bold hover:bg-gray-50 hover:border-[#0A0F1D] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-95 group">
                                    <Stethoscope size={22} className="text-[#64748B] group-hover:text-[#3B82F6] transition-colors" />
                                    Soy Profesional
                                </button>
                            </div>
                        </div>

                        {/* Image Area with Overlap */}
                        <div className="lg:col-span-5 relative perspective-container lg:h-[800px] flex items-center">
                            <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-[#0A0F1D]/20 ring-1 ring-white/50 group lg:absolute lg:right-0 lg:top-0 lg:mt-12 lg:w-[120%] lg:-ml-[20%] z-10 tilt-card">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                    style={{ backgroundImage: `url(${heroImg})` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-transparent opacity-60"></div>
                            </div>

                            {/* Floating Glass Card - Overlapping */}
                            <div className="absolute bottom-10 left-0 lg:-left-20 lg:bottom-10 z-30 w-full lg:w-[400px]">
                                <div className="glass-panel p-8 rounded-[2rem] hover:-translate-y-3 transition-all duration-500 group cursor-default">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[#0A0F1D] flex items-center justify-center text-white shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                            <Brain size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-['Outfit'] font-bold text-[#0A0F1D] text-2xl mb-2">Atención Temprana</h3>
                                            <p className="text-sm font-['Inter'] text-[#64748B] font-medium leading-relaxed">
                                                Intervención infantil para autismo y TDAH. Sesiones familiares y grupos de habilidades sociales.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </RevealSection>
            </div>
        </div>
    );
};
