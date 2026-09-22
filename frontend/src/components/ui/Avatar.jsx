import React from 'react';
import { cn, getInitials, randomGradient } from '../../utils/helpers';

const Avatar = ({ name, src, size = 'md', className, showRing = false, isOnline = false }) => {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-3xl',
    '3xl': 'w-36 h-36 text-4xl',
  };

  const gradient = randomGradient(name);

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white select-none overflow-hidden',
          sizes[size],
          showRing && 'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-900',
          `bg-gradient-to-br ${gradient}`
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-dark-900" />
      )}
    </div>
  );
};

export default Avatar;
