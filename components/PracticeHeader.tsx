// components/PracticeHeader.tsx
import { PenTool, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PracticeHeader({ isKidsMode }: { isKidsMode: boolean }) {
  return (
    <header className={isKidsMode 
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      : 'bg-white border-b border-gray-200'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className={isKidsMode ? 'w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center' : 'w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center'}>
              <PenTool className="h-4 w-4 text-white" />
            </div>
            <h1 className={`text-xl font-bold ${isKidsMode ? 'text-white' : 'text-gray-900'}`}>
              {isKidsMode ? '✨ Flourish Practice!' : 'Flourish Practice'}
            </h1>
          </div>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className={isKidsMode ? 'text-white/90 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isKidsMode ? '🏠 Back Home' : 'Back to Dashboard'}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
