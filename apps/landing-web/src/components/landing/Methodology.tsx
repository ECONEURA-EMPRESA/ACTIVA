import { BookOpen, ArrowUpRight, CheckCircle, ArrowRight, HeartPulse, User, Users, Brain, Calendar, GraduationCap } from 'lucide-react';
import { RevealSection } from '../ui/RevealSection';

interface MethodologyProps {
    onOpenModal: (modal: string) => void;
}

export const Methodology = ({ onOpenModal }: MethodologyProps) => {
    return (
        <section id="metodo" className="py-32 px-6 lg:px-12 bg-white relative">
            <div className="max-w-[1440px] mx-auto">
                <RevealSection>
                    <div className="text-center mb-24 max-w-4xl mx-auto">
                        <span className="text-[#3B82F6] text-xs font-['Outfit'] font-bold tracking-[0.2em] uppercase bg-[#EFF6FF] px-5 py-2.5 rounded-full border border-[#3B82F6]/20">Nuestra Esencia</span>
                        <h2 className="text-[#0A0F1D] text-5xl md:text-6xl lg:text-7xl font-['Outfit'] font-black leading-[1.05] tracking-tighter mt-8">
                            Musicoterapia basada en<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC008C] to-[#3B82F6]">ciencia y empatía</span>
                        </h2>
                        <p className="text-[#64748B] text-xl font-['Inter'] mt-8 leading-relaxed font-light">
                            Integramos protocolos clínicos, tecnología innovadora y formación académica.
                        </p>
                    </div>
                </RevealSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
                    {/* Card 1 */}
                    <RevealSection delay={100}>
                        <div className="group relative flex flex-col gap-8 rounded-[2.5rem] bg-slate-50 p-10 shadow-lg hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-3 transition-all duration-700 border border-gray-100 h-full">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-white text-orange-500 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100">
                                        <BookOpen size={40} strokeWidth={1.5} />
                                    </div>
                                    <span className="bg-orange-50 text-orange-600 text-[10px] font-['Outfit'] font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-orange-100">Fundamentos</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D] group-hover:text-orange-600 transition-colors tracking-tight">Libro: Método Activa</h3>
                                    <a href="https://metodoactiva.es" target="_blank" rel="noreferrer" className="text-xs font-bold text-orange-500 uppercase tracking-wider hover:underline flex items-center gap-1.5 w-fit">
                                        metodoactiva.es <ArrowUpRight size={12} />
                                    </a>
                                    <p className="text-[#64748B] font-['Inter'] leading-relaxed text-lg">
                                        El manual definitivo que explica la ciencia detrás del ritmo. Un protocolo clínico detallado paso a paso.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 flex-1 font-['Inter'] pt-4">
                                {['Teoría de los 3 Cerebros', 'Casos clínicos reales', 'Protocolo de 21 días'].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 text-[#0A0F1D] font-medium text-base bg-white p-4 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                                        <CheckCircle size={20} className="text-orange-500 mt-0.5 shrink-0" /> {item}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => onOpenModal('book')}
                                className="w-full mt-auto py-5 px-8 rounded-2xl border-2 border-gray-200 text-[#0A0F1D] font-['Outfit'] font-bold text-sm hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-3 group-hover:bg-white active:scale-95 duration-300 uppercase tracking-wider"
                            >
                                <span>Leer el libro</span> <ArrowRight size={18} />
                            </button>
                        </div>
                    </RevealSection>

                    {/* Card 2 */}
                    <RevealSection delay={200}>
                        <div className="group relative flex flex-col gap-8 rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-[#EC008C]/10 hover:shadow-[#EC008C]/20 hover:-translate-y-3 transition-all duration-700 border border-[#EC008C]/20 ring-4 ring-[#EC008C]/5 h-full z-10">
                            <div className="absolute top-0 right-0 bg-[#EC008C] text-white text-[10px] font-bold px-5 py-2 rounded-bl-3xl rounded-tr-[2.2rem] font-['Outfit'] shadow-lg tracking-widest uppercase">Más Solicitado</div>
                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-[#FDF2F8] text-[#EC008C] group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-[#EC008C]/20">
                                        <HeartPulse size={40} strokeWidth={1.5} />
                                    </div>
                                    <span className="bg-[#FDF2F8] text-[#EC008C] text-[10px] font-['Outfit'] font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-[#EC008C]/20">Pacientes</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D] group-hover:text-[#EC008C] transition-colors tracking-tight">Clínica Activa</h3>
                                    <p className="text-[#64748B] font-['Inter'] leading-relaxed text-lg">
                                        Centros de neurorrehabilitación con espacios diseñados acústicamente para maximizar el entrainment.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 flex-1 relative z-10 font-['Inter'] pt-4">
                                {[
                                    { icon: User, text: 'Sesiones Individuales' },
                                    { icon: Users, text: 'Talleres Grupales' },
                                    { icon: Brain, text: 'Biofeedback en tiempo real' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 text-[#0A0F1D] font-medium text-base bg-[#FDF2F8]/50 p-4 rounded-2xl border border-[#EC008C]/10 hover:border-[#EC008C]/30 transition-colors">
                                        <item.icon size={20} className="text-[#EC008C] mt-0.5 shrink-0" /> {item.text}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => onOpenModal('clinic')}
                                className="w-full mt-auto py-5 px-8 rounded-2xl bg-[#EC008C] text-white font-['Outfit'] font-bold text-sm hover:bg-[#D6007E] transition-all shadow-xl shadow-[#EC008C]/30 flex items-center justify-center gap-3 relative z-10 active:scale-95 duration-300 uppercase tracking-wider"
                            >
                                <span>Agendar cita</span> <Calendar size={18} />
                            </button>
                        </div>
                    </RevealSection>

                    {/* Card 3 */}
                    <RevealSection delay={300}>
                        <div className="group relative flex flex-col gap-8 rounded-[2.5rem] bg-slate-50 p-10 shadow-lg hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-3 transition-all duration-700 border border-gray-100 h-full">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-white text-[#3B82F6] group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100">
                                        <GraduationCap size={40} strokeWidth={1.5} />
                                    </div>
                                    <span className="bg-blue-50 text-[#3B82F6] text-[10px] font-['Outfit'] font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-blue-100">Formación</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-['Outfit'] font-bold text-[#0A0F1D] group-hover:text-[#3B82F6] transition-colors tracking-tight">Curso Certificado</h3>
                                    <p className="text-[#64748B] font-['Inter'] leading-relaxed text-lg">
                                        Fórmate como facilitador del Método Activa. Programa híbrido (Online + Presencial).
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 flex-1 font-['Inter'] pt-4">
                                {['Certificación oficial', 'Prácticas clínicas', 'Bolsa de trabajo'].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 text-[#0A0F1D] font-medium text-base bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                                        <CheckCircle size={20} className="text-[#3B82F6] mt-0.5 shrink-0" /> {item}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => onOpenModal('course')}
                                className="w-full mt-auto py-5 px-8 rounded-2xl border-2 border-gray-200 text-[#0A0F1D] font-['Outfit'] font-bold text-sm hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors flex items-center justify-center gap-3 group-hover:bg-white active:scale-95 duration-300 uppercase tracking-wider"
                            >
                                <span>Ver temario</span> <ArrowRight size={18} />
                            </button>
                        </div>
                    </RevealSection>
                </div>
            </div>
        </section>
    );
};
