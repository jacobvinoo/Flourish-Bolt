import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export interface WorksheetProps {
  title: string;
  instructions: string;
  level: number;
  exerciseType: 'vertical-lines' | 'horizontal-lines' | 'circles' | 'letters' | 'diagonal-lines' | 'intersecting-lines' | 'continuous-curves' | 'basic-shapes';
}

export function Worksheet({ title, instructions, level, exerciseType }: WorksheetProps) {
  const getWorksheetSrc = (type: string) => {
    switch (type) {
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
      default:
        return '/worksheets/vertical-lines.html';
    }
  };

  const handlePrint = () => {
    const iframe = document.getElementById('worksheet-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{instructions}</p>
          </div>
          <Button onClick={handlePrint} className="no-print">
            <Printer className="h-4 w-4 mr-2" />
            Print Worksheet
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden h-[800px]">
          <iframe
            id="worksheet-iframe"
            src={getWorksheetSrc(exerciseType)}
            className="w-full h-full"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}