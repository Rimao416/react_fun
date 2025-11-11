import { cn } from '@/app/lib/utils/utils';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  className,
  onChange,
  ...props
}) => {

  // Empêcher que le premier caractère soit un espace
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Si le premier caractère est un espace, on l’ignore
    if (value.startsWith(' ')) {
      e.target.value = value.trimStart();
    }

    // Appeler le onChange original si défini
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray w-5 h-5">{icon}</div>
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors',
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="text-gray w-5 h-5">{icon}</div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
