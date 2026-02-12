import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'solid';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 border backdrop-blur-md';

  const variants = {
    // Standard glass effect: barely visible background, subtle border
    default: 'bg-surface border-border',
    // Interactive card: glows and lifts on hover
    hover: 'bg-surface border-border cursor-pointer hover:bg-surface-hover hover:border-border-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-highlight/5',
    // More opaque for heavy content
    solid: 'bg-[#111] border-white/5',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { Card };
