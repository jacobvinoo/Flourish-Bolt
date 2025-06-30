//components/practice/StepNavigation.tsx

import { CheckCircle } from 'lucide-react';

interface Step {
    id: string;
    title: string;
    friendlyTitle?: string;
    emoji: string;
}

interface StepNavigationProps {
    title?: string;
    steps: Step[];
    currentStepIndex: number;
    completedSteps: Set<string>;
    onStepSelect: (index: number) => void;
    isKidsMode: boolean;
}

export function StepNavigation({
    title = "Quick Navigation",
    steps,
    currentStepIndex,
    completedSteps,
    onStepSelect,
    isKidsMode,
}: StepNavigationProps) {
  return (
    <div className="p-6 border-0 shadow-xl rounded-2xl bg-white/50">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepSelect(index)}
            className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-3 ${
              index === currentStepIndex
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : completedSteps.has(step.id)
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="font-mono text-xl">{step.emoji}</span>
            <span className="font-semibold">{isKidsMode ? (step.friendlyTitle || step.title) : step.title}</span>
            {completedSteps.has(step.id) && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
          </button>
        ))}
      </div>
    </div>
  );
}

