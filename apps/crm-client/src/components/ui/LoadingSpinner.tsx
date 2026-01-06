import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 32,
  text,
  fullScreen = false,
}) => {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="animate-spin text-pink-500" size={size} />
      {text && <span className="text-slate-500 text-sm font-medium animate-pulse">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};
