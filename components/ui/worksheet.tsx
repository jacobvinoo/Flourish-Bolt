import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Printer } from 'lucide-react';

interface WorksheetProps {
  title: string;
  instructions: string;
  level: number;
  exerciseType: 'vertical-lines' | 'horizontal-lines' | 'circles' | 'letters' | 'intersecting-lines' | 'basic-shapes' | 'continuous-curves';
}

export function Worksheet({ title, instructions, level, exerciseType }: WorksheetProps) {
  const worksheetUrl = `/worksheets/${exerciseType}.html`;

  const openWorksheet = () => {
    window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{instructions}</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Difficulty Level:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              level <= 2 ? 'bg-green-100 text-green-800' :
              level <= 4 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {level <= 2 ? 'Beginner' : level <= 4 ? 'Intermediate' : 'Advanced'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            <span>Exercise Type: </span>
            <span className="font-medium">{exerciseType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={openWorksheet}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Open Worksheet</span>
          </Button>
          <Button 
            onClick={() => window.print()}
            variant="outline"
            className="flex-1 flex items-center justify-center"
          >
            <Printer className="h-4 w-4 mr-2" />
            <span>Print Worksheet</span>
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Tips for Best Results:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Print on standard 8.5" x 11" paper</li>
          <li>• Use a pencil or pen that feels comfortable</li>
          <li>• Take your time and focus on accuracy</li>
          <li>• Practice each exercise multiple times</li>
          <li>• Upload your completed worksheet for AI feedback</li>
        </ul>
      </div>
    </div>
  );
}