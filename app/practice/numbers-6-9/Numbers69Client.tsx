//app/practice/numbers-6-9/Numbers69Client.tsx


'use client';

import { User } from '@supabase/supabase-js';
import { usePracticeLogic, Profile, Submission, WorksheetStep } from '@/hooks/usePracticeLogic';

// Import Reusable Components
import PageLayout from '@/components/PageLayout';
import { FileUpload } from '@/components/practice/FileUpload';
import { GradingResultCard } from '@/components/practice/GradingResultCard';
import { WorksheetDisplay } from '@/components/practice/WorksheetDisplay';
import { StepNavigation } from '@/components/practice/StepNavigation';
import { SubmissionHistory } from '@/components/practice/SubmissionHistory';
import { ProgressTracker } from '@/components/practice/ProgressTracker';
import { UploadSuccessMessage } from '@/components/practice/UploadSuccessMessage';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Define the worksheet steps specific to this page
const numbers69WorkbookSteps: WorksheetStep[] = [
  {
    id: 'numbers-6',
    title: 'Worksheet 4.7: Number 6',
    description: 'Practice the curve and loop of the number 6.',
    level: 3,
    worksheetUrl: '/worksheets/numbers-6-9.html',
    skills: ['Curved strokes', 'Loop formation', 'Number formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: '6'
  },
  {
    id: 'numbers-7',
    title: 'Worksheet 4.8: Number 7',
    description: 'Master the horizontal and diagonal lines of the number 7.',
    level: 3,
    worksheetUrl: '/worksheets/numbers-6-9.html',
    skills: ['Horizontal lines', 'Diagonal lines', 'Number formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: '7'
  },
  {
    id: 'numbers-8',
    title: 'Worksheet 4.9: Number 8',
    description: 'Practice the double loop of the number 8.',
    level: 3,
    worksheetUrl: '/worksheets/numbers-6-9.html',
    skills: ['Double loops', 'Continuous motion', 'Number formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: '8'
  },
  {
    id: 'numbers-9',
    title: 'Worksheet 4.10: Number 9',
    description: 'Master the loop and line of the number 9.',
    level: 3,
    worksheetUrl: '/worksheets/numbers-6-9.html',
    skills: ['Loop formation', 'Vertical lines', 'Number formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: '9'
  }
];


interface Numbers69ClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

export default function Numbers69Client({ user, profile, initialSubmissions }: Numbers69ClientProps) {
  // Use the single, reusable hook for all logic.
  // The key difference is passing in `numbers69WorkbookSteps`.
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
    handleDeleteSubmission,
    goToPreviousStep,
    goToNextStep,
  } = usePracticeLogic({
    user,
    profile,
    initialSubmissions,
    worksheetSteps: numbers69WorkbookSteps,
  });

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = numbers69WorkbookSteps[currentStep];
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
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500' : 'text-gray-900'}`}>
            Numbers 6-9 Practice
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-teal-700' : 'text-gray-600'}`}>
            Let's learn to write the more complex numbers from 6 to 9!
          </p>
        </div>

        {isKidsMode && (
          <ProgressTracker
            completedCount={completedWorksheets.size}
            totalCount={numbers69WorkbookSteps.length}
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
              isNextDisabled={currentStep === numbers69WorkbookSteps.length - 1}
              currentStep={currentStep}
              totalSteps={numbers69WorkbookSteps.length}
            />

            {showGrading && analysisResult && (
              <GradingResultCard
                analysisResult={analysisResult}
                onComplete={handleGradingComplete}
              />
            )}

            {!showGrading && (
              <div className="p-6 border rounded-2xl bg-white">
                <h3 className="text-xl font-bold mb-4">Upload Your Completed Number</h3>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={selectedFile}
                  uploading={uploading}
                  disabled={uploadSuccess}
                  isKidsMode={isKidsMode}
                />
                {selectedFile && !uploading && (
                  <Button
                    onClick={handleUpload}
                    size="lg"
                    disabled={uploading}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 flex items-center justify-center"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <span>Grade My Number!</span>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <StepNavigation
              title="Number Navigation"
              steps={numbers69WorkbookSteps}
              currentStepIndex={currentStep}
              completedSteps={completedWorksheets}
              onStepSelect={setCurrentStep}
              isKidsMode={isKidsMode}
            />
          </div>
        </div>

        <SubmissionHistory
          submissions={currentSubmissions}
          onDelete={handleDeleteSubmission}
          deletingId={deletingId}
        />
      </div>
    </PageLayout>
  );
}
