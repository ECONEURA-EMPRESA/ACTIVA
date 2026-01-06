import { ArrowUpRight, User, Users, Gamepad2, ArrowRight, FlaskConical } from 'lucide-react';
import { RevealSection } from '../ui/RevealSection';
import { SpotlightCard } from '../ui/SpotlightCard';

interface ServicesProps {
    onOpenModal: (modal: string) => void;
}

export const Services = ({ onOpenModal }: ServicesProps) => {
    return (
        <section id="clinica" className="py-32 px-6 lg:px-12 bg-[#F8FAFC] relative border-y border-gray-100">
            <div className="max-w-[1440px] mx-auto relative z-10">
                <RevealSection>
                    <div className="flex flex-col items-center justify-center text-center mb-24">
                        <span className="text-[#EC008C] font-['Outfit'] font-bold tracking-[0.2em] uppercase text-xs mb-4 bg-white px-5 py-2 rounded-full shadow-sm border border-gray-100">Excelencia Clínica</span>
                        <h2 className="text-[#0A0F1D] text-5xl md:text-6xl font-['Outfit'] font-black leading-tight tracking-tighter pb-6">Nuestros Servicios</h2>
                        <p className="text-[#64748B] max-w-2xl text-xl font-['Inter'] leading-relaxed font-light">
                            Terapias de rehabilitación personalizadas en formatos flexibles: Presencial, Online, Individual y Grupal.
                        </p>
                    </div>
                </RevealSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {/* Card 1: Neuro-Geriatría */}
                    <SpotlightCard
                        onClick={() => onOpenModal('clinic')}
                        className="group flex flex-col justify-end rounded-[2.5rem] bg-[#0A0F1D] shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-[1.01] lg:row-span-2 min-h-[520px] lg:min-h-full cursor-pointer ring-1 ring-white/10"
                    >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-70" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000")' }} role="img" aria-label="Terapia de estimulación cognitiva para adultos mayores"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/80 to-transparent opacity-90"></div>
                        <div className="relative z-10 p-10 flex flex-col h-full justify-end">
                            <div className="mb-auto pt-2">
                                <span className="inline-flex items-center rounded-lg bg-[#EC008C] px-4 py-2 text-[10px] font-['Outfit'] font-bold text-white shadow-xl shadow-[#EC008C]/30 uppercase tracking-widest">Alta Especialidad</span>
                            </div>
                            <h3 className="text-4xl font-['Outfit'] font-bold text-white mb-5 tracking-tight">Neuro-Geriatría</h3>
                            <p className="text-gray-300 font-['Inter'] text-lg mb-10 leading-relaxed font-light border-l-2 border-[#EC008C] pl-5">
                                Estimulación cognitiva para Alzheimer y Parkinson. Disponibles sesiones individuales a domicilio o talleres grupales de memoria.
                            </p>
                            <div className="flex items-center justify-between mt-2 border-t border-white/10 pt-8">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-white/90 text-sm font-['Inter'] font-medium"><User size={18} className="text-[#EC008C]" /> Individual: Reactivación</div>
                                    <div className="flex items-center gap-3 text-white/90 text-sm font-['Inter'] font-medium"><Users size={18} className="text-[#EC008C]" /> Grupal: Coro Terapéutico</div>
                                </div>
                                <button className="h-14 w-14 flex items-center justify-center rounded-full bg-white text-[#0A0F1D] hover:bg-[#EC008C] hover:text-white transition-all duration-300 shadow-xl transform hover:rotate-45 active:scale-90">
                                    <ArrowUpRight size={28} />
                                </button>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Card 2: Atención Temprana */}
                    <SpotlightCard
                        onClick={() => onOpenModal('clinic')}
                        className="group flex flex-col justify-between rounded-[2.5rem] bg-white p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer ring-1 ring-black/5"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none text-[#0A0F1D]"><Gamepad2 size={200} /></div>
                        <div className="flex flex-col items-start gap-8 z-10 w-full">
                            <div className="h-16 w-16 flex items-center justify-center rounded-3xl bg-[#FDF2F8] text-[#EC008C] ring-1 ring-[#EC008C]/20">
                                <Gamepad2 size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D] mb-4 tracking-tight">Atención Temprana</h3>
                                <p className="text-[#64748B] font-['Inter'] text-base leading-relaxed">
                                    Intervención infantil para autismo y TDAH. Sesiones familiares y grupos de habilidades sociales.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 relative z-10">
                            <button className="flex items-center gap-3 text-sm font-['Outfit'] font-bold text-[#EC008C] hover:text-[#D6007E] transition-colors group/btn uppercase tracking-wide">
                                Saber más <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-2" />
                            </button>
                        </div>
                    </SpotlightCard>

                    {/* Card 3: Modalidades */}
                    <SpotlightCard
                        onClick={() => onOpenModal('clinic')}
                        className="group flex flex-col justify-center items-center text-center rounded-[2.5rem] bg-[#0A0F1D] text-white p-10 shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ring-1 ring-white/10"
                    >
                        {/* Abstract Tech Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                        <div className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-[#3B82F6] rounded-full blur-[80px] opacity-30 animate-pulse pointer-events-none"></div>
                        <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-[#EC008C] rounded-full blur-[80px] opacity-30 animate-pulse delay-700 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col gap-8 w-full">
                            <h3 className="text-lg font-['Outfit'] font-bold pb-2 uppercase tracking-[0.2em] text-[#64748B]">Atención Flexible</h3>

                            <div className="flex items-center justify-between text-left gap-5 bg-white/5 p-5 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors cursor-default group/item">
                                <div className="bg-[#EC008C] p-4 rounded-2xl text-white shadow-lg shadow-[#EC008C]/30 group-hover/item:scale-105 transition-transform"><User size={24} /></div>
                                <div>
                                    <p className="font-['Outfit'] font-bold text-xl">Individual</p>
                                    <p className="text-gray-400 text-xs font-['Inter']">Enfoque clínico 1 a 1</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-left gap-5 bg-white/5 p-5 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors cursor-default group/item">
                                <div className="bg-[#3B82F6] p-4 rounded-2xl text-white shadow-lg shadow-[#3B82F6]/30 group-hover/item:scale-105 transition-transform"><Users size={24} /></div>
                                <div>
                                    <p className="font-['Outfit'] font-bold text-xl">Grupal</p>
                                    <p className="text-gray-400 text-xs font-['Inter']">Socialización y Talleres</p>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Card 4: Método Científico */}
                    <div className="lg:col-span-2 group relative flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ring-1 ring-black/5">
                        <div className="flex-1 p-12 flex flex-col justify-center gap-8 z-10">
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-3 text-[#3B82F6] text-xs font-['Outfit'] font-bold uppercase tracking-widest">
                                    <FlaskConical size={18} /> <span>Rigor Clínico</span>
                                </div>
                                <h3 className="text-4xl font-['Outfit'] font-bold text-[#0A0F1D] tracking-tight">Método Científico</h3>
                                <p className="text-[#64748B] font-['Inter'] text-lg leading-relaxed font-light">
                                    Nuestros protocolos no son improvisados; están basados en la evidencia más reciente de neurociencia.
                                </p>
                            </div>
                            <div>
                                <button className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-[#0A0F1D] text-white text-sm font-['Outfit'] font-bold hover:bg-[#3B82F6] transition-all duration-300 transform active:scale-95 shadow-xl uppercase tracking-wider">
                                    Nuestra Metodología
                                </button>
                            </div>
                        </div>
                        <div className="relative w-full md:w-[45%] h-64 md:h-auto overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-217358c7e618?auto=format&fit=crop&q=80&w=1000")' }} role="img" aria-label="Investigación científica y neurociencia aplicada a la musicoterapia"></div>
                            <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white"></div>
                            <div className="md:hidden absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
