import { ReactNode } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';

interface RevealSectionProps {
    children: ReactNode;
    delay?: number;
}

export const RevealSection = ({ children, delay = 0 }: RevealSectionProps) => {
    const [ref, visible] = useOnScreen({ threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1) transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};
