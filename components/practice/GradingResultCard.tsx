//components/practice/GradingResultCard.tsx

import { Button } from '@/components/ui/button';

interface GradingResultCardProps {
  analysisResult: {
    imageUrl: string;
    score?: number; // From API-based grading
    overallScore?: number; // From simulated grading
    steadiness: number;
    accuracy: number;
    feedback?: string; // From API-based grading
    feedbackTip?: string; // From simulated grading
  };
  onComplete: () => void;
}

export function GradingResultCard({ analysisResult, onComplete }: GradingResultCardProps) {
  const score = analysisResult.score ?? analysisResult.overallScore ?? 0;
  const feedback = analysisResult.feedback ?? analysisResult.feedbackTip ?? 'No feedback provided.';
  
  return (
    <div className="p-6 rounded-2xl shadow-xl bg-white border">
      <h2 className="text-2xl font-bold text-center mb-6">AI Grading Results</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Submission</h3>
          <img src={analysisResult.imageUrl} alt="Graded worksheet" className="w-full rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="rounded-xl p-6 text-center mb-4 bg-gray-100">
            <p className="text-lg text-gray-600">Overall Score</p>
            <p className={`text-5xl font-bold ${score >= 90 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>{score}%</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm text-blue-600 font-medium">Steadiness</p>
              <p className="text-2xl font-bold text-blue-700">{analysisResult.steadiness}%</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-sm text-green-600 font-medium">Accuracy</p>
              <p className="text-2xl font-bold text-green-700">{analysisResult.accuracy}%</p>
            </div>
          </div>
          <div className="border-l-4 p-4 rounded-r-lg mb-6 bg-blue-50 border-blue-500">
            <h4 className="font-bold text-blue-800">Actionable Tip</h4>
            <p className="text-sm text-blue-700">{feedback}</p>
          </div>
          <Button onClick={onComplete} className="w-full h-12 text-lg font-bold bg-green-600 text-white hover:bg-green-700 flex items-center justify-center">
            <span>Continue to Next Step</span>
          </Button>
        </div>
      </div>
    </div>
  );
}