import React, { useRef, useState, ReactNode } from 'react';

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const SpotlightCard = ({ children, className = "", onClick }: SpotlightCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onClick={onClick}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0 bg-transparent"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(236,0,140,0.15), transparent 40%)`
                }}
            />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
