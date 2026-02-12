import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/format';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  type = 'button',
  onClick,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'border-2 border-secondary-500/30 bg-light-card dark:bg-dark-card text-secondary-600 dark:text-secondary-400 hover:border-secondary-500 hover:bg-secondary-500/10 hover:-translate-y-0.5',
    ghost: 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover',
    accent: 'bg-accent-950 hover:bg-accent-900 text-white hover:shadow-lg hover:shadow-accent-950/40',
    danger: 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-600/30',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          <span>Loading...</span>
        </>
      ) : children}
    </motion.button>
  );
};
