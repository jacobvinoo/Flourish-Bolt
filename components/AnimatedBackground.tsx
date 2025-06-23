import React from 'react';

interface AnimatedBackgroundProps {
  isKidsMode?: boolean;
  variant?: 'default' | 'minimal' | 'full';
  showWaves?: boolean;
  showPatterns?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  isKidsMode = false,
  variant = 'default',
  showWaves = true,
  showPatterns = true
}) => {
  const leftWaveColors = isKidsMode 
    ? { start: "#ec4899", middle: "#8b5cf6", end: "#1e40af" }
    : { start: "#3b82f6", middle: "#6366f1", end: "#1e40af" };
    
  const rightWaveColors = isKidsMode 
    ? { start: "#06b6d4", middle: "#3b82f6", end: "#8b5cf6" }
    : { start: "#10b981", middle: "#059669", end: "#3b82f6" };

  const patternColors = isKidsMode
    ? { primary: "#8b5cf6", secondary: "#06b6d4" }
    : { primary: "#3b82f6", secondary: "#10b981" };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Wavy Edges */}
      {showWaves && (
        <>
          {/* Left Wavy Edge */}
          <div className={`absolute left-0 top-0 h-full ${variant === 'minimal' ? 'w-20 opacity-20' : 'w-80 opacity-70'}`}>
            <svg viewBox="0 0 200 800" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="leftWave" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={leftWaveColors.start} />
                  <stop offset="50%" stopColor={leftWaveColors.middle} />
                  <stop offset="100%" stopColor={leftWaveColors.end} />
                </linearGradient>
              </defs>
              <path 
                d="M0,0 L0,800 L120,800 Q160,720 120,640 Q80,560 120,480 Q160,400 120,320 Q80,240 120,160 Q160,80 120,0 Z" 
                fill="url(#leftWave)"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="translate"
                  values="0,0; 0,-8; 0,0; 0,4; 0,0"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

          {/* Right Wavy Edge */}
          <div className={`absolute right-0 top-0 h-full ${variant === 'minimal' ? 'w-20 opacity-20' : 'w-80 opacity-70'}`}>
            <svg viewBox="0 0 200 800" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rightWave" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={rightWaveColors.start} />
                  <stop offset="50%" stopColor={rightWaveColors.middle} />
                  <stop offset="100%" stopColor={rightWaveColors.end} />
                </linearGradient>
              </defs>
              <path 
                d="M200,0 L200,800 L80,800 Q40,720 80,640 Q120,560 80,480 Q40,400 80,320 Q120,240 80,160 Q40,80 80,0 Z" 
                fill="url(#rightWave)"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="translate"
                  values="0,0; 0,6; 0,0; 0,-4; 0,0"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        </>
      )}

      {/* Background Patterns */}
      {showPatterns && variant !== 'minimal' && (
        <>
          {/* Top-left spinning pattern */}
          <div className="absolute -top-32 -left-32 w-96 h-96 opacity-20">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={patternColors.primary} />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
              </defs>
              <path d="M20,100 Q100,20 180,100 Q100,180 20,100" fill="url(#gradient1)" opacity="0.3" />
            </svg>
          </div>

          {/* Bottom-right spinning pattern */}
          <div className="absolute -bottom-32 -right-40 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-reverse">
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={patternColors.secondary} />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#gradient2)" opacity="0.4" />
            </svg>
          </div>
        </>
      )}

      {/* Wavy lines overlay */}
      {variant === 'full' && (
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 1200 600" className="absolute inset-0">
            <defs>
              <pattern id="wave" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q50,0 100,50 T200,50" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AnimatedBackground;