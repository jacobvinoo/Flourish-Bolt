'use client';

import { useParams } from 'next/navigation';
import { Worksheet } from '@/components/ui/worksheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DiagonalLinesWorksheetPage() {
  const worksheetConfig = {
    title: 'Worksheet 1.4: Diagonal Lines',
    instructions: 'Start at the green dot and trace the diagonal line to the red dot. Practice both directions!',
    level: 1,
    exerciseType: 'diagonal-lines' as const
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 no-print">
          <Link href="/learning-paths">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning Paths
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
          title={worksheetConfig.title}
          instructions={worksheetConfig.instructions}
          level={worksheetConfig.level}
          exerciseType={worksheetConfig.exerciseType}
        />
      </div>
    </div>
  );
}