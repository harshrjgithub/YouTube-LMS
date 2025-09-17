import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * PageHeader component for consistent page headers
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 * @param {React.ReactNode} props.actions - Action buttons
 * @param {boolean} props.showBackButton - Whether to show back button
 * @param {string} props.backTo - Where back button should navigate
 * @param {string} props.className - Additional CSS classes
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  actions, 
  showBackButton = false, 
  backTo = -1,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof backTo === 'string') {
      navigate(backTo);
    } else {
      navigate(backTo);
    }
  };

  return (
    <div className={cn(
      'py-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;