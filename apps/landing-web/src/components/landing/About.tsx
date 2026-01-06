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
                        {/* Constrained Image Container */}
                        <div className="relative w-80 h-96 md:w-[400px] md:h-[500px] mx-auto lg:mx-0">
                            {/* Main Frame */}
                            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-[#EC008C]/10 border border-gray-100 bg-white ring-1 ring-black/5 z-20">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: `url(${auroraImg})` }} role="img" aria-label="Aurora Del Río, Fundadora y Directora Clínica de Activa Musicoterapia"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/80 via-transparent to-transparent"></div>

                                {/* Static Premium Label */}
                                <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                                    <p className="font-['Outfit'] font-bold text-2xl tracking-tight">Aurora Del Río</p>
                                    <p className="font-['Inter'] text-sm text-white/80 font-medium tracking-wide border-l-2 border-[#EC008C] pl-3 mt-2">Fundadora & Directora Clínica</p>
                                </div>
                            </div>

                            {/* Decorative Back Layers (Static) */}
                            <div className="absolute top-4 -right-4 w-full h-full rounded-[2rem] border-2 border-[#EC008C]/10 bg-transparent z-10"></div>
                            <div className="absolute -top-4 -left-4 w-full h-full rounded-[2rem] bg-gray-50 -z-10"></div>
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
