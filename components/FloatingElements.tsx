import React from 'react';

interface FloatingElementsProps {
  isKidsMode?: boolean;
  variant?: 'full' | 'minimal' | 'edges-only';
  density?: 'low' | 'medium' | 'high';
  showOnMobile?: boolean;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  isKidsMode = false,
  variant = 'full',
  density = 'medium',
  showOnMobile = false
}) => {
  const baseOpacity = isKidsMode ? 'opacity-70' : 'opacity-50';
  const mobileClass = showOnMobile ? '' : 'hidden md:block';

  // Left side elements
  const leftElements = [
    {
      id: 'pencil',
      position: 'top-20 left-4',
      size: 'w-12 h-12',
      animation: 'animate-float',
      component: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
          <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
        </svg>
      )
    },
    {
      id: 'letterA',
      position: 'top-64 left-2',
      size: 'w-12 h-12',
      animation: 'animate-float-delay',
      component: (
        <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
          A
        </div>
      )
    },
    {
      id: 'letterG',
      position: 'top-96 left-6',
      size: 'w-14 h-14',
      animation: 'animate-bounce-slow',
      component: (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
          G
        </div>
      )
    },
    {
      id: 'starLeft',
      position: 'bottom-32 left-8',
      size: 'w-10 h-10',
      animation: 'animate-twinkle-delay',
      component: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400 drop-shadow-lg">
          <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
        </svg>
      )
    }
  ];

  // Right side elements
  const rightElements = [
    {
      id: 'starRight',
      position: 'top-32 right-4',
      size: 'w-12 h-12',
      animation: 'animate-twinkle',
      component: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-pink-400 drop-shadow-lg">
          <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
        </svg>
      )
    },
    {
      id: 'letterB',
      position: 'top-56 right-2',
      size: 'w-12 h-12',
      animation: 'animate-float',
      component: (
        <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
          B
        </div>
      )
    },
    {
      id: 'letterC',
      position: 'bottom-56 right-6',
      size: 'w-12 h-12',
      animation: 'animate-bounce-slow',
      component: (
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
          C
        </div>
      )
    },
    {
      id: 'book',
      position: 'top-1/2 right-4',
      size: 'w-16 h-16',
      animation: 'animate-float-slow',
      component: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-green-500 drop-shadow-lg">
          <path fill="currentColor" d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,21.1 22.25,21.81C22.35,21.86 22.4,21.91 22.5,21.91C22.75,21.91 23,21.66 23,21.41V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,19.81V6.5C10.55,5.4 8.45,5 6.5,5Z" />
        </svg>
      )
    },
    {
      id: 'number1',
      position: 'bottom-20 right-4',
      size: 'w-12 h-12',
      animation: 'animate-bounce-slow',
      component: (
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
          1
        </div>
      )
    }
  ];

  // Filter elements based on variant and density
  const getFilteredElements = (elements: typeof leftElements) => {
    let filtered = [...elements];
    
    if (variant === 'minimal') {
      filtered = elements.slice(0, 2);
    } else if (variant === 'edges-only') {
      filtered = elements.filter(el => 
        el.position.includes('left-2') || 
        el.position.includes('left-4') || 
        el.position.includes('right-2') || 
        el.position.includes('right-4')
      );
    }
    
    if (density === 'low') {
      filtered = filtered.slice(0, Math.ceil(filtered.length / 2));
    } else if (density === 'high' && variant === 'full') {
      // Keep all elements for high density
    }
    
    return filtered;
  };

  const filteredLeftElements = getFilteredElements(leftElements);
  const filteredRightElements = getFilteredElements(rightElements);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-10 ${mobileClass}`}>
      {/* Left side elements */}
      {filteredLeftElements.map((element) => (
        <div
          key={`left-${element.id}`}
          className={`absolute ${element.position} ${element.size} ${element.animation} ${baseOpacity} z-10`}
        >
          {element.component}
        </div>
      ))}

      {/* Right side elements */}
      {filteredRightElements.map((element) => (
        <div
          key={`right-${element.id}`}
          className={`absolute ${element.position} ${element.size} ${element.animation} ${baseOpacity} z-10`}
        >
          {element.component}
        </div>
      ))}

      {/* Kids mode additional elements */}
      {isKidsMode && variant === 'full' && (
        <>
          {/* Additional playful elements for kids */}
          <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-cyan-500 rounded-full animate-float flex items-center justify-center text-white font-bold text-xl shadow-xl z-10 opacity-60">
            L
          </div>
          <div className="absolute bottom-1/2 right-32 w-12 h-12 bg-violet-500 rounded-full animate-twinkle flex items-center justify-center text-white font-bold text-xl shadow-xl z-10 opacity-60">
            O
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingElements;