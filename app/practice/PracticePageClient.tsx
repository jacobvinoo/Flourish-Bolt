//app/practice/PracticePageClient.tsx

'use client';

import { User } from '@supabase/supabase-js';
import { usePracticeLogic, Profile, Submission, WorksheetStep } from '@/hooks/usePracticeLogic';

// Import Reusable Components
import PageLayout from '@/components/PageLayout';
import { FileUpload } from '@/components/practice/FileUpload';
import { GradingResultCard } from '@/components/practice/GradingResultCard';
import { WorksheetDisplay } from '@/components/practice/WorksheetDisplay';
import { StepNavigation } from '@/components/practice/StepNavigation';
import { SubmissionHistory } from '@/components/practice/SubmissionHistory'; // <-- Import the shared component
import { ProgressTracker } from '@/components/practice/ProgressTracker';
import { UploadSuccessMessage } from '@/components/practice/UploadSuccessMessage';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PracticePageClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

// Define the worksheet steps specific to this page
const firstWorkbookSteps: WorksheetStep[] = [
    { id: 'vertical-lines', title: 'Worksheet 1.1: Vertical Lines', description: 'Start with basic vertical lines from top to bottom. Master downward stroke control.', level: 1, worksheetUrl: '/worksheets/vertical-lines.html', skills: ['Drawing straight', 'Top to bottom', 'Holding pencil'], estimatedTime: '10-15 minutes', icon: 'AlignLeft', color: 'from-blue-400 to-blue-600', emoji: '📏' },
    { id: 'horizontal-lines', title: 'Worksheet 1.2: Horizontal Lines', description: 'Practice horizontal lines from left to right. Build reading and writing flow.', level: 1, worksheetUrl: '/worksheets/horizontal-lines.html', skills: ['Left to right', 'Reading direction', 'Smooth lines'], estimatedTime: '10-15 minutes', icon: 'ArrowRight', color: 'from-green-400 to-green-600', emoji: '➡️' },
    { id: 'circles', title: 'Worksheet 1.3: Circles', description: 'Learn circular motions essential for letters like o, a, and d.', level: 1, worksheetUrl: '/worksheets/circles.html', skills: ['Circular motions', 'Smooth curves', 'Hand control'], estimatedTime: '15-20 minutes', icon: 'Circle', color: 'from-yellow-400 to-orange-500', emoji: '⭕' },
    { id: 'diagonal-lines', title: 'Worksheet 1.4: Diagonal Lines', description: 'Master diagonal strokes for letters like A, V, X, and k.', level: 1, worksheetUrl: '/worksheets/diagonal-lines.html', skills: ['Diagonal drawing', 'Angles', 'Letter shapes'], estimatedTime: '15-20 minutes', icon: 'TrendingUp', color: 'from-purple-400 to-purple-600', emoji: '📐' },
    { id: 'intersecting-lines', title: 'Worksheet 1.5: Intersecting Lines', description: 'Practice crosses and plus signs with precision.', level: 1, worksheetUrl: '/worksheets/intersecting-lines.html', skills: ['Crossing lines', 'Precision', 'Plus signs'], estimatedTime: '15-20 minutes', icon: 'Plus', color: 'from-red-400 to-pink-500', emoji: '✖️' },
    { id: 'basic-shapes', title: 'Worksheet 1.6: Basic Shapes', description: 'Combine strokes to create squares, triangles, and rectangles.', level: 1, worksheetUrl: '/worksheets/basic-shapes.html', skills: ['Shape drawing', 'Combining lines', 'Geometric fun'], estimatedTime: '20-25 minutes', icon: 'Square', color: 'from-indigo-400 to-blue-500', emoji: '🔺' },
    { id: 'continuous-curves', title: 'Worksheet 1.7: Continuous Curves', description: 'Develop fluidity with wavy lines and loops for cursive preparation.', level: 1, worksheetUrl: '/worksheets/continuous-curves.html', skills: ['Fluid motion', 'Rhythm', 'Hand control'], estimatedTime: '20-25 minutes', icon: 'Waves', color: 'from-teal-400 to-cyan-500', emoji: '🌊' }
];

export default function PracticePageClient({ user, profile, initialSubmissions }: PracticePageClientProps) {
  // Use the single, reusable hook for all logic.
  const {
    currentStep,
    selectedFile,
    uploading,
    uploadSuccess,
    analysisResult,
    showGrading,
    localProfile,
    submissions,
    completedWorksheets,
    deletingId,
    setCurrentStep,
    handleFileSelect,
    handleFileRemove,
    handleUpload,
    handleGradingComplete,
    handleDeleteSubmission, // <-- Get the delete handler from the hook
    goToPreviousStep,
    goToNextStep,
  } = usePracticeLogic({
    user,
    profile,
    initialSubmissions,
    worksheetSteps: firstWorkbookSteps,
  });

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = firstWorkbookSteps[currentStep];
  const currentSubmissions = submissions.filter(s => s.worksheet_id === currentWorksheet.id);

  return (
    <PageLayout
      isKidsMode={isKidsMode}
      headerVariant="authenticated"
      headerProps={{
        showUserControls: true,
        profile: localProfile,
        currentStreak: localProfile?.current_streak ?? 0,
        xp: localProfile?.xp ?? 0,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 text-center">
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-900'}`}>
            {isKidsMode ? '🎨 Handwriting Adventure!' : 'First Workbook Practice'}
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-purple-700' : 'text-gray-600'}`}>
            {isKidsMode ? 'Let\'s practice writing and have tons of fun! 🚀✨' : 'Master the fundamentals with our structured practice program'}
          </p>
        </div>
        
        {isKidsMode && (
          <ProgressTracker
            completedCount={completedWorksheets.size}
            totalCount={firstWorkbookSteps.length}
          />
        )}

        {uploadSuccess && <UploadSuccessMessage isKidsMode={isKidsMode} />}
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <WorksheetDisplay
              currentWorksheet={currentWorksheet}
              isKidsMode={isKidsMode}
              onOpen={() => window.open(currentWorksheet.worksheetUrl, '_blank', 'noopener,noreferrer')}
              onPrint={() => window.print()}
              onPrev={goToPreviousStep}
              onNext={goToNextStep}
              isPrevDisabled={currentStep === 0}
              isNextDisabled={currentStep === firstWorkbookSteps.length - 1}
              currentStep={currentStep}
              totalSteps={firstWorkbookSteps.length}
            />

            {showGrading && analysisResult && (
              <GradingResultCard
                analysisResult={analysisResult}
                onComplete={handleGradingComplete}
              />
            )}
            
            {!showGrading && (
              <div className="p-6 border rounded-2xl bg-white">
                <h3 className="text-xl font-bold mb-4">Upload Your Completed Worksheet</h3>
                <FileUpload
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    selectedFile={selectedFile}
                    uploading={uploading}
                    disabled={uploadSuccess}
                    isKidsMode={isKidsMode}
                />
                {selectedFile && !uploading && (
                  <Button onClick={handleUpload} size="lg" disabled={uploading} className="w-full mt-4 bg-green-600 hover:bg-green-700 flex items-center justify-center">
                    {uploading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <span>Grade My Worksheet!</span>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <StepNavigation
                title="Quick Navigation"
                steps={firstWorkbookSteps}
                currentStepIndex={currentStep}
                completedSteps={completedWorksheets}
                onStepSelect={setCurrentStep}
                isKidsMode={isKidsMode}
            />
          </div>
        </div>

        {/* --- CHANGE: Use the shared SubmissionHistory component --- */}
        <SubmissionHistory
          submissions={currentSubmissions}
          onDelete={handleDeleteSubmission}
          deletingId={deletingId}
        />
      </div>
    </PageLayout>
  );
}