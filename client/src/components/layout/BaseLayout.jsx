import React from 'react';
import { cn } from '@/lib/utils';

/**
 * BaseLayout component for consistent spacing and structure
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hasNavbar - Whether to account for navbar spacing
 * @param {boolean} props.fullWidth - Whether to use full width or container
 * @param {string} props.background - Background style
 */
const BaseLayout = ({ 
  children, 
  className = '', 
  hasNavbar = true, 
  fullWidth = false,
  background = 'default'
}) => {
  const backgroundStyles = {
    default: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50',
    white: 'bg-white',
    transparent: 'bg-transparent'
  };

  return (
    <div className={cn(
      'min-h-screen',
      backgroundStyles[background],
      hasNavbar && 'pt-16', // Account for fixed navbar
      className
    )}>
      <div className={cn(
        'w-full',
        !fullWidth && 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        fullWidth && 'px-0'
      )}>
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;