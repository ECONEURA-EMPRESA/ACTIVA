import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const ReloadPrompt = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
            // TITANIUM UPDATE: Check for updates every 15s to force detection on mobile
            if (r) {
                setInterval(() => {
                    r.update().catch(() => { });
                }, 15 * 1000);
            }
        },
        onRegisterError(error) {
            console.error('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 left-6 md:left-auto md:w-96 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-[#0A0F1D]/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10 flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-white font-bold text-sm mb-0.5">
                        {offlineReady ? 'Listo para usar Offline' : 'Nueva Versión Disponible'}
                    </h3>
                    <p className="text-slate-400 text-xs">
                        {offlineReady
                            ? 'La app funcionará sin internet.'
                            : 'Actualiza para ver las mejoras.'}
                    </p>
                </div>

                {needRefresh && (
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="bg-[#EC008C] hover:bg-[#D90082] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-pink-900/20"
                    >
                        <RefreshCw size={14} className="animate-spin-slow" />
                        ACTUALIZAR
                    </button>
                )}

                <button
                    onClick={close}
                    className="text-slate-500 hover:text-white transition-colors p-2"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
