import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface WorksheetProps {
  title: string;
  instructions: string;
  level: number;
  exerciseType: 'vertical-lines' | 'horizontal-lines' | 'circles' | 'letters' | 'diagonal-lines' | 'intersecting-lines' | 'continuous-curves' | 'basic-shapes';
}

export function Worksheet({ title, instructions, level, exerciseType }: WorksheetProps) {
  // Function to get the appropriate iframe source based on exercise type
  const getWorksheetSrc = () => {
    switch (exerciseType) {
      case 'vertical-lines':
        return '/worksheets/vertical-lines.html';
      case 'horizontal-lines':
        return '/worksheets/horizontal-lines.html';
      case 'circles':
        return '/worksheets/circles.html';
      case 'diagonal-lines':
        return '/worksheets/diagonal-lines.html';
      case 'intersecting-lines':
        return '/worksheets/intersecting-lines.html';
      case 'continuous-curves':
        return '/worksheets/continuous-curves.html';
      case 'basic-shapes':
        return '/worksheets/basic-shapes.html';
      case 'letters':
        // This would be a generic letters template or could be more specific
        return '/worksheets/letter-a.html';
      default:
        return '/worksheets/vertical-lines.html';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Worksheet Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{instructions}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Level {level}
            </span>
            <Button 
              onClick={() => window.print()} 
              variant="outline" 
              size="sm"
              className="no-print"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Worksheet Content */}
      <div className="p-6">
        <iframe
          src={getWorksheetSrc()}
          className="w-full min-h-[800px] border rounded-lg"
          title={title}
        />
      </div>

      {/* Print Instructions - Only visible when printing */}
      <div className="hidden print:block p-6 border-t">
        <h3 className="font-bold text-lg mb-2">Printing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Print on standard 8.5" x 11" paper</li>
          <li>Use a pencil or pen for practice</li>
          <li>Follow the instructions at the top of the worksheet</li>
          <li>Take a photo of your completed work and upload it for feedback</li>
        </ol>
      </div>
    </div>
  );
}