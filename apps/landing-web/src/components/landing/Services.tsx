import { ArrowRight, Video, Users, Heart, Baby, MonitorPlay, MapPin } from 'lucide-react';
import individualImage from '../../assets/images/individual-session-child.png';
import groupImage from '../../assets/images/group-session-aurora.jpg';
import { NeonIcon } from '../ui/NeonIcon';

const Services = ({ onOpenModal }: { onOpenModal: (type: string) => void }) => {
    return (
        <section className="relative py-32 bg-white overflow-hidden" id="clinic">

            {/* Background Nuance - Subtle Clinical Gradient */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 blur-[100px] transform -translate-y-1/2 pointer-events-none opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-20 max-w-4xl mx-auto">
                    <h2 className="text-sm font-['Outfit'] font-bold text-[#EC008C] tracking-[0.2em] uppercase mb-4">
                        Servicios Clínicos
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-['Outfit'] font-bold text-slate-900 mb-6 leading-tight">
                        Intervención <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">Personalizada y Grupal</span>
                    </h3>
                    <p className="text-lg text-slate-600 font-['Inter'] font-light leading-relaxed max-w-2xl mx-auto">
                        Diseñamos el encuadre terapéutico ideal según las necesidades neurológicas y emocionales de cada paciente.
                    </p>
                </div>

                <div className="space-y-32">

                    {/* OPTION 1: INDIVIDUAL (Left Image, Right Text) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center group">

                        {/* Image Container */}
                        <div className="relative order-2 lg:order-1">
                            {/* Subtle Shadow instead of glow */}
                            <div className="absolute inset-0 bg-gray-200 rounded-[2rem] blur-2xl opacity-40 transform translate-y-4"></div>

                            <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl">
                                <img
                                    src={individualImage}
                                    alt="Niño en sesión de musicoterapia individual"
                                    className="w-full h-[500px] object-cover transform transition-transform duration-1000 group-hover:scale-105"
                                />

                                {/* Floating Badge - Clinical White */}
                                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full shadow-lg">
                                    <Heart className="w-5 h-5 text-[#EC008C]" />
                                    <span className="text-sm font-['Outfit'] font-bold text-slate-900 tracking-wide">ATENCIÓN 1:1</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="order-1 lg:order-2 space-y-8">
                            <div>
                                <h4 className="text-3xl font-['Outfit'] font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    Sesiones <span className="text-[#EC008C]">Individuales</span>
                                </h4>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Un espacio exclusivo centrado en el paciente. Diseñamos un plan de tratamiento a medida para abordar objetivos específicos de rehabilitación, desarrollo o bienestar emocional.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Feature Cards - Light Mode */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-gray-100 hover:border-[#EC008C]/30 hover:bg-white hover:shadow-lg transition-all">
                                    <NeonIcon icon={MonitorPlay} color="text-[#EC008C]" glowColor="#EC008C" size="sm" />
                                    <div>
                                        <h5 className="text-slate-900 font-['Outfit'] font-bold mb-1">Modalidad Online</h5>
                                        <p className="text-sm text-slate-500">Terapia efectiva desde la comodidad del hogar, ideal para seguimiento continuo.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-gray-100 hover:border-[#EC008C]/30 hover:bg-white hover:shadow-lg transition-all">
                                    <NeonIcon icon={MapPin} color="text-[#EC008C]" glowColor="#EC008C" size="sm" />
                                    <div>
                                        <h5 className="text-slate-900 font-['Outfit'] font-bold mb-1">Modalidad Presencial</h5>
                                        <p className="text-sm text-slate-500">Interacción directa con instrumentación clínica completa en nuestros centros.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onOpenModal('individual')}
                                className="group flex items-center gap-3 px-8 py-4 bg-[#0A0F1D] text-white rounded-full font-['Outfit'] font-bold tracking-widest hover:bg-[#EC008C] hover:shadow-lg transition-all duration-300"
                            >
                                SOLICITAR EVALUACIÓN
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>


                    {/* OPTION 2: GROUP (Right Image, Left Text) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center group">

                        {/* Content */}
                        <div className="space-y-8 order-1">
                            <div>
                                <h4 className="text-3xl font-['Outfit'] font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    Sesiones <span className="text-cyan-600">Grupales</span>
                                </h4>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    El poder de la música como conector social. Grupos reducidos y homogéneos donde la interacción potencia los resultados terapéuticos.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 hover:border-cyan-400/50 hover:bg-white hover:shadow-lg transition-all group/card">
                                    <div className="mb-6 flex justify-center">
                                        <NeonIcon icon={Users} color="text-cyan-500" glowColor="#22d3ee" size="md" />
                                    </div>
                                    <h5 className="text-slate-900 font-['Outfit'] font-bold mb-2 text-center">Para Mayores</h5>
                                    <p className="text-sm text-slate-500 text-center">Estimulación cognitiva y mantenimiento de la memoria a través de la música.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 hover:border-cyan-400/50 hover:bg-white hover:shadow-lg transition-all group/card">
                                    <div className="mb-6 flex justify-center">
                                        <NeonIcon icon={Baby} color="text-cyan-500" glowColor="#22d3ee" size="md" />
                                    </div>
                                    <h5 className="text-slate-900 font-['Outfit'] font-bold mb-2 text-center">Para Niños</h5>
                                    <p className="text-sm text-slate-500 text-center">Desarrollo de habilidades sociales y mejora de la comunicación en un entorno lúdico.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => onOpenModal('grupal')}
                                className="group flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-slate-900 text-slate-900 rounded-full font-['Outfit'] font-bold tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300"
                            >
                                VER HORARIOS GRUPALES
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="relative order-2">
                            {/* Subtle Shadow instead of glow */}
                            <div className="absolute inset-0 bg-gray-200 rounded-[2rem] blur-2xl opacity-40 transform translate-y-4"></div>

                            <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl">
                                <img
                                    src={groupImage}
                                    alt="Aurora impartiendo sesión grupal"
                                    className="w-full h-[500px] object-cover transform transition-transform duration-1000 group-hover:scale-105"
                                />

                                {/* Floating Badge */}
                                <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full shadow-lg">
                                    <Users className="w-5 h-5 text-cyan-600" />
                                    <span className="text-sm font-['Outfit'] font-bold text-slate-900 tracking-wide">DINÁMICA SOCIAL</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default Services;
