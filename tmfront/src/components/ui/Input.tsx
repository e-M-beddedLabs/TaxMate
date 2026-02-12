import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-highlight transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-surface border border-white/10 rounded-xl px-4 py-3
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-highlight/20 focus:border-highlight/50
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500' : 'hover:border-white/20'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400 ml-1">{error}</p>
      )}
    </div>
  );
};

export { Input };
