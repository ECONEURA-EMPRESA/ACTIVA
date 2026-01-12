import { useState, useEffect } from 'react';

export function useScrollDirection(elementId: string = 'main-content') {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        const element = document.getElementById(elementId);
        if (!element) return;

        let lastScrollY = element.scrollTop;

        const updateScrollDirection = () => {
            const scrollY = element.scrollTop;
            const direction = scrollY > lastScrollY ? 'down' : 'up';
            if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };

        element.addEventListener('scroll', updateScrollDirection);
        return () => element.removeEventListener('scroll', updateScrollDirection);
    }, [scrollDirection, elementId]);

    return scrollDirection;
}
