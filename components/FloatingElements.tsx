'use client';

import { Sparkles, FileText, Brush } from 'lucide-react';
import clsx from 'clsx';

export interface FloatingElementsProps {
  variant?: 'full' | 'minimal' | 'edges-only';
  density?: 'sparse' | 'medium' | 'dense';
  showOnMobile?: boolean;
}

export default function FloatingElements({
  variant = 'full',
  density = 'medium',
  showOnMobile = true,
}: FloatingElementsProps) {
  const baseStyle =
    'absolute rounded-full shadow-md flex items-center justify-center text-white text-sm font-bold w-9 h-9';

  const getDensityCount = () => {
    switch (density) {
      case 'sparse':
        return 3;
      case 'dense':
        return 8;
      default:
        return 5;
    }
  };

  const icons = [Sparkles, FileText, Brush];
  const labels = ['A', '⭐', 'F'];

  const elements = Array.from({ length: getDensityCount() }, (_, i) => {
    const Icon = icons[i % icons.length];
    const label = labels[i % labels.length];
    const horizontal = i % 2 === 0 ? 'left-10' : 'right-10';

    const topPercent =
      variant === 'edges-only'
        ? (i * (90 / (getDensityCount() - 1)) + 5) // evenly spaced between 5% and 95%
        : 10 + i * 10;

    return {
      key: i,
      style: `top-[${topPercent}%] ${horizontal} animate-float`,
      isIcon: variant === 'full',
      Icon,
      label,
    };
  });

  return (
    <div className={clsx(!showOnMobile && 'hidden sm:block')}>
      {elements.map(({ key, style, isIcon, Icon, label }) => (
        <div key={key} className={clsx(baseStyle, style, 'bg-green-500 opacity-80')}>
          {isIcon ? <Icon className="w-5 h-5" /> : label}
        </div>
      ))}
    </div>
  );
}
