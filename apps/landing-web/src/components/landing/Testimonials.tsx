import { Quote, Star, Building2, Users, Award, LucideIcon } from 'lucide-react';
import { NeonIcon } from '../ui/NeonIcon';
import { RevealSection } from '../ui/RevealSection';

const TrustBadge = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-lg transition-all group">
        <Icon className="w-8 h-8 text-[#EC008C] mb-3 group-hover:scale-110 transition-transform" />
        <span className="text-3xl font-['Outfit'] font-bold text-slate-900 mb-1">{value}</span>
        <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">{label}</span>
    </div>
);

export const Testimonials = () => {
    return (
        <section className="relative py-32 overflow-hidden bg-slate-50">

            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
                <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-[#EC008C]/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">

                {/* HEADLINE */}
                <RevealSection>
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-slate-500 mb-6 shadow-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold tracking-widest uppercase">EXCELENCIA CLÍNICA</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-['Outfit'] font-black text-slate-900 leading-tight mb-6 tracking-tighter">
                            Historias de <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC008C] to-cyan-500">Vida y Superación</span>
                        </h2>
                        <p className="text-slate-600 text-xl font-['Inter'] font-light leading-relaxed max-w-2xl mx-auto">
                            Más de 20 años transformando diagnósticos en melodías de recuperación. La evidencia más fuerte son sus voces.
                        </p>
                    </div>
                </RevealSection>

                {/* TRUST METRICS REMOVED AS PER USER REQUEST */}

                {/* TESTIMONIALS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            quote: "Activa ha sido un milagro para la rehabilitación de mi hijo. La música logró conectar con él cuando las palabras ya no llegaban.",
                            name: "María G.",
                            role: "Madre de Paciente",
                            highlight: "Conexión Emocional"
                        },
                        {
                            quote: "El diplomado me dio las herramientas científicas para llevar mi práctica musical al siguiente nivel clínico. Un antes y un después.",
                            name: "Carlos R.",
                            role: "Musicoterapeuta Certificado",
                            highlight: "Formación de Élite"
                        },
                        {
                            quote: "El software especializado nos permite medir el progreso cognitivo de forma objetiva. Es la pieza que faltaba en la neurorehabilitación.",
                            name: "Dra. Ana L.",
                            role: "Neuropsicóloga Clínica",
                            highlight: "Tecnología Sanitaria"
                        }
                    ].map((item, i) => (
                        <RevealSection key={i} delay={i * 150}>
                            <div className="group relative h-full bg-white border border-gray-100 rounded-[2rem] p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-2 overflow-hidden">

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-8">
                                        <Quote className="w-10 h-10 text-gray-200 group-hover:text-[#EC008C] transition-colors" />
                                        <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wide">
                                            {item.highlight}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-lg font-['Inter'] font-light leading-relaxed italic mb-8 flex-grow">
                                        "{item.quote}"
                                    </p>

                                    <div className="border-t border-gray-100 pt-6 mt-auto">
                                        <p className="text-slate-900 font-['Outfit'] font-bold text-lg">{item.name}</p>
                                        <p className="text-cyan-600 text-sm font-medium">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>
                    ))}
                </div>
            </div>
        </section>
    );
};
