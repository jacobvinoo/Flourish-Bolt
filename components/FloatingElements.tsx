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
    'absolute rounded-full shadow-md flex items-center justify-center text-white text-sm font-bold w-9 h-9';

  const normalizedDensity = (() => {
    if (density === 'low') return 'sparse';
    if (density === 'high') return 'dense';
    return density;
  })();

  const getDensityCount = () => {
    switch (normalizedDensity) {
      case 'sparse':
        return 3;
      case 'dense':
        return 8;
      default:
        return 5;
    }
  };

  const defaultIcons = [Sparkles, FileText, Brush];
  const kidsIcons = [Smile, Star, Heart];
  const labels = ['A', '⭐', 'F'];

  const icons = isKidsMode ? kidsIcons : defaultIcons;

  const elements = Array.from({ length: getDensityCount() }, (_, i) => {
    const Icon = icons[i % icons.length];
    const label = labels[i % labels.length];
    const horizontal = i % 2 === 0 ? 'left-10' : 'right-10';

    const topPercent =
      variant === 'edges-only'
        ? i * (90 / (getDensityCount() - 1)) + 5
        : 10 + i * 10;

    return {
      key: i,
      style: `top-[${topPercent}%] ${horizontal} animate-float`,
      isIcon: variant === 'full',
      Icon,
      label,
    };
  });

  const bgColor = isKidsMode ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <div className={clsx(!showOnMobile && 'hidden sm:block')}>
      {elements.map(({ key, style, isIcon, Icon, label }) => (
        <div key={key} className={clsx(baseStyle, style, bgColor, 'opacity-80')}>
          {isIcon ? <Icon className="w-5 h-5" /> : label}
        </div>
      ))}
    </div>
  );
}
