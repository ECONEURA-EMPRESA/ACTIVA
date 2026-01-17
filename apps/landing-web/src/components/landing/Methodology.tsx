import { Activity, BookOpen, MonitorPlay, ArrowRight } from 'lucide-react';
import { NeonIcon } from '../ui/NeonIcon';

const Methodology = ({ onOpenModal }: { onOpenModal: (type: string) => void }) => {
    const pillars = [
        {
            icon: Activity,
            title: "Clínica Activa",
            description: "Intervenciones musicoterapéuticas basadas en evidencia para el tratamiento de trastornos neurológicos y del desarrollo.",
            color: "text-[#EC008C]",
            glowHex: "#EC008C",
            glow: "group-hover:shadow-[0_0_40px_-5px_rgba(236,0,140,0.5)]",
            border: "group-hover:border-[#EC008C]/50",
            bg: "group-hover:bg-[#EC008C]/5",
            action: 'clinica'
        },
        {
            icon: BookOpen,
            title: "Academia",
            description: "Formación de alto nivel para profesionales de la salud. Masters, cursos y certificaciones internacionales.",
            color: "text-cyan-400",
            glowHex: "#22d3ee",
            glow: "group-hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.5)]",
            border: "group-hover:border-cyan-400/50",
            bg: "group-hover:bg-cyan-400/5",
            action: 'academia'
        },
        {
            icon: MonitorPlay,
            title: "Software Activa",
            description: "La primera plataforma CRM especializada en musicoterapia. Gestión clínica, facturación y seguimiento de pacientes.",
            color: "text-purple-400",
            glowHex: "#c084fc",
            glow: "group-hover:shadow-[0_0_40px_-5px_rgba(192,132,252,0.5)]",
            border: "group-hover:border-purple-400/50",
            bg: "group-hover:bg-purple-400/5",
            action: 'software'
        }
    ];

    return (
        <section className="relative py-24 bg-[#020617] overflow-hidden">

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[#EC008C]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-sm font-['Outfit'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC008C] to-cyan-400 tracking-[0.2em] uppercase mb-4">
                        Nuestra Metodología
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-['Outfit'] font-bold text-white mb-6 leading-tight">
                        Tres Pilares para una <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Salud Integral</span>
                    </h3>
                    <p className="text-lg text-slate-400 font-['Inter'] font-light leading-relaxed">
                        Unificamos la práctica clínica, la investigación académica y la tecnología en un ecosistema diseñado para potenciar el bienestar humano a través de la música y la neurociencia.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pillars.map((pillar, index) => (
                        <div
                            key={index}
                            onClick={() => onOpenModal(pillar.action)}
                            className={`group relative p-8 rounded-3xl bg-[#0A0F1E]/60 backdrop-blur-xl border border-white/5 ${pillar.border} transition-all duration-500 hover:-translate-y-2 ${pillar.glow} overflow-hidden cursor-pointer`}
                        >
                            {/* Inner Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 ${pillar.bg} transition-opacity duration-500`}></div>

                            {/* Icon Container */}
                            <div className="relative mb-8">
                                <NeonIcon
                                    icon={pillar.icon}
                                    color={pillar.color}
                                    glowColor={pillar.glowHex}
                                    size="md"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative">
                                <h4 className="text-2xl font-['Outfit'] font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                                    {pillar.title}
                                </h4>
                                <p className="text-slate-400 font-['Inter'] leading-relaxed mb-8 group-hover:text-slate-300 transition-colors duration-300">
                                    {pillar.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-['Outfit'] font-bold text-white/50 group-hover:text-white transition-colors duration-300">
                                    EXPLORAR
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Methodology;
