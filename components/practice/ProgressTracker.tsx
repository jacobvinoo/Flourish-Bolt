//components/practice/ProgressTracker.tsx

import { Star } from 'lucide-react';

interface ProgressTrackerProps {
    completedCount: number;
    totalCount: number;
}

export function ProgressTracker({ completedCount, totalCount }: ProgressTrackerProps) {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <div className="border-0 shadow-xl mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden rounded-2xl">
      <div className="pt-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6" /> Your Amazing Progress!
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold">{completedCount} / {totalCount}</div>
            <div className="text-sm opacity-90">Steps Done!</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}