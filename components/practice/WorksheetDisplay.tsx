// components/practice/WorksheetDisplay.tsx

import { Button } from '@/components/ui/button';
import { Eye, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

interface WorksheetStep {
  id: string;
  title: string;
  friendlyTitle?: string;
  description: string;
  kidsDescription?: string;
  color: string;
  emoji: string;
}

interface WorksheetDisplayProps {
  currentWorksheet: WorksheetStep;
  isKidsMode: boolean;
  onOpen: () => void;
  onPrint: () => void;
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  currentStep: number;
  totalSteps: number;
}

export function WorksheetDisplay({
  currentWorksheet,
  isKidsMode,
  onOpen,
  onPrint,
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
  currentStep,
  totalSteps,
}: WorksheetDisplayProps) {
  return (
    <div className={`border-0 shadow-xl overflow-hidden rounded-2xl ${isKidsMode ? `bg-gradient-to-br ${currentWorksheet.color} text-white` : 'bg-white border'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{currentWorksheet.emoji}</div>
            <div>
              <h3 className={`text-2xl font-bold ${isKidsMode ? 'text-white' : 'text-gray-900'}`}>{isKidsMode ? (currentWorksheet.friendlyTitle || currentWorksheet.title) : currentWorksheet.title}</h3>
              <p className={`mt-2 text-lg ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>{isKidsMode ? (currentWorksheet.kidsDescription || currentWorksheet.description) : currentWorksheet.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div className="flex items-center gap-4">
            <Button onClick={onOpen} className="flex-1 h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center">
              <Eye className="h-5 w-5 mr-2" />
              <span>Open Worksheet</span>
            </Button>
            <Button onClick={onPrint} variant="outline" size="icon" className="h-12 w-12 flex items-center justify-center">
              <Printer className="h-5 w-5" />
            </Button>
        </div>
        <div className="flex items-center justify-between">
          <Button onClick={onPrev} disabled={isPrevDisabled} variant="outline" className="flex items-center">
            <ChevronLeft className="h-5 w-5 mr-2" />
            <span>Previous</span>
          </Button>
          <span className="font-bold">{currentStep + 1} of {totalSteps}</span>
          <Button onClick={onNext} disabled={isNextDisabled} variant="outline" className="flex items-center">
            <span>Next</span>
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}