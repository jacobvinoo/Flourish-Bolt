import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import AppHeader from './AppHeader';
import FloatingElements from './FloatingElements';

interface PageLayoutProps {
  children: React.ReactNode;
  isKidsMode?: boolean;
  backgroundVariant?: 'default' | 'minimal' | 'full';
  headerVariant?: 'landing' | 'authenticated' | 'minimal' | 'none';
  containerWidth?: 'max-w-4xl' | 'max-w-6xl' | 'max-w-7xl' | 'full';
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
  containerWidth = 'max-w-7xl',
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

  const containerClass = containerWidth === 'full' 
    ? 'w-full px-4 sm:px-6 lg:px-8' 
    : `${containerWidth} mx-auto px-4 sm:px-6 lg:px-8`;

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${backgroundClass} ${className}`}>
      {/* Animated Background Elements */}
      {showBackgroundElements && (
        <AnimatedBackground 
          isKidsMode={isKidsMode}
          variant={backgroundVariant}
        />
      )}

      {/* Floating Side Elements */}
      {showFloatingElements && (
        <FloatingElements
          isKidsMode={isKidsMode}
          variant={floatingElementsProps.variant}
          density={floatingElementsProps.density}
          showOnMobile={floatingElementsProps.showOnMobile}
        />
      )}

      {/* Header */}
      {headerVariant !== 'none' && (
        <AppHeader
          variant={headerVariant}
          isKidsMode={isKidsMode}
          {...headerProps}
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