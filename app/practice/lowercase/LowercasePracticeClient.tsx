//app/practice/lowercase/LowercasePracticeClient.tsx


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
const lowercaseWorkbookSteps: WorksheetStep[] = [
    { id: 'letter-a', title: 'Worksheet 2.1: Letter a', friendlyTitle: 'The letter a!', description: 'Practice the round body and short tail of the letter "a".', kidsDescription: "Let's draw a circle and give it a little tail to make an \"a\"!", level: 2, worksheetUrl: '/worksheets/letter-a.html', skills: ['Round shapes', 'Closing shapes', 'Short strokes'], estimatedTime: '10-15 minutes', color: 'from-red-400 to-red-600', emoji: 'a' },
    { id: 'letter-b', title: 'Worksheet 2.2: Letter b', friendlyTitle: 'The letter b!', description: 'Master the tall back and round belly of the letter "b".', kidsDescription: 'Draw a long line down, then give it a round tummy to make a "b"!', level: 2, worksheetUrl: '/worksheets/letter-b.html', skills: ['Tall strokes', 'Reversing curves'], estimatedTime: '10-15 minutes', color: 'from-orange-400 to-orange-600', emoji: 'b' },
    { id: 'letter-c', title: 'Worksheet 2.3: Letter c', friendlyTitle: 'The letter c!', description: 'Practice the open, curving shape of the letter "c".', kidsDescription: 'Start at the top and curve around like you\'re drawing a rainbow!', level: 2, worksheetUrl: '/worksheets/letter-c.html', skills: ['Open curves', 'Counter-clockwise motion'], estimatedTime: '10-15 minutes', color: 'from-yellow-400 to-yellow-500', emoji: 'c' },
    { id: 'letter-d', title: 'Worksheet 2.4: Letter d', friendlyTitle: 'The letter d!', description: 'Combine a round body with a tall back, similar to "a" and "b".', kidsDescription: 'It\'s like an "a" but with a super tall back! Circle first, then a long line up!', level: 2, worksheetUrl: '/worksheets/letter-d.html', skills: ['Combining shapes', 'Tall strokes'], estimatedTime: '10-15 minutes', color: 'from-green-400 to-green-600', emoji: 'd' },
    { id: 'letter-e', title: 'Worksheet 2.5: Letter e', friendlyTitle: 'The letter e!', description: 'Practice the curved shape with a line through the middle.', kidsDescription: 'Draw a circle with a line through the middle to make an "e"!', level: 2, worksheetUrl: '/worksheets/letter-e.html', skills: ['Curved lines', 'Horizontal strokes'], estimatedTime: '10-15 minutes', color: 'from-teal-400 to-teal-600', emoji: 'e' },
    { id: 'letter-f', title: 'Worksheet 2.6: Letter f', friendlyTitle: 'The letter f!', description: 'Master the tall line with a cross in the middle.', kidsDescription: 'Draw a tall line that goes up high and down low, with a little hat in the middle!', level: 2, worksheetUrl: '/worksheets/letter-f.html', skills: ['Tall strokes', 'Crossing lines'], estimatedTime: '10-15 minutes', color: 'from-cyan-400 to-cyan-600', emoji: 'f' },
    { id: 'letter-g', title: 'Worksheet 2.7: Letter g', friendlyTitle: 'The letter g!', description: 'Practice the round top and curved tail that goes below the line.', kidsDescription: 'Make a circle with a monkey tail that swings below the line!', level: 2, worksheetUrl: '/worksheets/letter-g.html', skills: ['Round shapes', 'Below-line strokes'], estimatedTime: '10-15 minutes', color: 'from-blue-400 to-blue-600', emoji: 'g' },
    { id: 'letter-h', title: 'Worksheet 2.8: Letter h', friendlyTitle: 'The letter h!', description: 'Master the tall line with a small bump on the right.', kidsDescription: 'Draw a tall line, then add a small hill on the right side!', level: 2, worksheetUrl: '/worksheets/letter-h.html', skills: ['Tall strokes', 'Curved connections'], estimatedTime: '10-15 minutes', color: 'from-indigo-400 to-indigo-600', emoji: 'h' },
    { id: 'letter-i', title: 'Worksheet 2.9: Letter i', friendlyTitle: 'The letter i!', description: 'Practice the short line with a dot above it.', kidsDescription: 'Draw a short line and put a dot on top like a cherry!', level: 2, worksheetUrl: '/worksheets/letter-i.html', skills: ['Short strokes', 'Precise dots'], estimatedTime: '10-15 minutes', color: 'from-purple-400 to-purple-600', emoji: 'i' },
    { id: 'letter-j', title: 'Worksheet 2.10: Letter j', friendlyTitle: 'The letter j!', description: 'Master the line that goes below the line with a curve and a dot above.', kidsDescription: 'Draw a line that goes down and curves like a fishhook, with a dot on top!', level: 2, worksheetUrl: '/worksheets/letter-j.html', skills: ['Below-line strokes', 'Curved endings'], estimatedTime: '10-15 minutes', color: 'from-pink-400 to-pink-600', emoji: 'j' },
    { id: 'letter-k', title: 'Worksheet 2.11: Letter k', friendlyTitle: 'The letter k!', description: 'Practice the tall line with two diagonal lines on the right.', kidsDescription: 'Draw a tall line, then add two slanted lines that point out like arms!', level: 2, worksheetUrl: '/worksheets/letter-k.html', skills: ['Tall strokes', 'Diagonal lines'], estimatedTime: '10-15 minutes', color: 'from-rose-400 to-rose-600', emoji: 'k' },
    { id: 'letter-l', title: 'Worksheet 2.12: Letter l', friendlyTitle: 'The letter l!', description: 'Master the simple tall straight line.', kidsDescription: 'Draw a tall, straight line reaching for the sky!', level: 2, worksheetUrl: '/worksheets/letter-l.html', skills: ['Tall strokes', 'Straight lines'], estimatedTime: '10-15 minutes', color: 'from-red-400 to-red-600', emoji: 'l' },
    { id: 'letter-m', title: 'Worksheet 2.13: Letter m', friendlyTitle: 'The letter m!', description: 'Practice the line with two bumps, like small hills.', kidsDescription: 'Draw a line with two little mountains next to it!', level: 2, worksheetUrl: '/worksheets/letter-m.html', skills: ['Multiple curves', 'Consistent height'], estimatedTime: '10-15 minutes', color: 'from-orange-400 to-orange-600', emoji: 'm' },
    { id: 'letter-n', title: 'Worksheet 2.14: Letter n', friendlyTitle: 'The letter n!', description: 'Master the line with one bump, like a small hill.', kidsDescription: 'Draw a line with one little mountain next to it!', level: 2, worksheetUrl: '/worksheets/letter-n.html', skills: ['Curved connections', 'Consistent height'], estimatedTime: '10-15 minutes', color: 'from-yellow-400 to-yellow-600', emoji: 'n' },
    { id: 'letter-o', title: 'Worksheet 2.15: Letter o', friendlyTitle: 'The letter o!', description: 'Practice making a perfect circle.', kidsDescription: 'Draw a circle that\'s closed all the way around like a donut!', level: 2, worksheetUrl: '/worksheets/letter-o.html', skills: ['Circular motion', 'Closing shapes'], estimatedTime: '10-15 minutes', color: 'from-green-400 to-green-600', emoji: 'o' },
    { id: 'letter-p', title: 'Worksheet 2.16: Letter p', friendlyTitle: 'The letter p!', description: 'Master the line that goes below the line with a circle on the right.', kidsDescription: 'Draw a line that goes below the line, with a bubble on the right side!', level: 2, worksheetUrl: '/worksheets/letter-p.html', skills: ['Below-line strokes', 'Circular shapes'], estimatedTime: '10-15 minutes', color: 'from-teal-400 to-teal-600', emoji: 'p' },
    { id: 'letter-q', title: 'Worksheet 2.17: Letter q', friendlyTitle: 'The letter q!', description: 'Practice the circle with a line that goes below on the right.', kidsDescription: 'Draw a circle with a tail that goes down below the line!', level: 2, worksheetUrl: '/worksheets/letter-q.html', skills: ['Circular shapes', 'Below-line strokes'], estimatedTime: '10-15 minutes', color: 'from-cyan-400 to-cyan-600', emoji: 'q' },
    { id: 'letter-r', title: 'Worksheet 2.18: Letter r', friendlyTitle: 'The letter r!', description: 'Master the line with a small curve at the top right.', kidsDescription: 'Draw a line with a little rainbow coming off the top!', level: 2, worksheetUrl: '/worksheets/letter-r.html', skills: ['Short curves', 'Vertical strokes'],
    estimatedTime: '10-15 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'r'
  },
  {
    id: 'letter-s',
    title: 'Worksheet 2.19: Letter s',
    friendlyTitle: 'The letter s!',
    description: 'Practice the snake-like curve that reverses direction.',
    kidsDescription: 'Draw a little snake that curves one way, then the other way!',
    level: 2,
    worksheetUrl: '/worksheets/letter-s.html',
    skills: ['Reversing curves', 'Smooth transitions'],
    estimatedTime: '10-15 minutes',
    color: 'from-indigo-400 to-indigo-600',
    emoji: 's'
  },
  {
    id: 'letter-t',
    title: 'Worksheet 2.20: Letter t',
    friendlyTitle: 'The letter t!',
    description: 'Master the tall line with a cross in the middle.',
    kidsDescription: 'Draw a tall line and cross it in the middle like a flag pole!',
    level: 2,
    worksheetUrl: '/worksheets/letter-t.html',
    skills: ['Tall strokes', 'Crossing lines'],
    estimatedTime: '10-15 minutes',
    color: 'from-purple-400 to-purple-600',
    emoji: 't'
  },
  {
    id: 'letter-u',
    title: 'Worksheet 2.21: Letter u',
    friendlyTitle: 'The letter u!',
    description: 'Practice the curve that goes down and back up.',
    kidsDescription: 'Draw a smile shape that goes down and back up!',
    level: 2,
    worksheetUrl: '/worksheets/letter-u.html',
    skills: ['U-shaped curves', 'Consistent height'],
    estimatedTime: '10-15 minutes',
    color: 'from-pink-400 to-pink-600',
    emoji: 'u'
  },
  {
    id: 'letter-v',
    title: 'Worksheet 2.22: Letter v',
    friendlyTitle: 'The letter v!',
    description: 'Master the pointed shape that goes down and up.',
    kidsDescription: 'Draw a pointy shape like an arrow pointing down!',
    level: 2,
    worksheetUrl: '/worksheets/letter-v.html',
    skills: ['Diagonal strokes', 'Sharp angles'],
    estimatedTime: '10-15 minutes',
    color: 'from-rose-400 to-rose-600',
    emoji: 'v'
  },
  {
    id: 'letter-w',
    title: 'Worksheet 2.23: Letter w',
    friendlyTitle: 'The letter w!',
    description: 'Practice the shape with two points, like two "v"s together.',
    kidsDescription: 'Draw two pointy shapes next to each other, like mountains!',
    level: 2,
    worksheetUrl: '/worksheets/letter-w.html',
    skills: ['Multiple diagonals', 'Consistent width'],
    estimatedTime: '10-15 minutes',
    color: 'from-red-400 to-red-600',
    emoji: 'w'
  },
  {
    id: 'letter-x',
    title: 'Worksheet 2.24: Letter x',
    friendlyTitle: 'The letter x!',
    description: 'Master the two crossing diagonal lines.',
    kidsDescription: 'Draw two lines that cross each other like an X marks the spot!',
    level: 2,
    worksheetUrl: '/worksheets/letter-x.html',
    skills: ['Crossing diagonals', 'Intersecting lines'],
    estimatedTime: '10-15 minutes',
    color: 'from-orange-400 to-orange-600',
    emoji: 'x'
  },
  {
    id: 'letter-y',
    title: 'Worksheet 2.25: Letter y',
    friendlyTitle: 'The letter y!',
    description: 'Practice the shape that goes down, curves, and extends below the line.',
    kidsDescription: 'Draw a line that goes down, then curves below the line like a monkey tail!',
    level: 2,
    worksheetUrl: '/worksheets/letter-y.html',
    skills: ['Below-line strokes', 'Curved endings'],
    estimatedTime: '10-15 minutes',
    color: 'from-yellow-400 to-yellow-600',
    emoji: 'y'
  },
  {
    id: 'letter-z',
    title: 'Worksheet 2.26: Letter z',
    friendlyTitle: 'The letter z!',
    description: 'Master the shape with a top line, diagonal line, and bottom line.',
    kidsDescription: 'Draw a line across the top, a slanted line down, and a line across the bottom!',
    level: 2,
    worksheetUrl: '/worksheets/letter-z.html',
    skills: ['Horizontal strokes', 'Diagonal lines'],
    estimatedTime: '10-15 minutes',
    color: 'from-green-400 to-green-600',
    emoji: 'z'
  }
];

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