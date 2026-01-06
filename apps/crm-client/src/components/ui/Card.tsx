import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties; // Added to fix build
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  hoverable = false,
  onClick,
  style,
}) => (
  <div
    className={`card-clinical ${hoverable ? 'card-hoverable' : ''} ${className}`}
    onClick={onClick}
    style={style}
  >
    <div className={noPadding ? '' : 'p-8'}>{children}</div>
  </div>
);
