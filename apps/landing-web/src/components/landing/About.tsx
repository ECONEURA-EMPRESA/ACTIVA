import { Quote } from 'lucide-react';
import { RevealSection } from '../ui/RevealSection';
import auroraImg from '../../assets/images/aurora-profile.jpg';

export const About = () => {
    return (
        <section id="nosotros" className="py-32 px-6 lg:px-12 bg-white border-t border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#FDF2F8] rounded-full blur-[200px] opacity-40 pointer-events-none"></div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative order-2 lg:order-1 flex justify-center lg:justify-end pr-0 lg:pr-12">
                        {/* Constrained Image Container */}
                        <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto lg:mx-0">
                            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-[#0A0F1D]/15 group tilt-card ring-8 ring-white">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${auroraImg})` }} role="img" aria-label="Aurora Del Río, Fundadora y Directora Clínica de Activa Musicoterapia"></div>
                                {/* Subtle gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/40 to-transparent"></div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#3B82F6] rounded-full blur-[60px] opacity-20 -z-10"></div>
                            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#EC008C] rounded-full blur-[60px] opacity-20 -z-10"></div>

                            {/* Floater: Quote (Moved outside to be a card) */}
                            <div className="absolute -bottom-10 -left-6 md:-left-12 bg-white/80 backdrop-blur-md border border-white/60 p-5 rounded-2xl shadow-xl max-w-[220px] animate-float" style={{ animationDelay: '1s' }}>
                                <Quote className="text-[#EC008C] mb-2" size={20} />
                                <p className="text-[#0A0F1D]/80 text-xs italic font-['Inter'] font-medium">"La arquitectura invisible que reconstruye el cerebro."</p>
                            </div>

                            {/* Floater: Experience */}
                            <div className="absolute -top-6 -right-6 md:-right-12 bg-white p-4 rounded-2xl shadow-xl shadow-[#3B82F6]/10 animate-float border border-gray-100 z-20">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider">Trayectoria</span>
                                </div>
                                <p className="text-[#0A0F1D] font-['Outfit'] font-bold text-3xl">20+</p>
                                <p className="text-[#64748B] text-[10px] font-['Inter'] font-medium">Años de experiencia</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <RevealSection>
                            <span className="text-[#EC008C] text-xs font-['Outfit'] font-bold tracking-[0.2em] uppercase mb-6 block bg-[#FDF2F8] w-fit px-5 py-2 rounded-full border border-[#EC008C]/10">Quiénes Somos</span>
                            <h2 className="text-[#0A0F1D] text-5xl md:text-6xl font-['Outfit'] font-black leading-[1.05] tracking-tighter mb-8">
                                Humanizando la ciencia <br /> detrás de cada nota.
                            </h2>
                            <div className="space-y-6">
                                <p className="text-[#64748B] text-xl font-['Inter'] leading-relaxed font-light">
                                    <strong className="text-[#0A0F1D] font-semibold">Activa Musicoterapia</strong> es un servicio de salud y bienestar alternativo diseñado para la recuperación integral de pacientes. A través de nuestra visión, misión y valores, nuestro objetivo principal es conectar de manera significativa con pacientes y cuidadores.
                                </p>
                                <p className="text-[#64748B] text-xl font-['Inter'] leading-relaxed font-light">
                                    Aurora Del Río cuenta con más de 20 años de dedicación a la música y un Máster Europeo de Musicoterapia con calificación de sobresaliente. Junto a su equipo, aplica este conocimiento científico para transformar la salud a través del Método Activa.
                                </p>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </div>
        </section>
    );
};
