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
const straightLinesWorkbookSteps: WorksheetStep[] = [
  {
    id: 'letter-E',
    title: 'Worksheet 2.1.1: Letter E',
    friendlyTitle: 'The letter E!',
    description: 'Practice the vertical line and three horizontal lines of the letter "E".',
    kidsDescription: "Let's draw a straight line and three shelves to make an \"E\"!",
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'E'
  },
  {
    id: 'letter-F',
    title: 'Worksheet 2.1.2: Letter F',
    friendlyTitle: 'The letter F!',
    description: 'Master the vertical line and two horizontal lines of the letter "F".',
    kidsDescription: 'Draw a straight line and two shelves to make an "F"!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-indigo-400 to-indigo-600',
    emoji: 'F'
  },
  {
    id: 'letter-H',
    title: 'Worksheet 2.1.3: Letter H',
    friendlyTitle: 'The letter H!',
    description: 'Practice the two vertical lines and one horizontal line of the letter "H".',
    kidsDescription: 'Draw two straight lines with a bridge in the middle to make an "H"!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'H'
  },
  {
    id: 'letter-I',
    title: 'Worksheet 2.1.4: Letter I',
    friendlyTitle: 'The letter I!',
    description: 'Master the vertical line and two horizontal lines of the letter "I".',
    kidsDescription: 'Draw a straight line with a hat and shoes to make an "I"!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-purple-400 to-purple-600',
    emoji: 'I'
  },
  {
    id: 'letter-L',
    title: 'Worksheet 2.1.5: Letter L',
    friendlyTitle: 'The letter L!',
    description: 'Practice the vertical line and horizontal line of the letter "L".',
    kidsDescription: 'Draw a straight line down and a line across the bottom to make an "L"!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-fuchsia-400 to-fuchsia-600',
    emoji: 'L'
  },
  {
    id: 'letter-T',
    title: 'Worksheet 2.1.6: Letter T',
    friendlyTitle: 'The letter T!',
    description: 'Master the vertical line and horizontal line of the letter "T".',
    kidsDescription: 'Draw a straight line with a hat on top to make a "T"!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-pink-400 to-pink-600',
    emoji: 'T'
  }
];

interface UpperspaceStraightLinesClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

export default function UpperspaceStraightLinesClient({ user, profile, initialSubmissions }: UpperspaceStraightLinesClientProps) {
  // Use the shared practice logic hook
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
    worksheetSteps: straightLinesWorkbookSteps,
  });

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = straightLinesWorkbookSteps[currentStep];
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
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500' : 'text-gray-900'}`}>
            Uppercase Straight Line Letters
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-blue-700' : 'text-gray-600'}`}>
            Let's master writing uppercase letters with straight lines: E, F, H, I, L, and T!
          </p>
        </div>

        {isKidsMode && (
          <ProgressTracker
            completedCount={completedWorksheets.size}
            totalCount={straightLinesWorkbookSteps.length}
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
              isNextDisabled={currentStep === straightLinesWorkbookSteps.length - 1}
              currentStep={currentStep}
              totalSteps={straightLinesWorkbookSteps.length}
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
              steps={straightLinesWorkbookSteps}
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