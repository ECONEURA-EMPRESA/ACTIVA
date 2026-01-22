import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const ReloadPrompt = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            // TITANIUM UPDATE: Check for updates every 15s to force detection on mobile
            if (r) {
                // TITANIUM NUCLEAR UPDATE: Force update immediately to clear old logo cache
                r.update().then(() => {
                    console.log('Titanium Update Checked');
                });
                setInterval(() => {
                    r.update().catch(() => { });
                }, 5 * 1000); // Keep checking
            }
        },
        onRegisterError(_error) {
            // Sentry capture could go here
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
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-black transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-900/20 animate-pulse"
                    >
                        <RefreshCw size={18} className="animate-spin" />
                        ACTUALIZAR AHORA (VERSIÓN 5.1.1)
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
