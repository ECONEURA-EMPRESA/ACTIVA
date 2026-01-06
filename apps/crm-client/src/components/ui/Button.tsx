import React, { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon: Icon,
  size = 'md',
  ...props
}) => {
  const sizes = {
    sm: 'px-3 py-2 text-xs min-h-[36px] md:min-h-0', // Boosted for touch
    md: 'px-5 py-3 text-sm min-h-[44px] md:min-h-0',
  };
  const variants = {
    primary: 'btn-primary text-white',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all',
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
    danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} strokeWidth={2.5} />}
      {children}
    </button>
  );
};
