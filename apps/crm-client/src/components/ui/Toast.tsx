import React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
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
