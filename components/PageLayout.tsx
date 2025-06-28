import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import AppHeader from './AppHeader';
import FloatingElements from './FloatingElements';

interface PageLayoutProps {
  children: React.ReactNode;
  isKidsMode?: boolean;
  backgroundVariant?: 'default' | 'minimal' | 'full';
  headerVariant?: 'landing' | 'authenticated' | 'minimal' | 'none';
  showBackgroundElements?: boolean;
  showFloatingElements?: boolean;
  floatingElementsProps?: {
    variant?: 'minimal' | 'full' | 'edges-only';
    density?: 'low' | 'medium' | 'high';
    showOnMobile?: boolean;
  };
  headerProps?: {
    showUserControls?: boolean;
    backLink?: string;
    backText?: string;
    profile?: any;
    currentStreak?: number;
    xp?: number;
  };
  className?: string;
  contentClassName?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  isKidsMode = false,
  backgroundVariant = 'default',
  headerVariant = 'landing',
  showBackgroundElements = true,
  showFloatingElements = true,
  floatingElementsProps = {
    variant: 'full',
    density: 'medium',
    showOnMobile: false
  },
  headerProps = {},
  className = '',
  contentClassName = ''
}) => {
  const backgroundClass = isKidsMode 
    ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50' 
    : 'bg-gray-50';

  // Tight universal max width for all content:
  const containerClass = 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8';

  // If we're on an authenticated page (not dashboard), add dashboard link
  const updatedHeaderProps = {
    ...headerProps,
    // Set backLink to dashboard for authenticated pages unless it's already set
    backLink: headerVariant === 'authenticated' && !headerProps.backLink ? '/dashboard' : headerProps.backLink,
    // Set backText to "Back to Dashboard" for authenticated pages unless it's already set
    backText: headerVariant === 'authenticated' && !headerProps.backText ? (isKidsMode ? '🏠 Back Home' : 'Back to Dashboard') : headerProps.backText
  };
  
  return (
    <div className={`min-h-screen transition-all duration-500 relative ${backgroundClass} ${className}`}>
      {/* Hide backgrounds on small screens */}
      {showBackgroundElements && (
        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0">
          <AnimatedBackground 
            isKidsMode={isKidsMode}
            variant={backgroundVariant}
          />
        </div>
      )}
      {showFloatingElements && (
        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0">
          <FloatingElements
            isKidsMode={isKidsMode}
            variant={floatingElementsProps.variant}
            density={floatingElementsProps.density}
            showOnMobile={false}
          />
        </div>
      )}

      {/* Header */}
      {headerVariant !== 'none' && (
        <AppHeader
          variant={headerVariant}
          isKidsMode={isKidsMode}
          {...updatedHeaderProps}
        />
      )}

      {/* Main Content */}
      <div className={`${containerClass} py-8 relative z-10 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;