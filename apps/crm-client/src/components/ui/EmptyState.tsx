import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    className?: string; // Allow custom margins/padding
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div className={`col-span-full flex flex-col items-center justify-center text-center py-20 px-4 animate-in fade-in zoom-in-95 duration-500 ${className}`}>
            <div className="relative mb-6 group cursor-default">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-slate-100/50 rounded-full blur-2xl transform scale-150 group-hover:scale-175 transition-transform duration-700"></div>
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner ring-1 ring-slate-100 relative z-10">
                    <Icon size={32} className="text-slate-300 group-hover:text-pink-400 transition-colors duration-500" strokeWidth={1.5} />
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 max-w-sm">
                {title}
            </h3>

            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
                {description}
            </p>

            {action && (
                <Button onClick={action.onClick} icon={action.icon} variant="primary">
                    {action.label}
                </Button>
            )}
        </div>
    );
};
