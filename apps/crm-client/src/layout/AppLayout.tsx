import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import dashboardBg from '../assets/dashboard-bg-metallic.png';

interface AppLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  userEmail?: string;
  onLogout: () => void;
  events?: any[];
}

import { Menu } from 'lucide-react';

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  onNavigate,
  userEmail,
  events = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-100 font-sans">
      {/* GLOBAL METALLIC DASHBOARD BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          src={dashboardBg}
          alt="Clinical Metallic Atmosphere"
          className="w-full h-full object-cover opacity-60"
        />
        {/* White overlay for content readability */}
        <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
      </div>

      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        userEmail={userEmail}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        events={events}
      />

      <main className="flex-1 relative z-10 transition-all duration-300 overflow-y-auto h-screen flex flex-col">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden p-4 flex items-center justify-between bg-white/50 backdrop-blur-md border-b border-white/50 sticky top-0 z-30">
          <span className="font-bold text-slate-700 tracking-wider text-sm">MÉTODO ACTIVA</span>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-slate-600 active:bg-slate-200 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="container mx-auto p-4 md:p-8 lg:p-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};
