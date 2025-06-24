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
    'absolute rounded-full shadow-md flex items-center justify-center text-black text-sm font-bold w-12 h-12 transition-transform duration-1000 ease-in-out';

  const normalizedDensity = (() => {
    if (density === 'low') return 'sparse';
    if (density === 'high') return 'dense';
    return density;
  })();

  const getDensityCount = () => {
    switch (normalizedDensity) {
      case 'sparse':
        return 6;
      case 'dense':
        return 14;
      default:
        return 10;
    }
  };

  const defaultIcons = [Sparkles, FileText, Brush];
  const kidsIcons = [Smile, Star, Heart];
  const labels = ['A', '⭐', 'F', 'B', '💡', 'D', 'G', '✏️', 'H'];
  const colorPalette = [
    'bg-rose-300',
    'bg-orange-200',
    'bg-lime-300',
    'bg-cyan-300',
    'bg-violet-300',
    'bg-sky-300',
    'bg-pink-400',
    'bg-indigo-200',
  ];

  const icons = isKidsMode ? kidsIcons : defaultIcons;

  const elements = Array.from({ length: getDensityCount() }, (_, i) => {
    const Icon = icons[i % icons.length];
    const label = labels[i % labels.length];
    const bgColor = colorPalette[i % colorPalette.length];
    const horizontal = i % 2 === 0 ? 'left-[2%]' : 'right-[2%]';
    const topPercent = (i + 1) * (90 / (getDensityCount() + 1));
    const delay = `${Math.random() * 2}s`;
    const scale = Math.random() * 0.4 + 1.0;
    const shapeClass = i % 3 === 0 ? 'rounded-md' : i % 3 === 1 ? 'rounded-lg' : 'rounded-full';

    return {
      key: i,
      topPercent,
      horizontal,
      isIcon: variant === 'full' ? i % 2 === 0 : false,
      Icon,
      label,
      bgColor,
      delay,
      scale,
      shapeClass,
    };
  });

  return (
    <div className={clsx(!showOnMobile && 'hidden sm:block')}>
      {elements.map(({ key, topPercent, horizontal, isIcon, Icon, label, bgColor, delay, scale, shapeClass }) => (
        <div
          key={key}
          className={clsx(baseStyle, horizontal, 'animate-float', bgColor, 'opacity-90', shapeClass)}
          style={{ top: `${topPercent}%`, animationDelay: delay, transform: `scale(${scale})` }}
        >
          {isIcon ? <Icon className="w-6 h-6" /> : label}
        </div>
      ))}
    </div>
  );
}
