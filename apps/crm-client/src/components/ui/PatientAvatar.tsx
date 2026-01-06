import React from 'react';

interface PatientAvatarProps {
  photo?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({ photo, name, size = 'md' }) => {
  const s = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  };
  const isImage = photo && photo.length > 5 && photo.includes('data:image');

  return (
    <div
      className={`${s[size]} rounded-2xl flex items-center justify-center font-black shadow-lg overflow-hidden shrink-0 ring-4 ring-white border border-slate-100 
            ${!isImage ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white' : 'bg-white'}`}
    >
      {isImage ? (
        <img src={photo} alt={name} className="w-full h-full object-cover" />
      ) : (
        name?.substring(0, 2).toUpperCase()
      )}
    </div>
  );
};
