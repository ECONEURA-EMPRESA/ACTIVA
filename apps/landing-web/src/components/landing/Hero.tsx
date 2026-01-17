import { ArrowRight, HeartPulse, Stethoscope, Play } from 'lucide-react';
import { RevealSection } from '../ui/RevealSection';
import heroBg from '../../assets/images/hero-bg.png';

interface HeroProps {
    onOpenModal: (type: 'clinic' | 'course') => void;
}

export const Hero = ({ onOpenModal }: HeroProps) => {
    return (
        <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#020617]" itemScope itemType="https://schema.org/MedicalClinic">

            {/* SYMPHONY OF LIGHT: Living Image Engine */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">

                {/* LAYER 1: The Image (Motion) */}
                <div className="absolute inset-0">
                    <img
                        src={heroBg}
                        alt="Background Neurociencia y Arte"
                        // AGGRESSIVE SCALE & SHIFT to kill the white strip definitively
                        // -mt-4 pulls it UP under the navbar
                        // scale-125 ensures it covers everything horizontally
                        className="w-full h-full object-cover object-center opacity-70 animate-ken-burns transform-gpu will-change-transform scale-125 -mt-4 origin-center"
                    />
                </div>

                {/* LAYER 2: The ''Breathing'' Atmosphere - DARK BASE */}
                <div className="absolute inset-0 bg-[#020617] mix-blend-color opacity-20"></div>

                {/* LAYER 3: Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/40 mix-blend-multiply animate-pulse-slow"></div>

                {/* LAYER 4: Volumetric Light Beams */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/10 to-transparent skew-x-12 translate-x-[-50%] animate-shift-light mix-blend-overlay"></div>

                {/* LAYER 5: Vignette & Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]"></div>
            </div>

            <div className="relative z-20 max-w-[1600px] mx-auto px-6 flex flex-col items-center text-center">
                <RevealSection>

                    {/* SUPER-BADGE: MUSICOTERAPIA */}
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-900/20 border border-blue-500/30 backdrop-blur-md mb-8 group hover:bg-blue-900/30 transition-all duration-500 cursor-default shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
                        </span>
                        <span className="text-cyan-100 text-sm font-['Outfit'] font-bold tracking-[0.2em] uppercase">MUSICOTERAPIA</span>
                    </div>

                    {/* MASSIVE HEADLINE (UPDATED SLOGAN) */}
                    <h1 className="text-7xl sm:text-8xl lg:text-[10rem] font-['Outfit'] font-black tracking-tighter text-white leading-[0.85] mb-8 drop-shadow-2xl">
                        EL ARTE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500 animate-pulse-slow">ES SALUD.</span>
                    </h1>

                    <p className="text-xl sm:text-2xl lg:text-3xl text-slate-300 font-['Inter'] font-light max-w-4xl mx-auto mb-12 leading-relaxed text-balance drop-shadow-md">
                        Activa Musicoterapia aplica un método probado que utiliza el arte como herramienta de rehabilitación, conectando a las personas consigo mismas y con sus pacientes.
                    </p>

                    {/* MAGNETIC ACTION BUTTONS - Updated Palette */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
                        <button
                            onClick={() => onOpenModal('clinic')}
                            className="group relative h-16 sm:h-20 px-12 rounded-full bg-gradient-to-r from-[#EC008C] to-purple-600 text-white text-xl font-['Outfit'] font-bold tracking-wide shadow-[0_0_50px_-10px_rgba(236,0,140,0.5)] hover:shadow-[0_0_80px_-5px_rgba(236,0,140,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden border border-white/10"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                            <span className="relative z-10">Soy Paciente</span>
                            <HeartPulse className="w-6 h-6 relative z-10 group-hover:animate-pulse" />
                        </button>

                        <button
                            onClick={() => onOpenModal('course')}
                            className="group relative h-16 sm:h-20 px-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-xl font-['Outfit'] font-bold tracking-wide shadow-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-4"
                        >
                            <span>Soy Profesional</span>
                            <Stethoscope className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>

                </RevealSection>
            </div>
        </div>
    );
};
