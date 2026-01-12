import React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => (
  <div className="fixed top-4 left-4 right-4 md:left-auto md:top-auto md:bottom-6 md:right-6 z-50 animate-in slide-in-from-top-4 md:slide-in-from-bottom-4 fade-in duration-300 flex justify-center md:block">
    <div
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-3d border ${type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}
    >
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={18} />
      </button>
    </div>
  </div>
);
