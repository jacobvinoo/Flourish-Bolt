// components/SectionCard.tsx
import React from 'react';

export function SectionCard({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`shadow-xl rounded-2xl bg-white border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
