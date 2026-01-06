import { Quote } from 'lucide-react';
import { RevealSection } from '../ui/RevealSection';

export const Testimonials = () => {
    return (
        <section className="py-32 px-6 lg:px-12 bg-[#F9FAFB]">
            <div className="max-w-[1440px] mx-auto">
                <RevealSection>
                    <div className="text-center mb-24">
                        <h2 className="text-[#0A0F1D] text-4xl md:text-6xl font-['Outfit'] font-black leading-tight pb-6 tracking-tighter">Historias de Transformación</h2>
                        <p className="text-[#64748B] text-xl font-['Inter'] leading-relaxed font-light max-w-3xl mx-auto">
                            Descubre cómo la musicoterapia basada en evidencia cambia vidas.
                        </p>
                    </div>
                </RevealSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                        { quote: "Activa ha sido un milagro para la rehabilitación de mi hijo. La música logró lo que otras terapias no pudieron.", name: "María G.", role: "Madre de paciente", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
                        { quote: "El diplomado me dio las herramientas científicas para llevar mi práctica musical al siguiente nivel clínico.", name: "Carlos R.", role: "Estudiante", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
                        { quote: "El software especializado nos permite medir el progreso cognitivo de forma objetiva y musical. Indispensable.", name: "Dra. Ana L.", role: "Neuropsicóloga", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" }
                    ].map((item, i) => (
                        <RevealSection key={i} delay={i * 150}>
                            <div className="bg-white rounded-[2rem] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full border border-gray-100 hover:border-[#EC008C]/20 hover:-translate-y-2 group cursor-default">
                                <div>
                                    <div className="mb-8"><Quote className="text-[#3B82F6]/50 group-hover:text-[#EC008C] transition-colors duration-500" size={48} /></div>
                                    <p className="text-[#0A0F1D] text-lg font-['Inter'] font-medium leading-relaxed italic mb-10">“{item.quote}”</p>
                                </div>
                                <div className="flex items-center gap-5 mt-auto pt-8 border-t border-gray-100">
                                    <div className="w-16 h-16 bg-center bg-no-repeat bg-cover rounded-full ring-4 ring-gray-50 group-hover:ring-[#EC008C]/10 transition-all shrink-0" style={{ backgroundImage: `url("${item.img}")` }}></div>
                                    <div><p className="text-[#0A0F1D] text-lg font-['Outfit'] font-bold leading-tight">{item.name}</p><p className="text-[#EC008C] text-xs font-['Inter'] font-bold uppercase tracking-wider mt-1">{item.role}</p></div>
                                </div>
                            </div>
                        </RevealSection>
                    ))}
                </div>
            </div>
        </section>
    );
};
