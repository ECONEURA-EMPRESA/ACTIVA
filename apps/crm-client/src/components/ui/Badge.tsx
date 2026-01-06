import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'brand' | 'success' | 'group' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const c = {
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    brand: 'bg-pink-50 text-pink-700 border-pink-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    group: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-red-50 text-red-700 border-red-100',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${c[variant]}`}
    >
      {children}
    </span>
  );
};
