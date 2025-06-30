import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface WorksheetProps {
  title: string;
  instructions: string;
  level: number;
  exerciseType: 'vertical-lines' | 'horizontal-lines' | 'circles' | 'letters' | 'diagonal-lines' | 'intersecting-lines' | 'basic-shapes' | 'continuous-curves';
}

export function Worksheet({ title, instructions, level, exerciseType }: WorksheetProps) {
  const handlePrint = () => {
    window.print();
  };

  const getWorksheetContent = () => {
    switch (exerciseType) {
      case 'vertical-lines':
        return (
          <div className="space-y-8">
            <div className="flex justify-around items-center h-24">
              {Array(6).fill(0).map((_, i) => (
                <svg key={i} width="20" height="70" className="overflow-visible">
                  <line x1="10" y1="10" x2="10" y2="60" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"></line>
                  <circle cx="10" cy="10" r="6" fill="#22c55e"></circle>
                  <circle cx="10" cy="60" r="6" fill="#ef4444"></circle>
                </svg>
              ))}
            </div>
            <div className="flex justify-around items-center h-40">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} width="20" height="130" className="overflow-visible">
                  <line x1="10" y1="10" x2="10" y2="120" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"></line>
                  <circle cx="10" cy="10" r="6" fill="#22c55e"></circle>
                  <circle cx="10" cy="120" r="6" fill="#ef4444"></circle>
                </svg>
              ))}
            </div>
          </div>
        );
      case 'horizontal-lines':
        return (
          <div className="space-y-8">
            <div className="flex justify-around items-center">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} width="100" height="30" className="overflow-visible">
                  <line x1="10" y1="15" x2="90" y2="15" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"></line>
                  <circle cx="10" cy="15" r="6" fill="#22c55e"></circle>
                  <circle cx="90" cy="15" r="6" fill="#ef4444"></circle>
                </svg>
              ))}
            </div>
            <div className="flex justify-around items-center">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} width="120" height="30" className="overflow-visible">
                  <line x1="10" y1="15" x2="110" y2="15" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"></line>
                  <circle cx="10" cy="15" r="6" fill="#22c55e"></circle>
                  <circle cx="110" cy="15" r="6" fill="#ef4444"></circle>
                </svg>
              ))}
            </div>
          </div>
        );
      case 'circles':
        return (
          <div className="space-y-10">
            <div className="flex justify-around items-center">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="relative border-3 border-dashed border-gray-300 rounded-full w-32 h-32 flex justify-center items-center">
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ top: '15%', right: '15%' }}></div>
                  <svg className="absolute w-1/2 h-1/2 fill-none stroke-gray-400 stroke-2" style={{ transform: 'rotate(45deg)' }}>
                    <path d="M21 12a9 9 0 1 1-6.2-8.7"></path>
                  </svg>
                </div>
              ))}
            </div>
            <div className="flex justify-around items-center">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="relative border-3 border-dashed border-gray-300 rounded-full w-24 h-24 flex justify-center items-center">
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ top: '15%', right: '15%' }}></div>
                  <svg className="absolute w-1/2 h-1/2 fill-none stroke-gray-400 stroke-2" style={{ transform: 'rotate(45deg)' }}>
                    <path d="M21 12a9 9 0 1 1-6.2-8.7"></path>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        );
      case 'diagonal-lines':
        return (
          <div className="space-y-8">
            <div className="flex justify-around items-center">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} width="100" height="100" className="overflow-visible">
                  <line x1="10" y1="10" x2="90" y2="90" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"></line>
                  <circle cx="10" cy="10" r="6" fill="#22c55e"></circle>
                  <circle cx="90" cy="90" r="6" fill="#ef4444"></circle>
                </svg>
              ))}
            </div>
            <div className="flex justify-around items-center">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} width="100" height="100" className="overflow-visible">
                  <line x1="90" y1="10" x2="10" y2="90" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"></line>
                  <circle cx="90" cy="10" r="6" fill="#22c55e"></circle>
                  <circle cx="10" cy="90" r="6" fill="#ef4444"></circle>
                </svg>
              ))}
            </div>
          </div>
        );
      case 'intersecting-lines':
        return (
          <div className="space-y-8">
            <div className="flex justify-around items-center">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="relative w-24 h-24 border border-dashed border-gray-300 rounded-lg">
                  <svg width="100%" height="100%" className="absolute">
                    <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"/>
                    <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"/>
                  </svg>
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ top: '5%', left: '30%' }}>1</div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ top: '50%', left: '5%', transform: 'translateY(-50%)' }}>2</div>
                </div>
              ))}
            </div>
            <div className="flex justify-around items-center">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="relative w-24 h-24 border border-dashed border-gray-300 rounded-lg">
                  <svg width="100%" height="100%" className="absolute">
                    <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"/>
                    <line x1="80%" y1="20%" x2="20%" y2="80%" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5"/>
                  </svg>
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ top: '20%', left: '20%' }}></div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ top: '10%', left: '10%' }}>1</div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ top: '10%', right: '10%' }}>2</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'basic-shapes':
        return (
          <div className="space-y-8">
            <div className="flex justify-around items-center flex-wrap">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="relative w-24 h-24 border border-dashed border-gray-300 rounded-lg m-2">
                  <svg width="100%" height="100%" className="absolute">
                    <rect x="20%" y="20%" width="60%" height="60%" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5" fill="none"/>
                  </svg>
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ top: '15%', left: '15%' }}></div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ top: '10%', left: '30%' }}>1</div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ top: '10%', right: '10%' }}>2</div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ bottom: '5%', right: '10%' }}>3</div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ bottom: '5%', left: '10%' }}>4</div>
                </div>
              ))}
            </div>
            <div className="flex justify-around items-center flex-wrap">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="relative w-24 h-24 border border-dashed border-gray-300 rounded-lg m-2">
                  <svg width="100%" height="100%" className="absolute">
                    <polygon points="50%,20% 20%,80% 80%,80%" stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5" fill="none"/>
                  </svg>
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)' }}></div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ top: '5%', left: '45%' }}>1</div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ bottom: '5%', left: '5%' }}>2</div>
                  <div className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold" style={{ bottom: '5%', right: '10%' }}>3</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'continuous-curves':
        return (
          <div className="space-y-8">
            <div className="flex justify-center">
              <svg width="600" height="120" className="overflow-visible">
                <path d="M 20 60 Q 80 20 140 60 Q 200 100 260 60 Q 320 20 380 60 Q 440 100 500 60 Q 560 20 580 60" 
                      stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5" fill="none"/>
                <circle cx="20" cy="60" r="6" fill="#22c55e"/>
                <circle cx="580" cy="60" r="6" fill="#ef4444"/>
                <circle cx="140" cy="60" r="4" fill="#fbbf24" opacity="0.7"/>
                <circle cx="260" cy="60" r="4" fill="#fbbf24" opacity="0.7"/>
                <circle cx="380" cy="60" r="4" fill="#fbbf24" opacity="0.7"/>
                <circle cx="500" cy="60" r="4" fill="#fbbf24" opacity="0.7"/>
              </svg>
            </div>
            <div className="flex justify-around items-center">
              {Array(4).fill(0).map((_, i) => (
                <svg key={i} width="100" height="60" className="overflow-visible">
                  <path d="M 10 30 Q 30 10 50 30 Q 70 50 90 30" 
                        stroke="#d1d5db" strokeWidth="3" strokeDasharray="5,5" fill="none"/>
                  <circle cx="10" cy="30" r="5" fill="#22c55e"/>
                  <circle cx="90" cy="30" r="5" fill="#ef4444"/>
                </svg>
              ))}
            </div>
          </div>
        );
      default:
        return <div>No content available for this exercise type.</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 no-print">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">{instructions}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-8 mb-8">
        {getWorksheetContent()}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg no-print">
        <h3 className="font-semibold text-blue-800 mb-2">Practice Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
          <li>Print this worksheet and practice with a pencil or pen</li>
          <li>Follow the green dots to start and red dots to end</li>
          <li>Take your time and focus on accuracy rather than speed</li>
          <li>When finished, take a photo of your work and upload it for feedback</li>
        </ul>
      </div>
    </div>
  );
}