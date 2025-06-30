//app/practice/lowercase/LowercasePracticeClient.tsx


'use client';

import { lowercaseWorkbookSteps } from './worksheetData';
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


interface LowercasePracticeClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

export default function LowercasePracticeClient({ user, profile, initialSubmissions }: LowercasePracticeClientProps) {
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
    worksheetSteps: lowercaseWorkbookSteps,
  });

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = lowercaseWorkbookSteps[currentStep];
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
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500' : 'text-gray-900'}`}>
            Lowercase Letter Practice
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-blue-700' : 'text-gray-600'}`}>
            Let's master writing all the lowercase letters, from 'a' to 'z'!
          </p>
        </div>

        {isKidsMode && (
          <ProgressTracker
            completedCount={completedWorksheets.size}
            totalCount={lowercaseWorkbookSteps.length}
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
              isNextDisabled={currentStep === lowercaseWorkbookSteps.length - 1}
              currentStep={currentStep}
              totalSteps={lowercaseWorkbookSteps.length}
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
              steps={lowercaseWorkbookSteps}
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