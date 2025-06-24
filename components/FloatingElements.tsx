'use client';

import { Sparkles, FileText, Brush, Smile, Star, Heart } from 'lucide-react';
import clsx from 'clsx';

export interface FloatingElementsProps {
  variant?: 'full' | 'minimal' | 'edges-only';
  density?: 'sparse' | 'medium' | 'dense' | 'low' | 'high';
  showOnMobile?: boolean;
  isKidsMode?: boolean;
}

export default function FloatingElements({
  variant = 'full',
  density = 'medium',
  showOnMobile = true,
  isKidsMode = false,
}: FloatingElementsProps) {
  const baseStyle =
    'absolute rounded-full shadow-md flex items-center justify-center text-black text-sm font-bold w-9 h-9 transition-transform duration-1000 ease-in-out';

  const normalizedDensity = (() => {
    if (density === 'low') return 'sparse';
    if (density === 'high') return 'dense';
    return density;
  })();

  const getDensityCount = () => {
    switch (normalizedDensity) {
      case 'sparse':
        return 4;
      case 'dense':
        return 12;
      default:
        return 7;
    }
  };

  const defaultIcons = [Sparkles, FileText, Brush];
  const kidsIcons = [Smile, Star, Heart];
  const labels = ['A', '⭐', 'F', 'B', '💡', 'D'];
  const colorPalette = [
    'bg-red-400',
    'bg-yellow-300',
    'bg-green-400',
    'bg-pink-300',
    'bg-purple-400',
    'bg-blue-300',
  ];

  const icons = isKidsMode ? kidsIcons : defaultIcons;

  const elements = Array.from({ length: getDensityCount() }, (_, i) => {
    const Icon = icons[i % icons.length];
    const label = labels[i % labels.length];
    const bgColor = colorPalette[i % colorPalette.length];
    const horizontal = Math.random() > 0.5 ? 'left-[5%]' : 'right-[5%]';
    const topPercent = Math.random() * 90 + 5; // randomized spacing
    const delay = `${Math.random() * 2}s`;
    const scale = Math.random() * 0.5 + 0.8; // scale between 0.8 and 1.3

    return {
      key: i,
      topPercent,
      horizontal,
      isIcon: variant === 'full' ? i % 2 === 0 : false, // alternate icon and letter
      Icon,
      label,
      bgColor,
      delay,
      scale,
    };
  });

  return (
    <div className={clsx(!showOnMobile && 'hidden sm:block')}>
      {elements.map(({ key, topPercent, horizontal, isIcon, Icon, label, bgColor, delay, scale }) => (
        <div
          key={key}
          className={clsx(baseStyle, horizontal, 'animate-float', bgColor, 'opacity-80')}
          style={{ top: `${topPercent}%`, animationDelay: delay, transform: `scale(${scale})` }}
        >
          {isIcon ? <Icon className="w-5 h-5" /> : label}
        </div>
      ))}
    </div>
  );
}
