import { cn } from '@/app/lib/utils/utils';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'none'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4', 
    lg: 'p-6',
    xl: 'p-8'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;