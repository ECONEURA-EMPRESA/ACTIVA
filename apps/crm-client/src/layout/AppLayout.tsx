
import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import dashboardBg from '../assets/dashboard-bg-metallic.png';

import logoCircular from '../assets/logo-circular.png';
import { CalendarEvent } from '../lib/types';

interface AppLayoutProps {
  children: ReactNode;
  userEmail: string;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  events?: CalendarEvent[];
}

// Unused imports removed
import { MobileBottomNav } from './MobileBottomNav';
import { useUIStore } from '../stores/useUIStore';

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  onNavigate,
  userEmail,
  events = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { quickAppointment } = useUIStore(); // Hook into Global UI Store

  return (
    <div className="flex min-h-[100dvh] relative overflow-hidden bg-slate-100 font-sans transition-colors duration-500">
      {/* GLOBAL METALLIC DASHBOARD BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          src={dashboardBg}
          alt="Clinical Metallic Atmosphere"
          className="w-full h-full object-cover opacity-60"
        />
        {/* White overlay for content readability */}
        <div className="absolute inset-0 bg-white/40 pointer-events-none transition-colors duration-500"></div>
      </div>

      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        userEmail={userEmail}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        events={events}
      />

      {/* MOBILE BOTTOM NAV - REPLACES HEADER & SIDEBAR ON MOBILE */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onNewAction={() => quickAppointment.open('new')}
        isMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 relative z-10 transition-all duration-300 h-screen overflow-y-auto flex flex-col no-select">


        {/* MOBILE HEADER (Visible only on small screens) */}
        <header className="md:hidden w-full px-6 py-4 flex items-center justify-between z-20 sticky top-0 bg-slate-100/80 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-200 p-0.5 shadow-sm ring-1 ring-white">
              <img src={logoCircular} alt="Activa Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-[#EC008C] leading-none">
                ACTIVA
              </h1>
              <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">CLINICAL SAAS</p>
            </div>
          </div>
          {/* User Avatar or Settings could go here */}
        </header>

        <div className="container mx-auto p-0 md:p-8 lg:p-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};
