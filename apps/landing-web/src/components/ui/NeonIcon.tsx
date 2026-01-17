import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NeonIconProps {
    icon: LucideIcon;
    color?: string; // Tailwind text color class, e.g., 'text-[#EC008C]'
    glowColor?: string; // Hex color for shadow, e.g., '#EC008C'
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const NeonIcon: React.FC<NeonIconProps> = ({
    icon: Icon,
    color = 'text-cyan-400',
    glowColor = '#22d3ee',
    size = 'md',
    className = ''
}) => {

    // Size Mappings
    const containerSizes = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-10 h-10'
    };

    return (
        <div className={`relative group ${containerSizes[size]} ${className}`}>

            {/* 1. Outer Glow (Pulse) */}
            <div
                className="absolute inset-0 rounded-full blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                style={{ backgroundColor: glowColor }}
            ></div>

            {/* 2. Metallic/Glass Base Container */}
            <div className={`relative w-full h-full rounded-full bg-[#0A0F1E] border border-white/10 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(0,0,0,0.5)] group-hover:border-white/30 transition-all duration-500 overflow-hidden`}>

                {/* Internal Shine/Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* 3. The Neon Icon */}
                <Icon
                    className={`${iconSizes[size]} ${color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500`}
                    style={{ filter: `drop-shadow(0 0 5px ${glowColor})` }}
                />
            </div>

            {/* 4. Orbiting Ring (Optional decoration) */}
            <div className="absolute -inset-[1px] rounded-full border border-white/5 opacity-50 pointer-events-none"></div>
        </div>
    );
};
