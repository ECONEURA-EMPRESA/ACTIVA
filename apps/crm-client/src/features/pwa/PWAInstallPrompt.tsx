import React, { useState, useEffect } from 'react';
import { X, Download, Share, PlusSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    // Lazy initialization to avoid setting state in effect
    const [isIOS] = useState(() => {
        if (typeof window === 'undefined') return false;
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    });

    const [isStandalone] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(display-mode: standalone)').matches ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window.navigator as any).standalone === true;
    });

    useEffect(() => {
        if (isStandalone) return;

        // Handle Android/Desktop "Add to Home Screen" event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault(); // Prevent Chrome 67 and earlier from automatically showing the prompt
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Delay showing the prompt to not be intrusive immediately
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        // Show iOS prompt after a delay if not standalone
        if (isIOS && !isStandalone) {
            // Check if we've already shown it recently to avoid annoyance (Optional: use localStorage)
            const hasSeenPrompt = localStorage.getItem('pwa_prompt_seen');
            if (!hasSeenPrompt) {
                setTimeout(() => {
                    setShowPrompt(true);
                }, 5000);
            }
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [isIOS, isStandalone]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Remember dismissal for a while?
        localStorage.setItem('pwa_prompt_seen', 'true');
    };

    if (!showPrompt || isStandalone) return null;

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
                >
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-4 text-white ring-1 ring-white/10">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3">
                                <div className="bg-indigo-600/20 p-2 rounded-lg">
                                    <Download className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Instalar App</h3>
                                    <p className="text-sm text-slate-300">
                                        {isIOS
                                            ? "Instala la app para una mejor experiencia."
                                            : "Añade la app a tu inicio para acceso rápido."}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isIOS ? (
                            <div className="space-y-3 bg-slate-800/50 rounded-lg p-3 text-sm border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <Share className="w-5 h-5 text-blue-400" />
                                    <span className="text-slate-300">1. Toca el botón <strong>Compartir</strong></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <PlusSquare className="w-5 h-5 text-slate-300" />
                                    <span className="text-slate-300">2. Selecciona <strong>"Añadir a inicio"</strong></span>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleInstallClick}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                            >
                                <Download className="w-4 h-4" />
                                Instalar Aplicación
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
