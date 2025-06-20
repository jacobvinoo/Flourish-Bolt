'use client';

import { useParams } from 'next/navigation';
import { Worksheet } from '@/components/ui/worksheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const worksheetConfigs = {
  'horizontal-lines': {
    title: 'Worksheet 1.2: Horizontal Lines',
    instructions: 'Start at the green dot and trace the line across to the red dot. Keep your pencil on the path!',
    level: 1,
    exerciseType: 'horizontal-lines' as const
  },
  'vertical-lines': {
    title: 'Worksheet 1.3: Vertical Lines',
    instructions: 'Start at the green dot and trace the line down to the red dot. Keep your lines straight!',
    level: 1,
    exerciseType: 'vertical-lines' as const
  },
  'circles': {
    title: 'Worksheet 2.1: Circle Practice',
    instructions: 'Start at the green dot and trace around the circle. Try to make smooth, round shapes!',
    level: 2,
    exerciseType: 'circles' as const
  },
  'letters': {
    title: 'Worksheet 3.1: Letter Formation',
    instructions: 'Look at the example letter and practice writing it in the boxes below. Focus on proper formation!',
    level: 3,
    exerciseType: 'letters' as const
  }
};

export default function WorksheetPage() {
  const params = useParams();
  const worksheetType = params.type as string;
  
  const config = worksheetConfigs[worksheetType as keyof typeof worksheetConfigs];
  
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Worksheet Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested worksheet type does not exist.</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 no-print">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Interactive Worksheet</h1>
            <p className="text-muted-foreground mt-1">
              Practice your handwriting with this printable worksheet
            </p>
          </div>
        </div>

        {/* Worksheet Component */}
        <Worksheet
          title={config.title}
          instructions={config.instructions}
          level={config.level}
          exerciseType={config.exerciseType}
        />
      </div>
    </div>
  );
}