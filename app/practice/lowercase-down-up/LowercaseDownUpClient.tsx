//app/practice/lowercase-down-up/LowercaseDownUpClient.tsx
use client';

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
const downUpWorkbookSteps: WorksheetStep[] = [
  {
    id: 'letter-h',
    title: 'Worksheet 3.1: Letter h',
    friendlyTitle: 'The letter h!',
    description: 'Practice the tall line and small bump of the letter "h".',
    kidsDescription: "Let's draw a tall line and a small hill to make an \"h\"!",
    level: 3,
    worksheetUrl: '/worksheets/lowercase-down-up.html',
    skills: ['Tall strokes', 'Curved connections', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-indigo-400 to-indigo-600',
    emoji: 'h'
  },
  {
    id: 'letter-m',
    title: 'Worksheet 3.2: Letter m',
    friendlyTitle: 'The letter m!',
    description: 'Master the line with two bumps of the letter "m".',
    kidsDescription: 'Draw a line with two little mountains to make an "m"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-down-up.html',
    skills: ['Multiple curves', 'Consistent height', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'm'
  },
  {
    id: 'letter-n',
    title: 'Worksheet 3.3: Letter n',
    friendlyTitle: 'The letter n!',
    description: 'Practice the line with one bump of the letter "n".',
    kidsDescription: 'Draw a line with one little mountain to make an "n"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-down-up.html',
    skills: ['Curved connections', 'Consistent height', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-cyan-400 to-cyan-600',
    emoji: 'n'
  },
  {
    id: 'letter-r',
    title: 'Worksheet 3.4: Letter r',
    friendlyTitle: 'The letter r!',
    description: 'Master the line with a small curve at the top of the letter "r".',
    kidsDescription: 'Draw a line with a little rainbow at the top to make an "r"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-down-up.html',
    skills: ['Short curves', 'Vertical strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-green-400 to-green-600',
    emoji: 'r'
  },
  {
    id: 'letter-b',
    title: 'Worksheet 3.5: Letter b',
    friendlyTitle: 'The letter b!',
    description: 'Practice the tall line and round belly of the letter "b".',
    kidsDescription: 'Draw a tall line and a round tummy to make a "b"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-down-up.html',
    skills: ['Tall strokes', 'Curved connections', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: 'b'
  },
  {
    id: 'letter-p',
    title: 'Worksheet 3.6: Letter p',
    friendlyTitle: 'The letter p!',
    description: 'Master the line that goes below the line with a round belly of the letter "p".',
    kidsDescription: 'Draw a line that goes down below the line with a round tummy to make a "p"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-down-up.html',
    skills: ['Below-line strokes', 'Circular shapes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-purple-400 to-purple-600',
    emoji: 'p'
  }
];

interface LowercaseDownUpClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

export default function LowercaseDownUpClient({ user, profile, initialSubmissions }: LowercaseDownUpClientProps) {
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
    handleDeleteSubmission,
    goToPreviousStep,
    goToNextStep,
  } = usePracticeLogic({
    user,
    profile,
    initialSubmissions,
    worksheetSteps: downUpWorkbookSteps,
  });

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = downUpWorkbookSteps[currentStep];
  const currentSubmissions = submissions.filter(s => s.worksheet_id === currentWorksheet.id);

  return (
    <PageLayout
      isKidsMode={isKidsMode}
      headerVariant="authenticated"
      headerProps={{
        showUserControls: true,
        profile: localProfile,
        currentStreak: localProfile?.current_streak ?? 0,
        xp: localProfile?.xp ?? 0
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500' : 'text-gray-900'}`}>
            Down & Up Letters Practice
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-indigo-700' : 'text-gray-600'}`}>
            Let's master the "down and up" letters: h, m, n, r, b, and p!
          </p>
        </div>

        {isKidsMode && (
          <ProgressTracker
            completedCount={completedWorksheets.size}
            totalCount={downUpWorkbookSteps.length}
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
              isNextDisabled={currentStep === downUpWorkbookSteps.length - 1}
              currentStep={currentStep}
              totalSteps={downUpWorkbookSteps.length}
            />

            {showGrading && analysisResult && (
              <GradingResultCard
                analysisResult={analysisResult}
                onComplete={handleGradingComplete}
              />
            )}

            {!showGrading && (
              <div className="p-6 border-0 shadow-xl rounded-2xl bg-white/50">
                <h3 className="text-xl font-bold mb-4">Upload Your Completed Letter</h3>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={selectedFile}
                  uploading={uploading}
                  disabled={uploadSuccess}
                  isKidsMode={isKidsMode}
                />
                {selectedFile && !uploading && !showGrading && (
                  <Button 
                    onClick={handleUpload} 
                    size="lg" 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <span>Grade My Letter!</span>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <StepNavigation
              title="Letter Navigation"
              steps={downUpWorkbookSteps}
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