import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Activity,
  Settings,
  LogOut,
  X,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Download,
  Receipt,
  User,
  Baby,
  Contact,
} from 'lucide-react';
import { useFirebaseAuthState as useAuth } from '../auth/useAuth';
import { useTranslation } from 'react-i18next';

import { useInstallPrompt } from '../hooks/useInstallPrompt';
import logoCircular from '../assets/logo-alpha.png'; // RENAMED TO ALPHA, KEPT VAR NAME FOR MINIMAL DIFF
import { SidebarAgenda } from './SidebarAgenda';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userEmail?: string;
  isOpen?: boolean; // Mobile State
  onClose?: () => void; // Mobile Close
  events?: Array<{
    date: string;
    time: string;
    type: 'individual' | 'group';
    patientName?: string;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  userEmail,
  isOpen = false,
  onClose,
}) => {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { isInstallable, promptInstall } = useInstallPrompt();

  const handleNavigate = (id: string) => {
    onNavigate(id);
    if (onClose) onClose(); // Close mobile menu on click
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
                    fixed md:sticky top-0 h-screen transition-all duration-300 ease-out z-50
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    ${collapsed ? 'md:w-24' : 'w-72 md:w-80'}
                    flex flex-col border-r border-slate-200
                    bg-white/90 backdrop-blur-xl shadow-2xl
                `}
      >
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-100/20 pointer-events-none"></div>

        {/* Header */}
        <div
          className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-200/60 relative z-10`}
        >
          <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? 'scale-90' : ''} group cursor-pointer`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-pink-500/20 to-transparent flex items-center justify-center shadow-md shadow-pink-500/10 ring-1 ring-white overflow-hidden bg-white">
                <img
                  src={logoCircular}
                  alt="Activa Logo"
                  className="w-full h-full object-cover rounded-full"
                  width="48"
                  height="48"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-col justify-center animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                  Clínica <ChevronRight size={10} className="rotate-90" />
                </span>
                <span className="text-sm font-black tracking-tight text-slate-800 leading-none group-hover:text-pink-600 transition-colors">
                  ACTIVA
                </span>
                <span className="text-[0.55rem] font-bold text-[#EC008C] uppercase tracking-[0.1em] mt-0.5">
                  Enterprise Edition
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm"
          >
            {collapsed ? <ChevronRight size={14} strokeWidth={1.5} /> : <ChevronLeft size={14} strokeWidth={1.5} />}
          </button>

          {isInstallable && (
            <button
              onClick={promptInstall}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative mt-2 md:mt-0 md:absolute md:top-20 md:left-1/2 md:-translate-x-1/2 md:w-auto md:px-2 md:py-1
                bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-200 border border-transparent hover:shadow-xl hover:scale-[1.02]
                ${collapsed ? 'hidden' : 'block'}
              `}
              title={t('sidebar.pwa.install_long')}
            >
              <Download
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:bounce"
              />
              <span className="font-bold text-xs tracking-wide ml-2">{t('sidebar.pwa.install_short')}</span>
            </button>
          )}

          {/* Mobile Install Button (Visible in Menu) */}
          {isInstallable && (
            <button
              onClick={promptInstall}
              className="md:hidden w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg mb-4"
            >
              <Download size={20} strokeWidth={1.5} />
              <span className="font-bold text-sm">{t('sidebar.pwa.install_long')}</span>
            </button>
          )}

          {isInstallable && (
            <button
              onClick={promptInstall}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative mt-2
                bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-200 border border-transparent hover:shadow-xl hover:scale-[1.02]
                ${collapsed ? 'md:justify-center md:px-0' : ''}
                min-h-[44px] touch-manipulation
              `}
            >
              <Download
                size={20}
                strokeWidth={1.5}
                className={`transition-transform duration-300 ${collapsed ? '' : 'group-hover:bounce'}`}
              />
              {(!collapsed || isOpen) && (
                <span className={`font-bold text-sm tracking-wide md:${collapsed ? 'hidden' : 'block'}`}>
                  {t('sidebar.pwa.download')}
                </span>
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:bg-slate-200"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar relative z-10">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`
                            w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                            ${currentView === 'dashboard'
                ? 'bg-gradient-to-r from-slate-100 to-white text-[#EC008C] shadow-md shadow-slate-200 border border-slate-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
              }
                            ${collapsed ? 'md:justify-center md:px-0' : ''}
                        `}
          >
            {currentView === 'dashboard' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#EC008C] rounded-r-full shadow-[0_0_8px_#EC008C]"></div>
            )}

            <Activity
              size={20}
              strokeWidth={1.5}
              className={`transition-transform duration-300 ${currentView === 'dashboard' ? 'scale-110 drop-shadow-sm text-pink-600' : 'group-hover:scale-110 text-slate-400'}`}
            />
            {(!collapsed || isOpen) && (
              <span
                className={`font-medium text-sm tracking-wide ${currentView === 'dashboard' ? 'font-bold text-slate-900' : 'text-slate-600'} md:${collapsed ? 'hidden' : 'block'}`}
              >
                {t('sidebar.nav.dashboard')}
              </span>
            )}
          </button>

          {/* SECTION: DEMOGRAPHICS */}
          <div className="pt-4 pb-2">
            {(!collapsed || isOpen) && (
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:block hidden">
                {t('sidebar.nav.patients.section')}
              </p>
            )}
            {[
              { id: 'patients', icon: Contact, label: t('sidebar.nav.patients.all') },
              { id: 'patients-adults', icon: User, label: t('sidebar.nav.patients.adults') },
              { id: 'patients-kids', icon: Baby, label: t('sidebar.nav.patients.kids') },
              { id: 'groups', icon: Users, label: 'Grupos' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${currentView === item.id ? 'bg-slate-100 text-pink-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <item.icon
                  size={18}
                  strokeWidth={1.5}
                  className={currentView === item.id ? 'text-pink-500' : 'text-slate-400'}
                />
                {(!collapsed || isOpen) && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </div>

          {/* SECTION: MANAGEMENT */}
          <div className="pt-2 pb-2">
            {(!collapsed || isOpen) && (
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:block hidden">
                {t('sidebar.nav.management.section')}
              </p>
            )}
            <button
              onClick={() => handleNavigate('calendar')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${currentView === 'calendar' ? 'bg-slate-100 text-pink-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Calendar
                size={18}
                strokeWidth={1.5}
                className={currentView === 'calendar' ? 'text-pink-500' : 'text-slate-400'}
              />
              {(!collapsed || isOpen) && <span className="text-sm">Agenda</span>}
            </button>

            <button
              onClick={() => handleNavigate('sessions')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${currentView === 'sessions' ? 'bg-slate-100 text-pink-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Sparkles
                size={18}
                strokeWidth={1.5}
                className={currentView === 'sessions' ? 'text-pink-500' : 'text-slate-400'}
              />
              {(!collapsed || isOpen) && <span className="text-sm">Individual</span>}
            </button>

            <button
              onClick={() => handleNavigate('group-sessions')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${currentView === 'group-sessions' ? 'bg-slate-100 text-pink-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Users
                size={18}
                strokeWidth={1.5}
                className={currentView === 'group-sessions' ? 'text-pink-500' : 'text-slate-400'}
              />
              {(!collapsed || isOpen) && <span className="text-sm">Grupal</span>}
            </button>



          </div>

          {/* SECTION: TOOLS */}
          <div className="pt-2 pb-2">
            {(!collapsed || isOpen) && (
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:block hidden">
                {t('sidebar.nav.tools.section')}
              </p>
            )}
            <button
              onClick={() => handleNavigate('resources')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${currentView === 'resources' ? 'bg-slate-100 text-pink-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FileText
                size={18}
                strokeWidth={1.5}
                className={currentView === 'resources' ? 'text-pink-500' : 'text-slate-400'}
              />
              {(!collapsed || isOpen) && <span className="text-sm">{t('sidebar.nav.tools.resources')}</span>}
            </button>
            <button
              onClick={() => handleNavigate('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${currentView === 'settings' ? 'bg-slate-100 text-pink-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Settings
                size={18}
                strokeWidth={1.5}
                className={currentView === 'settings' ? 'text-pink-500' : 'text-slate-400'}
              />
              {(!collapsed || isOpen) && <span className="text-sm">{t('sidebar.nav.tools.settings')}</span>}
            </button>
            <button
              onClick={() => handleNavigate('billing')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${currentView === 'billing' ? 'bg-slate-100 text-pink-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {/* Note: I reused Receipt import logic, assuming it is imported. Earlier delete removed usage but not import. */}
              <Receipt
                size={18}
                strokeWidth={1.5}
                className={currentView === 'billing' ? 'text-pink-500' : 'text-slate-400'}
              />
              {(!collapsed || isOpen) && <span className="text-sm">Facturación</span>}
            </button>
          </div>
        </nav>

        {/* Agenda Widget */}
        <div className={`md:${collapsed ? 'hidden' : 'block'}`}>
          <SidebarAgenda />
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-200/60 relative z-10">
          <div
            className={`
                        flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-200/50
                        ${collapsed ? 'md:justify-center md:p-2' : ''}
                    `}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner ring-2 ring-white">
                {userEmail?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>

            {(!collapsed || isOpen) && (
              <div className={`flex-1 overflow-hidden md:${collapsed ? 'hidden' : 'block'}`}>
                <p className="text-xs font-bold text-slate-700 truncate tracking-wide">
                  {userEmail?.split('@')[0]}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Fingerprint size={10} strokeWidth={1.5} className="text-emerald-500" />
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {t('sidebar.user.verified')}
                  </span>
                </div>
                <div className="mt-0.5 ml-0.5">
                  <span className="text-[8px] text-slate-400 font-mono opacity-60">v5.1.0 (Reset)</span>
                </div>
              </div>
            )}

            {(!collapsed || isOpen) && (
              <button
                onClick={signOut}
                className={`p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-red-500 transition-all md:${collapsed ? 'hidden' : 'block'}`}
              >
                <LogOut size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </aside >
    </>
  );
};
