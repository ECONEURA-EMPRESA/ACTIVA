import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 z-[100] flex items-center justify-center gap-2 animate-in slide-in-from-bottom-full text-xs font-medium safe-pb">
            <WifiOff size={14} className="text-red-400" />
            <span>Sin conexión a Internet. Trabajando en modo local.</span>
        </div>
    );
};
