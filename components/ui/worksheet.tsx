'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Download } from 'lucide-react';

interface WorksheetProps {
  title: string;
  instructions: string;
  level: number;
  exerciseType: 'horizontal-lines' | 'vertical-lines' | 'circles' | 'letters';
  className?: string;
}

export function Worksheet({ title, instructions, level, exerciseType, className = '' }: WorksheetProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a blob with the worksheet HTML
    const worksheetElement = document.getElementById('worksheet-content');
    if (worksheetElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { 
                  font-family: 'Inter', sans-serif; 
                  margin: 0; 
                  padding: 20px;
                  background: white;
                }
                .worksheet-container {
                  max-width: 8.5in;
                  margin: 0 auto;
                  background: white;
                  padding: 40px;
                  border: 2px solid #e2e8f0;
                }
                .worksheet-header {
                  text-align: center;
                  border-bottom: 2px dashed #cbd5e1;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                }
                .worksheet-title {
                  font-family: 'Balsamiq Sans', cursive;
                  font-size: 2rem;
                  color: #059669;
                  margin-bottom: 10px;
                }
                .worksheet-instructions {
                  color: #4b5563;
                  font-size: 1.1rem;
                  max-width: 600px;
                  margin: 0 auto;
                }
                .practice-area {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 40px;
                }
                .practice-row {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 30px;
                  width: 100%;
                }
                .start-dot {
                  fill: #22c55e;
                }
                .end-dot {
                  fill: #ef4444;
                }
                .practice-line {
                  stroke: #d1d5db;
                  stroke-width: 3;
                  stroke-dasharray: 5,5;
                }
                @media print {
                  body { -webkit-print-color-adjust: exact; color-adjust: exact; }
                  .no-print { display: none; }
                }
              </style>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Balsamiq+Sans:wght@700&display=swap" rel="stylesheet">
            </head>
            <body>
              ${worksheetElement.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const renderHorizontalLines = () => {
    const lineLengths = [
      [150, 200, 170],
      [180, 140, 210],
      [250, 190],
      [160, 220, 180]
    ];

    return (
      <div className="practice-area">
        {lineLengths.map((row, rowIndex) => (
          <div key={rowIndex} className="practice-row">
            {row.map((length, lineIndex) => (
              <svg
                key={lineIndex}
                width={length + 20}
                height="20"
                className="overflow-visible"
              >
                <defs>
                  <marker
                    id={`arrow-${rowIndex}-${lineIndex}`}
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                  </marker>
                </defs>
                <line
                  x1="10"
                  y1="10"
                  x2={length}
                  y2="10"
                  className="practice-line"
                  markerMid={`url(#arrow-${rowIndex}-${lineIndex})`}
                />
                <circle cx="10" cy="10" r="6" className="start-dot" />
                <circle cx={length} cy="10" r="6" className="end-dot" />
              </svg>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderVerticalLines = () => {
    const lineHeights = [
      [120, 150, 130],
      [140, 110, 160],
      [180, 140],
      [120, 170, 150]
    ];

    return (
      <div className="practice-area">
        {lineHeights.map((row, rowIndex) => (
          <div key={rowIndex} className="practice-row flex-row justify-center gap-12">
            {row.map((height, lineIndex) => (
              <svg
                key={lineIndex}
                width="20"
                height={height + 20}
                className="overflow-visible"
              >
                <defs>
                  <marker
                    id={`arrow-v-${rowIndex}-${lineIndex}`}
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                  </marker>
                </defs>
                <line
                  x1="10"
                  y1="10"
                  x2="10"
                  y2={height}
                  className="practice-line"
                  markerMid={`url(#arrow-v-${rowIndex}-${lineIndex})`}
                />
                <circle cx="10" cy="10" r="6" className="start-dot" />
                <circle cx="10" cy={height} r="6" className="end-dot" />
              </svg>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderCircles = () => {
    const circleRows = [
      [40, 50, 45],
      [55, 35, 60],
      [70, 50],
      [40, 65, 55]
    ];

    return (
      <div className="practice-area">
        {circleRows.map((row, rowIndex) => (
          <div key={rowIndex} className="practice-row flex-row justify-center gap-16">
            {row.map((radius, circleIndex) => (
              <svg
                key={circleIndex}
                width={radius * 2 + 20}
                height={radius * 2 + 20}
                className="overflow-visible"
              >
                <circle
                  cx={radius + 10}
                  cy={radius + 10}
                  r={radius}
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
                <circle cx={radius + 10} cy="10" r="6" className="start-dot" />
                <text
                  x={radius + 10}
                  y={radius + 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                  fontSize="12"
                >
                  Trace
                </text>
              </svg>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderLetters = () => {
    const letters = ['a', 'b', 'c', 'd', 'e'];
    
    return (
      <div className="practice-area">
        <div className="grid grid-cols-5 gap-8 w-full max-w-4xl">
          {letters.map((letter, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <div className="text-4xl font-bold text-gray-400 border-2 border-dashed border-gray-300 w-16 h-16 flex items-center justify-center rounded-lg">
                {letter}
              </div>
              {[...Array(3)].map((_, practiceIndex) => (
                <div
                  key={practiceIndex}
                  className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExerciseContent = () => {
    switch (exerciseType) {
      case 'horizontal-lines':
        return renderHorizontalLines();
      case 'vertical-lines':
        return renderVerticalLines();
      case 'circles':
        return renderCircles();
      case 'letters':
        return renderLetters();
      default:
        return renderHorizontalLines();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Control Panel */}
      <Card className="mb-6 no-print">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Worksheet Controls</span>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Worksheet Content */}
      <div
        id="worksheet-content"
        className="worksheet-container bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-10 max-w-4xl mx-auto"
      >
        {/* Header */}
        <header className="worksheet-header text-center border-b-2 border-dashed border-gray-300 pb-6 mb-8">
          <h1 className="worksheet-title text-3xl sm:text-4xl text-green-600 font-bold mb-4">
            {title}
          </h1>
          <p className="worksheet-instructions text-gray-600 text-lg max-w-2xl mx-auto">
            <strong>Instructions:</strong> {instructions}
          </p>
          <div className="mt-4 flex justify-center items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Start here
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              End here
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Level {level}
            </span>
          </div>
        </header>

        {/* Practice Area */}
        <main className="space-y-12">
          {renderExerciseContent()}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Great job practicing! Remember to take your time and focus on proper form.</p>
        </footer>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .worksheet-container {
            box-shadow: none;
            margin: 0;
            max-width: 100%;
            border: 1px solid #e2e8f0;
            page-break-inside: avoid;
          }
          .practice-row {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}