import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/format';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  animate = true,
  delay = 0,
  hover = false,
  onClick,
}) => {
  const baseClasses = cn(
    'bg-light-card dark:bg-dark-card',
    'border border-light-border dark:border-dark-border',
    'rounded-2xl p-6',
    'transition-all duration-300',
    hover && 'cursor-pointer hover:border-primary-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-600/10',
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: 'easeOut' }}
        whileHover={hover ? { scale: 1.02 } : {}}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

// Stat Card variant
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  delay = 0,
}) => {
  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-500 bg-primary-600/10',
    secondary: 'text-secondary-600 dark:text-secondary-400 bg-secondary-500/10',
    success: 'text-green-600 dark:text-green-400 bg-green-500/10',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    danger: 'text-red-600 dark:text-red-400 bg-red-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-6"
    >
      {/* Background decoration */}
      <div className={cn(
        'absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-50',
        colorClasses[color].split(' ')[1]
      )} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', colorClasses[color])}>
            {icon}
          </div>
          {trend && (
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        
        <p className="text-sm text-light-muted dark:text-dark-muted mb-1">
          {title}
        </p>
        <p className={cn('text-2xl lg:text-3xl font-bold', colorClasses[color].split(' ')[0])}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};
