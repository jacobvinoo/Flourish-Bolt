
// app/practice/lowercase-magic-c/LowercaseMagicCClient.tsx


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
const magicCWorkbookSteps: WorksheetStep[] = [
  {
    id: 'letter-c',
    title: 'Worksheet 3.1: Letter c',
    friendlyTitle: 'The Magic C!',
    description: 'Practice the basic Magic C shape that forms the foundation for many letters.',
    kidsDescription: "Let's draw the Magic C shape - it's the start of many letters!",
    level: 3,
    worksheetUrl: '/worksheets/lowercase-magic-c.html',
    skills: ['Open curves', 'Counter-clockwise motion', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'c'
  },
  {
    id: 'letter-a',
    title: 'Worksheet 3.2: Letter a',
    friendlyTitle: 'The letter a!',
    description: 'Practice the Magic C plus a straight line down to form the letter "a".',
    kidsDescription: 'Draw a Magic C and add a straight line to make an "a"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-magic-c.html',
    skills: ['Magic C formation', 'Vertical lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'a'
  },
  {
    id: 'letter-d',
    title: 'Worksheet 3.3: Letter d',
    friendlyTitle: 'The letter d!',
    description: 'Master the Magic C plus a tall line to form the letter "d".',
    kidsDescription: 'Draw a Magic C and add a tall line to make a "d"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-magic-c.html',
    skills: ['Magic C formation', 'Tall strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'd'
  },
  {
    id: 'letter-g',
    title: 'Worksheet 3.4: Letter g',
    friendlyTitle: 'The letter g!',
    description: 'Practice the Magic C plus a tail that goes below the line for the letter "g".',
    kidsDescription: 'Draw a Magic C and add a monkey tail that goes below the line to make a "g"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-magic-c.html',
    skills: ['Magic C formation', 'Below-line strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'g'
  },
  {
    id: 'letter-o',
    title: 'Worksheet 3.5: Letter o',
    friendlyTitle: 'The letter o!',
    description: 'Master the Magic C that closes into a circle to form the letter "o".',
    kidsDescription: 'Draw a Magic C and close it all the way around to make an "o"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-magic-c.html',
    skills: ['Magic C formation', 'Closing shapes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'o'
  },
  {
    id: 'letter-q',
    title: 'Worksheet 3.6: Letter q',
    friendlyTitle: 'The letter q!',
    description: 'Practice the Magic C plus a straight line that goes below the line for the letter "q".',
    kidsDescription: 'Draw a Magic C and add a straight line that goes down below the line to make a "q"!',
    level: 3,
    worksheetUrl: '/worksheets/lowercase-magic-c.html',
    skills: ['Magic C formation', 'Below-line strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'q'
  }
];

interface LowercaseMagicCClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

export default function LowercaseMagicCClient({ user, profile, initialSubmissions }: LowercaseMagicCClientProps) {
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
    worksheetSteps: magicCWorkbookSteps,
  });

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = magicCWorkbookSteps[currentStep];
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
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500' : 'text-gray-900'}`}>
            Magic C Letters Practice
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-violet-700' : 'text-gray-600'}`}>
            Let's master the "Magic C" letters: c, a, d, g, o, and q!
          </p>
        </div>

        {isKidsMode && (
          <ProgressTracker
            completedCount={completedWorksheets.size}
            totalCount={magicCWorkbookSteps.length}
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
              isNextDisabled={currentStep === magicCWorkbookSteps.length - 1}
              currentStep={currentStep}
              totalSteps={magicCWorkbookSteps.length}
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
              steps={magicCWorkbookSteps}
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