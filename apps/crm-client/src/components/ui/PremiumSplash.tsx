import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import logoCircular from '../../assets/logo-alpha.png';

export const PremiumSplash = () => {
    const [progress, setProgress] = useState(0);
    const [showTagline, setShowTagline] = useState(false);

    useEffect(() => {
        // Simulate loading progress for effect
        const timer = setInterval(() => {
            setProgress((old) => {
                if (old === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(old + diff, 100);
            });
        }, 150);

        setTimeout(() => setShowTagline(true), 800);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-slate-50">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-200"></div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col items-center">

                {/* LOGO CONTAINER with Glow Effect */}
                <div className="relative mb-8 group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-2xl ring-1 ring-slate-100 animate-in zoom-in-50 duration-1000 ease-out">
                        <img
                            src={logoCircular}
                            alt="Activa Logo"
                            className="w-full h-full object-cover rounded-full animate-heartbeat"
                        />
                    </div>

                    {/* Orbiting Particle */}
                    <div className="absolute top-0 left-0 w-full h-full animate-[spin_3s_linear_infinite]">
                        <div className="w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899] absolute -top-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                </div>

                {/* TYPOGRAPHY */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-300">
                        ACTIVA
                        <span className="text-pink-600">.</span>
                    </h1>

                    <div className={`flex items-center gap-3 justify-center transition-all duration-1000 ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="h-px w-8 bg-slate-300"></div>
                        <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-slate-500 uppercase">
                            Clinical SaaS Architecture
                        </p>
                        <div className="h-px w-8 bg-slate-300"></div>
                    </div>
                </div>

                {/* LOADING BAR */}
                <div className="mt-12 w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shimmer Effect on Bar */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full -translate-x-full animate-[shimmer_1s_infinite]"></div>
                    </div>
                </div>

                <p className="mt-3 text-[10px] font-medium text-slate-400 animate-pulse">
                    {progress < 100 ? 'Inicializando Sistema...' : 'Bienvenido'}
                </p>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 text-slate-300 text-[10px] font-mono flex items-center gap-1 opacity-60">
                <Activity size={10} />
                POWERED BY TITANIUM ENGINE
            </div>
        </div>
    );
};
