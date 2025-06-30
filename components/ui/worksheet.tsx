import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface WorksheetProps {
  title: string;
  instructions: string;
  level: number;
  exerciseType: 'vertical-lines' | 'horizontal-lines' | 'circles' | 'letters' | 'diagonal-lines' | 'intersecting-lines' | 'continuous-curves' | 'basic-shapes';
}

export function Worksheet({ title, instructions, level, exerciseType }: WorksheetProps) {
  const handlePrint = () => {
    window.print();
  };

  const getWorksheetUrl = () => {
    return `/worksheets/${exerciseType}.html`;
  };

  const openWorksheet = () => {
    window.open(getWorksheetUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{instructions}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openWorksheet} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Open Worksheet</span>
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {level}
          </div>
          <span className="font-medium">Difficulty Level: {level}</span>
        </div>
        <p className="text-gray-700">
          This worksheet focuses on {exerciseType.replace('-', ' ')}. Follow the instructions and practice carefully.
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="aspect-[1.414/1] bg-gray-100 rounded-lg flex items-center justify-center">
          <iframe 
            src={getWorksheetUrl()} 
            className="w-full h-full rounded-lg border"
            title={`${title} Preview`}
          />
        </div>
      </div>
    </div>
  );
}