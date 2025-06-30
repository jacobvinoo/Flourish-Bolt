import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Download, Eye } from 'lucide-react';

interface WorksheetProps {
  title: string;
  instructions: string;
  level: number;
  exerciseType: 'vertical-lines' | 'horizontal-lines' | 'circles' | 'letters' | 'diagonal-lines' | 'intersecting-lines' | 'basic-shapes' | 'continuous-curves';
}

export function Worksheet({ title, instructions, level, exerciseType }: WorksheetProps) {
  const worksheetUrl = `/worksheets/${exerciseType}.html`;

  const handlePrint = () => {
    window.print();
  };

  const handleViewWorksheet = () => {
    window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-lg">{instructions}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              onClick={handleViewWorksheet}
              className="flex-1 h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
            >
              <Eye className="h-5 w-5 mr-2" />
              <span>View Worksheet</span>
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="flex-1 h-12 text-lg font-medium flex items-center justify-center"
            >
              <Printer className="h-5 w-5 mr-2" />
              <span>Print Worksheet</span>
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">📝 Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-amber-700">
              <li>Print the worksheet or view it online</li>
              <li>Practice tracing the patterns with a pencil</li>
              <li>Take your time and focus on accuracy</li>
              <li>When finished, take a photo of your work</li>
              <li>Upload your photo for AI analysis and feedback</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Success:</h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Use a pencil for best results</li>
              <li>Sit at a desk or table with good lighting</li>
              <li>Hold your pencil with a relaxed grip</li>
              <li>Take breaks if your hand gets tired</li>
              <li>Practice a little each day for best improvement</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="no-print text-center">
        <p className="text-sm text-gray-500">
          After completing your practice, return to the dashboard to upload your work and get AI feedback.
        </p>
      </div>
    </div>
  );
}