import React from 'react';
import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
  className?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      box: 'w-4 h-4',
      icon: 'w-2.5 h-2.5',
      text: 'text-sm',
      description: 'text-xs',
    },
    md: {
      box: 'w-5 h-5',
      icon: 'w-3 h-3',
      text: 'text-sm',
      description: 'text-xs',
    },
    lg: {
      box: 'w-6 h-6',
      icon: 'w-4 h-4',
      text: 'text-base',
      description: 'text-sm',
    },
  };

  const sizes = sizeClasses[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  if (variant === 'card') {
    return (
      <label
        htmlFor={id}
        className={`
          relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer
          ${checked 
            ? 'bg-gradient-to-br from-[#1F4B3F]/5 to-[#5bbb7b]/5 border-[#1F4B3F] shadow-sm' 
            : 'bg-white border-gray-200 hover:border-gray-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          ${className}
        `}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        
        {/* Custom Checkbox */}
        <div
          className={`
            relative flex items-center justify-center flex-shrink-0 rounded-md transition-all duration-200
            ${sizes.box}
            ${checked
              ? 'bg-gradient-to-br from-[#1F4B3F] to-[#5bbb7b] border-2 border-[#1F4B3F] scale-105'
              : 'bg-white border-2 border-gray-300'
            }
            ${!disabled && !checked && 'group-hover:border-[#1F4B3F]/40'}
          `}
        >
          {checked && (
            <Check 
              className={`${sizes.icon} text-white animate-in zoom-in duration-200`}
              strokeWidth={3}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={`font-semibold ${sizes.text} ${checked ? 'text-[#1F4B3F]' : 'text-[#222]'}`}>
            {label}
          </div>
          {description && (
            <p className={`mt-1 ${sizes.description} text-gray-600 leading-relaxed`}>
              {description}
            </p>
          )}
        </div>

        {/* Check indicator on the right (optional) */}
        {checked && (
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-[#5bbb7b] rounded-full animate-pulse" />
          </div>
        )}
      </label>
    );
  }

  // Default variant (inline)
  return (
    <label
      htmlFor={id}
      className={`
        group relative flex items-start gap-3 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
      
      {/* Custom Checkbox */}
      <div
        className={`
          relative flex items-center justify-center flex-shrink-0 rounded-md transition-all duration-200
          ${sizes.box}
          ${checked
            ? 'bg-gradient-to-br from-[#1F4B3F] to-[#5bbb7b] border-2 border-[#1F4B3F] shadow-sm scale-105'
            : 'bg-white border-2 border-gray-300'
          }
          ${!disabled && !checked && 'group-hover:border-[#1F4B3F]/60 group-hover:shadow-sm'}
        `}
      >
        {checked && (
          <Check 
            className={`${sizes.icon} text-white animate-in zoom-in duration-200`}
            strokeWidth={3}
          />
        )}
        
        {/* Ripple effect on check */}
        {checked && (
          <div className="absolute inset-0 rounded-md bg-[#5bbb7b]/20 animate-ping" />
        )}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0 pt-0.5">
        <span className={`font-medium ${sizes.text} ${checked ? 'text-[#1F4B3F]' : 'text-[#222]'}`}>
          {label}
        </span>
        {description && (
          <p className={`mt-0.5 ${sizes.description} text-gray-600`}>
            {description}
          </p>
        )}
      </div>
    </label>
  );
};