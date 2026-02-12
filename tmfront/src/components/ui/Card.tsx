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

const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' }) => {
  const colors = {
    primary: 'text-highlight bg-highlight/10 border-highlight/20',
    secondary: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    danger: 'text-red-400 bg-red-400/10 border-red-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  };

  return (
    <Card className="p-6 flex items-center gap-4 hover:bg-white/[0.03] transition-colors group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-muted mb-1">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </Card>
  );
};

export { Card, StatCard };
