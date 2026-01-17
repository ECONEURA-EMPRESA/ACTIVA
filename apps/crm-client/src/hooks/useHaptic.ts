import { useCallback } from 'react';

type InteractionType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

export const useHaptic = () => {
    const trigger = useCallback((type: InteractionType = 'light') => {
        if (!navigator.vibrate) return;

        switch (type) {
            case 'light':
                navigator.vibrate(5);
                break;
            case 'medium': // Good for standard clicks
                navigator.vibrate(10);
                break;
            case 'heavy': // Good for important actions (Save/Delete)
                navigator.vibrate(15);
                break;
            case 'selection': // Fast scrolling ticks
                navigator.vibrate(2);
                break;
            case 'success': // Double tap pattern
                navigator.vibrate([10, 30, 10]);
                break;
            case 'warning':
                navigator.vibrate([30, 50, 10]);
                break;
            case 'error': // Long vibration
                navigator.vibrate([50, 50, 50, 50, 50]);
                break;
            default:
                navigator.vibrate(5);
        }
    }, []);

    return { trigger };
};
