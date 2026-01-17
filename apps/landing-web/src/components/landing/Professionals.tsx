import { ArrowRight, BookOpen, MonitorPlay, GraduationCap, Sparkles, Video, Settings, PlayCircle } from 'lucide-react';
import { NeonIcon } from '../ui/NeonIcon';
import bookCover from '../../assets/images/book_real.jpg';
import academyInterface from '../../assets/images/academy_campus_interface.png';
import crmDesktop from '../../assets/images/hero-desktop.jpg';
import crmTablet from '../../assets/images/hero-tablet.jpg';
import crmMobile from '../../assets/images/hero-mobile.jpg';
import { RevealSection } from '../ui/RevealSection';

interface ProfessionalsProps {
    onOpenModal?: (modal: string) => void;
}

export const Professionals = ({ onOpenModal }: ProfessionalsProps) => {
    return (
        <section className="relative bg-white overflow-hidden">

            {/* Ambient Background - Shared (Subtle Light) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-[#EC008C]/5 rounded-full blur-[150px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[5%] w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
            </div>

            {/* SECTION HEADER */}
            <div className="relative z-10 pt-32 pb-16 text-center max-w-4xl mx-auto px-6">
                <h2 className="text-sm font-['Outfit'] font-bold text-[#EC008C] tracking-[0.2em] uppercase mb-4">
                    Ecosistema Profesional
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-['Outfit'] font-bold text-slate-900 mb-6 leading-tight">
                    Herramientas para la <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">Excelencia Clínica</span>
                </h3>
                <p className="text-lg text-slate-600 font-['Inter'] font-light leading-relaxed">
                    Unificamos formación, gestión clínica y divulgación científica en una plataforma integral para musicoterapeutas y profesionales de la salud.
                </p>
            </div>

            {/* 1. EL LIBRO (MÉTODO ACTIVA) */}
            <div className="relative py-24 border-t border-gray-100" id="libro">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Visual: Levitating Book */}
                    <div className="relative flex justify-center perspective-1000 order-2 lg:order-1">
                        <div className="relative w-[300px] md:w-[400px] aspect-[3/4] animate-float">
                            {/* Mystical Glow (Reduced opacity for white bg) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#EC008C] rounded-full blur-[80px] opacity-10"></div>

                            {/* Real Book Cover with 3D Effect */}
                            <div className="relative transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 preserve-3d">
                                <img
                                    src={bookCover}
                                    alt="Portada del libro Método Activa: Activa tu cuerpo, mente y corazón con arte"
                                    className="w-full h-full object-cover rounded-md shadow-2xl shadow-slate-300 border-l border-white/50"
                                />
                                {/* Book Spine Illusion (CSS) */}
                                <div className="absolute top-0 left-0 w-[4px] h-full bg-black/5 blur-[1px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#EC008C]/10 border border-[#EC008C]/20 text-[#EC008C]">
                            <BookOpen size={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">BEST SELLER</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-['Outfit'] font-bold text-slate-900 leading-tight">
                            Método Activa: <br />
                            <span className="text-[#EC008C]">El Manual Clínico</span>
                        </h2>

                        <div className="space-y-6 text-slate-600 font-['Inter'] text-lg leading-relaxed">
                            <p>
                                <strong>"Activa tu cuerpo, mente y corazón con arte".</strong> Una invitación a reactivar la conexión neurológica y emocional cuando las palabras ya no llegaban.
                            </p>
                            <p className="font-light">
                                Presenta <strong>21 sesiones clínicas paso a paso</strong> que convierten la música, la luz y la belleza en herramientas terapéuticas tangibles. Diseñado para bajar el ruido mental, recuperar energía vital y restablecer el vínculo afectivo en pacientes con deterioro cognitivo.
                            </p>
                        </div>

                        <a
                            href="https://metodoactiva.es"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A0F1D] text-white rounded-full font-['Outfit'] font-bold tracking-widest hover:bg-[#EC008C] hover:text-white hover:shadow-lg transition-all duration-300 group"
                        >
                            ADQUIRIR LIBRO
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                </div>
            </div>

            {/* 2. SOFTWARE ACTIVA (CRM) */}
            <div className="relative py-32 border-t border-gray-100 bg-slate-50" id="software">
                <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-600">
                            <MonitorPlay size={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">CRM CLÍNICO V2.3</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-['Outfit'] font-bold text-slate-900 leading-tight">
                            Gestión Integral de <br />
                            <span className="text-cyan-600">Musicoterapia Clínica</span>
                        </h2>

                        <p className="text-slate-600 font-['Inter'] text-lg leading-relaxed max-w-xl">
                            El primer software especializado en la gestión de pacientes musicoterapéuticos. Digitaliza tu práctica clínica con herramientas diseñadas específicamente para el seguimiento neurológico y emocional.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Historia Clínica Digital Especializada",
                                "Seguimiento de Objetivos Terapéuticos",
                                "Facturación Automatizada y Gestión de Citas",
                                "Acceso Seguro desde Cualquier Dispositivo"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-sm"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => onOpenModal?.('software')} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold tracking-wide hover:shadow-lg transition-all">
                                PRUEBA GRATUITA 14 DÍAS
                            </button>
                            <button onClick={() => onOpenModal?.('demo')} className="px-8 py-4 border border-slate-300 text-slate-700 rounded-full font-bold tracking-wide hover:bg-white hover:border-slate-400 transition-all flex items-center gap-2">
                                <PlayCircle size={20} /> VER DEMO
                            </button>
                        </div>
                    </div>

                    {/* Visual: Device Composition (Clean Outline) */}
                    <div className="relative z-10 w-full lg:h-[800px] flex items-center justify-center perspective-container py-20 lg:py-0">

                        {/* DESKTOP (Back Center) */}
                        <div className="relative w-[90%] lg:w-[800px] aspect-[16/10] bg-white rounded-xl shadow-2xl shadow-slate-200 border-[6px] border-slate-800 ring-1 ring-gray-200 z-10 transition-transform duration-700 hover:scale-[1.01] overflow-hidden group/desktop">
                            {/* Screen */}
                            <div className="w-full h-full bg-slate-100 overflow-hidden relative">
                                <img src={crmDesktop} alt="Panel de Control Clínico CRM Método Activa en Escritorio" className="w-full h-full object-contain bg-white" loading="lazy" />
                            </div>
                            {/* Stand */}
                            <div className="absolute left-1/2 -bottom-6 w-1/3 h-4 bg-gradient-to-b from-slate-700 to-slate-900 -translate-x-1/2 rounded-b-xl"></div>
                        </div>

                        {/* TABLET (Bottom Right Overlap) */}
                        <div className="absolute -bottom-10 right-0 lg:-right-12 lg:bottom-20 w-[60%] lg:w-[450px] aspect-[4/3] bg-white rounded-[1.5rem] shadow-xl border-[8px] border-slate-800 ring-1 ring-gray-200 z-20 animate-float" style={{ animationDelay: '1s' }}>
                            <div className="w-full h-full bg-slate-100 rounded-2xl overflow-hidden relative group/tablet">
                                <img src={crmTablet} alt="Gestión de Pacientes en Tablet para Terapeutas" className="w-full h-full object-contain bg-white" loading="lazy" />
                            </div>
                            {/* Camera Dot */}
                            <div className="absolute top-1/2 -right-1.5 w-1 h-8 bg-gray-400 rounded-l-md -translate-y-1/2"></div>
                        </div>

                        {/* MOBILE (Bottom Left Overlap) */}
                        <div className="absolute -bottom-20 left-4 lg:left-0 lg:bottom-40 w-[35%] lg:w-[240px] aspect-[9/19.5] bg-black rounded-[2.5rem] shadow-xl border-[8px] border-black ring-1 ring-gray-800 z-30 animate-float" style={{ animationDelay: '0s' }}>
                            <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative group/mobile">
                                <img src={crmMobile} alt="App Móvil PWA Método Activa para Pacientes" className="w-full h-full object-contain bg-white" loading="lazy" />
                                {/* Dynamic Notch/Bar */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-xl z-40"></div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute right-10 top-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-blue-100 animate-bounce delay-1000 hidden lg:block z-40 border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2.5 rounded-full text-blue-500"><Sparkles size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Actualización</p>
                                    <p className="text-sm font-bold text-slate-900 font-['Outfit']">CRM v2.3 Disponible</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. ACADEMIA (CAMPUS VIRTUAL) */}
            <div className="relative py-32 border-t border-gray-100" id="academia">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Visual: Futuristic Interface */}
                    <div className="relative perspective-1000 order-2">
                        <div className="relative w-full aspect-square md:aspect-[4/3] transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700">
                            <div className="absolute inset-0 bg-purple-600 rounded-full blur-[150px] opacity-10"></div>
                            <img
                                src={academyInterface}
                                alt="Interfaz del Campus Virtual Academia Activa"
                                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                            />
                            {/* Floating Elements (CSS Only) */}
                            <div className="absolute top-10 -right-10 p-4 bg-white/90 backdrop-blur-xl border border-purple-100 rounded-xl shadow-xl animate-bounce delay-700 z-20">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-purple-500 w-5 h-5" />
                                    <div>
                                        <p className="text-xs text-purple-500 font-bold uppercase">Progreso</p>
                                        <p className="text-slate-900 font-bold">Módulo 3 Completado</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600">
                            <GraduationCap size={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">ACADEMIA ACTIVA</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-['Outfit'] font-bold text-slate-900 leading-tight">
                            Campus Virtual de <br />
                            <span className="text-purple-600">Alta Especialización</span>
                        </h2>

                        <div className="space-y-6 text-slate-600 font-['Inter'] text-lg leading-relaxed">
                            <p>
                                Formamos a la próxima generación de musicoterapeutas y cuidadores profesionales. Nuestro campus virtual integra evidencia clínica y práctica real.
                            </p>
                            <p>
                                No solo aprendes el <strong>Método Activa</strong>, aprendes a implementarlo tecnológicamente. El curso incluye entrenamiento práctico en nuestro CRM, enseñándote a digitalizar evaluaciones, registrar sesiones y medir el progreso del paciente con datos objetivos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-colors">
                                <h4 className="text-slate-900 font-bold mb-1">Certificación Oficial</h4>
                                <p className="text-sm text-slate-500">Avalada por instituciones internacionales.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-colors">
                                <h4 className="text-slate-900 font-bold mb-1">Prácticas con CRM</h4>
                                <p className="text-sm text-slate-500">Licencia educativa de Software Activa incluida.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpenModal?.('course')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-600 rounded-full font-['Outfit'] font-bold tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-300 group"
                        >
                            VER PROGRAMA ACADÉMICO
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>

        </section>
    );
};
