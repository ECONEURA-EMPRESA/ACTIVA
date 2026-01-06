import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in fill-mode-both duration-500">
            <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-transparent dark:from-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {Icon ? (
                    <Icon size={48} className="text-slate-300 dark:text-slate-600 group-hover:text-pink-400 group-hover:scale-110 transition-all duration-300" />
                ) : (
                    <svg
                        className="w-16 h-16 text-slate-200 dark:text-slate-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                )}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};
