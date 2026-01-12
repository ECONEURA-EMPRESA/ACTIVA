import React from 'react';
import { Activity, Users, Calendar, Menu, PlusCircle } from 'lucide-react';

interface MobileBottomNavProps {
    currentView: string;
    onNavigate: (view: string) => void;
    onOpenMenu: () => void;
    onNewAction: () => void; // Central "FAB" action
    isMenuOpen: boolean;
}

import { useScrollDirection } from '../hooks/useScrollDirection';

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    currentView,
    onNavigate,
    onOpenMenu,
    onNewAction,
    isMenuOpen
}) => {
    const scrollDirection = useScrollDirection('main-content');
    const isHidden = scrollDirection === 'down' || isMenuOpen;

    const navItems = [
        { id: 'dashboard', icon: Activity, label: 'Inicio' },
        { id: 'patients', icon: Users, label: 'Pacientes' },
        { id: 'fab', icon: PlusCircle, label: '' }, // Placeholder for center button
        { id: 'calendar', icon: Calendar, label: 'Agenda' },
        { id: 'menu', icon: Menu, label: 'Menú' },
    ];

    return (
        <div className={`md:hidden fixed bottom-6 left-2 right-2 z-50 transition-transform duration-300 pointer-events-none ${isHidden ? 'translate-y-[200%]' : 'translate-y-0'}`}>
            {/* Pointer events auto so we can click buttons but touch through the gaps if needed */}
            <nav className="pointer-events-auto bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between px-4 h-[85px] safe-bottom relative ring-1 ring-white/30">
                {/* Glossy Overlay */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {navItems.map((item) => {
                    if (item.id === 'fab') {
                        return (
                            <div key={item.id} className="relative -top-10 group">
                                <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full" />
                                <button
                                    onClick={onNewAction}
                                    className="relative bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-600 text-white rounded-full p-5 shadow-2xl shadow-pink-900/50 border-[6px] border-slate-100/10 ring-2 ring-pink-400/50 active:scale-95 active:rotate-90 transition-all duration-300"
                                >
                                    <PlusCircle size={36} strokeWidth={2} className="drop-shadow-lg" />
                                </button>
                            </div>
                        );
                    }

                    if (item.id === 'menu') {
                        return (
                            <button
                                key={item.id}
                                onClick={onOpenMenu}
                                className="flex flex-col items-center justify-center w-16 h-full gap-2 text-slate-400 active:text-white transition-colors relative group"
                            >
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 rounded-2xl transition-opacity scale-75" />
                                <Menu size={28} strokeWidth={2} />
                                <span className="text-[11px] font-bold tracking-wide opacity-80">{item.label}</span>
                            </button>
                        );
                    }

                    const isActive = currentView === item.id || (item.id === 'patients' && currentView.startsWith('patients'));

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex flex-col items-center justify-center w-16 h-full gap-2 transition-all relative ${isActive ? 'text-white' : 'text-slate-400 active:text-white'
                                }`}
                        >
                            {/* Active Glow Indicator */}
                            {isActive && (
                                <div className="absolute -top-1 w-10 h-1.5 bg-pink-500 rounded-b-full shadow-[0_0_15px_rgba(236,72,153,1)] animate-in fade-in duration-300" />
                            )}

                            {/* Icon Background for Active State */}
                            <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-white/15 shadow-inner backdrop-blur-md' : 'bg-transparent'}`}>
                                <item.icon
                                    size={28}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={isActive ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''}
                                />
                            </div>

                            <span className={`text-[11px] font-medium tracking-wide ${isActive ? 'font-black text-pink-200' : 'opacity-80'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
