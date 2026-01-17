import { PlayCircle, Video, Receipt, Sparkles, Settings, BadgeCheck, Smartphone, Monitor, Tablet } from 'lucide-react';
import { RevealSection } from '../ui/RevealSection';
import crmDesktop from '../../assets/images/hero-desktop.jpg';
import crmTablet from '../../assets/images/hero-tablet.jpg';
import crmMobile from '../../assets/images/hero-mobile.jpg';
import { useCountUp } from '../../hooks/useCountUp';

const Counter = ({ value }: { value: number }) => {
    const count = useCountUp(value, 2000);
    return <>{count}</>;
};

interface SoftwareProps {
    onOpenModal?: (modal: string) => void;
}

export const Software = ({ onOpenModal }: SoftwareProps) => {
    return (
        <section id="software" className="relative overflow-hidden py-32 px-6 lg:px-12 bg-white border-y border-gray-100">
            {/* Refined Background decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#EC008C] rounded-full blur-[200px] opacity-[0.04] pointer-events-none animate-breathe"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3B82F6] rounded-full blur-[200px] opacity-[0.04] pointer-events-none animate-breathe-slow"></div>

            <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-20 items-center">

                {/* Text Content */}
                <RevealSection>
                    <div className="flex flex-col gap-10 relative z-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0A0F1D] border border-gray-800 w-fit shadow-xl">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC008C] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EC008C]"></span>
                            </span>
                            <span className="text-xs font-['Outfit'] font-bold text-white tracking-[0.2em] uppercase">Ecosistema Activa 360°</span>
                        </div>
                        <h2 className="text-[#0A0F1D] tracking-tighter text-4xl lg:text-6xl font-['Outfit'] font-black leading-[0.95] max-w-2xl">
                            Tu consulta,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC008C] to-[#3B82F6]">en cualquier lugar.</span>
                        </h2>
                        <p className="text-[#64748B] font-['Inter'] text-xl leading-relaxed font-light max-w-lg">
                            Accede a la historia clínica, gestión de citas y biofeedback en tiempo real desde todos tus dispositivos sincronizados.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-8">
                            <div className="text-center">
                                <p className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D]"><Counter value={100} />%</p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Sincronización</p>
                            </div>
                            <div className="text-center border-x border-gray-100">
                                <p className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D]"><Counter value={24} />/7</p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Disponibilidad</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D]"><Counter value={3} /></p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Dispositivos</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <button onClick={() => onOpenModal?.('book')} className="flex cursor-pointer items-center justify-center rounded-2xl h-16 px-10 bg-[#EC008C] hover:bg-[#D6007E] transition-all text-white text-base font-['Outfit'] font-bold shadow-2xl shadow-[#EC008C]/30 transform active:scale-95 duration-300 uppercase tracking-wide">
                                Prueba Gratuita 14 días
                            </button>
                            <button onClick={() => onOpenModal?.('clinic')} className="flex cursor-pointer items-center justify-center rounded-2xl h-16 px-10 bg-white border border-gray-200 hover:border-[#0A0F1D] text-[#0A0F1D] text-base font-['Outfit'] font-bold transition-all group active:scale-95 duration-300 hover:shadow-xl uppercase tracking-wide">
                                <PlayCircle className="mr-3 group-hover:text-[#EC008C] transition-colors" size={24} />
                                Demo Interactiva
                            </button>
                        </div>
                    </div>
                </RevealSection>

                {/* DEVICE ECOSYSTEM COMPOSITION */}
                <div className="relative z-10 w-full lg:h-[800px] flex items-center justify-center perspective-container py-20 lg:py-0">

                    {/* DESKTOP (Back Center) */}
                    <div className="relative w-[90%] lg:w-[800px] aspect-[16/10] bg-[#0A0F1D] rounded-xl shadow-2xl shadow-[#0A0F1D]/30 border-[6px] border-[#0A0F1D] ring-1 ring-gray-800 z-10 transition-transform duration-700 hover:scale-[1.01] overflow-hidden group/desktop">
                        {/* Screen */}
                        <div className="w-full h-full bg-slate-900 overflow-hidden relative">
                            <img src={crmDesktop} alt="Panel de Control Clínico CRM Método Activa en Escritorio" className="w-full h-full object-contain bg-slate-900 opacity-90 group-hover/desktop:opacity-100 transition-opacity" loading="lazy" />
                            {/* Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                        </div>
                        {/* Stand */}
                        <div className="absolute left-1/2 -bottom-6 w-1/3 h-4 bg-gradient-to-b from-[#222] to-[#111] -translate-x-1/2 rounded-b-xl"></div>
                    </div>

                    {/* TABLET (Bottom Right Overlap) */}
                    <div className="absolute -bottom-10 right-0 lg:-right-12 lg:bottom-20 w-[60%] lg:w-[450px] aspect-[4/3] bg-[#1a1a1a] rounded-[1.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-[8px] border-[#1a1a1a] ring-1 ring-gray-700 z-20 animate-float" style={{ animationDelay: '1s' }}>
                        <div className="w-full h-full bg-slate-800 rounded-2xl overflow-hidden relative group/tablet">
                            <img src={crmTablet} alt="Gestión de Pacientes en Tablet para Terapeutas" className="w-full h-full object-contain bg-slate-800" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        {/* Camera Dot */}
                        <div className="absolute top-1/2 -right-1.5 w-1 h-8 bg-gray-600 rounded-l-md -translate-y-1/2"></div>
                    </div>

                    {/* MOBILE (Bottom Left Overlap) */}
                    <div className="absolute -bottom-20 left-4 lg:left-0 lg:bottom-40 w-[35%] lg:w-[240px] aspect-[9/19.5] bg-black rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(236,0,140,0.4)] border-[8px] border-black ring-1 ring-gray-800 z-30 animate-float" style={{ animationDelay: '0s' }}>
                        <div className="w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden relative group/mobile">
                            <img src={crmMobile} alt="App Móvil PWA Método Activa para Pacientes" className="w-full h-full object-contain bg-black" loading="lazy" />
                            {/* Dynamic Notch/Bar */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-xl z-40"></div>
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-40"></div>
                        </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute right-10 top-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-[#3B82F6]/20 animate-bounce delay-1000 hidden lg:block z-40 border border-white/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#3B82F6]/10 p-2.5 rounded-full text-[#3B82F6]"><Sparkles size={20} /></div>
                            <div>
                                <p className="text-xs text-[#64748B] font-medium uppercase tracking-wide">Actualización</p>
                                <p className="text-sm font-bold text-[#0A0F1D] font-['Outfit']">CRM v2.3 Disponible</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

