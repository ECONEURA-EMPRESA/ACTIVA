import { ReactNode } from 'react';


interface RevealSectionProps {
    children: ReactNode;
    delay?: number;
}

export const RevealSection = ({ children }: RevealSectionProps) => {
    return (
        <div className="transform-none opacity-100">
            {children}
        </div>
    );
};
