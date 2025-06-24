// components/FloatingElements.tsx
'use client';

import { Sparkles, FileText, Brush } from 'lucide-react';
import clsx from 'clsx';

type FloatingElementsProps = {
  brightness?: 'normal' | 'high';
  verticalDistribution?: 'even' | 'clustered';
};

export default function FloatingElements({
  brightness = 'normal',
  verticalDistribution = 'clustered',
}: FloatingElementsProps) {
  const baseStyle = 'absolute rounded-full shadow-md flex items-center justify-center text-white';
  const bright = brightness === 'high';
  const even = verticalDistribution === 'even';

  const elements = [
    {
      style: 'left-8 top-24 animate-float-slow bg-red-500',
      label: 'A',
    },
    {
      style: 'left-20 bottom-32 animate-float bg-yellow-400',
      label: '⭐',
    },
    {
      style: 'right-10 top-36 animate-float-delay bg-green-500',
      label: 'F',
    },
    {
      style: 'right-24 bottom-24 animate-float bg-purple-500',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      style: 'left-10 top-2/4 animate-float-slow bg-blue-400',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      style: 'right-16 top-1/4 animate-float-delay bg-pink-500',
      icon: <Brush className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {elements.map((el, idx) => (
        <div
          key={idx}
          className={clsx(
            baseStyle,
            el.style,
            bright ? 'opacity-90' : 'opacity-70',
            even ? 'md:top-auto' : '',
            'w-9 h-9 text-sm font-bold'
          )}
        >
          {el.label || el.icon}
        </div>
      ))}
    </>
  );
}