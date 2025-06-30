'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import PageLayout from '@/components/PageLayout';
import { Database, Profile } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  X,
  AlertCircle,
  Star,
  CheckCircle,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ImageOff,
  Loader2
} from 'lucide-react';

// Define the structure for the props passed to this component
interface PracticePageClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

// NOTE: This is a temporary fix. For a permanent solution, you should
// update your `database.types.ts` by running the Supabase CLI.
type Submission = {
  id: string;
  user_id: string;
  worksheet_id: string;
  score: number;
  steadiness: number;
  accuracy: number;
  feedback: string | null;
  image_path: string;
  created_at: string;
};

// Define the structure for a single worksheet step
interface WorksheetStep {
  id: string;
  title: string;
  friendlyTitle: string;
  description: string;
  kidsDescription: string;
  level: number;
  worksheetUrl: string;
  skills: string[];
  estimatedTime: string;
  color: string;
  emoji: string;
  completed?: boolean;
}

// This array defines the practice steps for the numbers 6-9 workbook.
const numbers69WorkbookSteps: WorksheetStep[] = [
  {
    id: 'numbers-6',
    title: 'Worksheet 4.7: Number 6',
    friendlyTitle: 'The number 6!',
    description: 'Practice the curve and loop of the number 6.',
    kidsDescription: "Let's draw a curve and a loop to make the number 6!",
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
    friendlyTitle: 'The number 7!',
    description: 'Master the horizontal and diagonal lines of the number 7.',
    kidsDescription: 'Draw a flat line and a slanted line to make the number 7!',
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
    friendlyTitle: 'The number 8!',
    description: 'Practice the double loop of the number 8.',
    kidsDescription: 'Draw two loops stacked on top of each other to make the number 8!',
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
    friendlyTitle: 'The number 9!',
    description: 'Master the loop and line of the number 9.',
    kidsDescription: 'Draw a loop with a straight line down to make the number 9!',
    level: 3,
    worksheetUrl: '/worksheets/numbers-6-9.html',
    skills: ['Loop formation', 'Vertical lines', 'Number formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: '9'
  }
];

// NOTE: The FileUpload component is included here for simplicity.
// In a larger app, you might move this to its own file in the `components` directory.
function FileUpload({ onFileSelect, onFileRemove, selectedFile, uploading, disabled = false, isKidsMode = false }: {
  onFileSelect: (file: File) => void,
  onFileRemove: () => void,
  selectedFile: File | null,
  uploading: boolean,
  disabled?: boolean,
  isKidsMode?: boolean
}) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
      else if (e.type === "dragleave") setDragActive(false);
    };
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault(); e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelection(e.dataTransfer.files[0]);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) handleFileSelection(e.target.files[0]);
    };
    const handleFileSelection = (file: File) => {
      setError(null);
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError(isKidsMode ? '😅 Oops! Please pick a photo file (JPG or PNG)' : 'Please select a valid image file (JPEG, PNG, or JPG)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(isKidsMode ? '😅 That photo is too big! Please pick a smaller one.' : 'File size must be less than 10MB');
        return;
      }
      onFileSelect(file);
    };

  if (selectedFile) {
    return (
      <div className={`border-2 border-dashed rounded-xl p-6 ${isKidsMode ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-gray-300 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isKidsMode ? 'bg-purple-200' : 'bg-blue-100'}`}>
              <Upload className={`h-8 w-8 ${isKidsMode ? 'text-purple-600' : 'text-blue-500'}`} />
            </div>
            <div>
              <p className="font-medium text-lg">{isKidsMode ? '📸 Your awesome photo!' : selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          {!uploading && (
            <Button onClick={onFileRemove} variant="outline" size="sm" className={`${isKidsMode ? 'hover:bg-red-100' : ''} flex items-center`}>
              <X className="h-4 w-4" />
              {isKidsMode && <span className="ml-1">Remove</span>}
            </Button>
          )}
        </div>
        {uploading && (
          <div className="mt-4 flex items-center gap-2 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm font-medium">{isKidsMode ? '🚀 Uploading your amazing work...' : 'Uploading...'}</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${dragActive ? isKidsMode ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 scale-105' : 'border-blue-400 bg-blue-50' : isKidsMode ? 'border-purple-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:scale-102' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        onClick={() => { if (!disabled && !uploading) document.getElementById('file-upload-numbers-69')?.click(); }}>
        <div className={`mx-auto mb-4 p-4 rounded-full ${isKidsMode ? 'bg-gradient-to-br from-purple-200 to-pink-200' : 'bg-gray-100'}`}>
          <Upload className={`h-12 w-12 mx-auto ${isKidsMode ? 'text-purple-600' : 'text-gray-400'}`} />
        </div>
        <h3 className="text-xl font-bold mb-2">{isKidsMode ? dragActive ? '📸 Drop your photo here!' : '📷 Add Your Worksheet Photo!' : dragActive ? 'Drop your image here' : 'Upload worksheet image'}</h3>
        <p className="text-gray-600 mb-4">{isKidsMode ? 'Drag and drop your photo here, or click to choose one from your device! 🖱️' : 'Drag and drop or click to select an image file'}</p>
        <Input id="file-upload-numbers-69" type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleChange} className="hidden" disabled={disabled || uploading} />
      </div>
      {error && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${isKidsMode ? 'bg-red-50 border border-red-200' : 'bg-red-50 border border-red-200'}`}>
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}

export default function Numbers69Client({ user, profile, initialSubmissions }: PracticePageClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showGrading, setShowGrading] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Effect to keep local profile state in sync with props from the server component
  useEffect(() => {
    setLocalProfile(profile);
    setSubmissions(initialSubmissions);
    
    // Initialize completedSteps based on submissions
    const completedWorksheetIds = new Set(initialSubmissions.map(sub => sub.worksheet_id));
    setCompletedSteps(completedWorksheetIds);
  }, [profile, initialSubmissions]);

  // Fetch submissions when the current step changes
  useEffect(() => {
    fetchSubmissions();
  }, [currentStep]);

  const fetchSubmissions = async () => {
    if (!user) return;
    
    try {
      const currentWorksheet = numbers69WorkbookSteps[currentStep];
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('worksheet_id', currentWorksheet.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        setSubmissions(data || []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
    setAnalysisResult(null);
    setShowGrading(false);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(false);
    setAnalysisResult(null);
    setShowGrading(false);
  };

  const isKidsMode = localProfile?.display_mode === 'kids';

  const simulateAIAnalysis = (file: File) => {
    const averageScore = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
    const steadiness = Math.floor(Math.random() * 41) + 60;
    const accuracy = Math.floor(Math.random() * 41) + 60;
    return {
      overallScore: averageScore,
      steadiness: steadiness,
      accuracy: accuracy,
      feedbackTip: 'Great job on these more complex numbers! Focus on making the curves smooth and consistent.',
      imageUrl: URL.createObjectURL(file)
    };
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Simulate AI analysis delay
      setTimeout(() => {
        const result = simulateAIAnalysis(selectedFile);
        setAnalysisResult(result);
        setShowGrading(true);
        setUploading(false);
      }, 2500);

      const timestamp = new Date().getTime();
      const fileExt = selectedFile.name.split('.').pop();
      const currentWorksheet = numbers69WorkbookSteps[currentStep];
      const fileName = `${user.id}/${currentWorksheet.id}/${timestamp}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('submissions').upload(fileName, selectedFile);
      if (uploadError) throw new Error(uploadError.message);

    } catch (error: any) {
      setUploadError(error.message || 'An unexpected error occurred during upload');
      setUploading(false);
    }
  };

  const handleGradingComplete = async () => {
    if (!analysisResult) return;
    
    const newXp = (localProfile?.xp ?? 0) + 20; // Award 20 XP for a number
    const currentWorksheet = numbers69WorkbookSteps[currentStep];
    
    try {
      // Save the submission to the database
      const submissionData = {
        user_id: user.id,
        worksheet_id: currentWorksheet.id,
        score: analysisResult.overallScore,
        steadiness: analysisResult.steadiness,
        accuracy: analysisResult.accuracy,
        feedback: analysisResult.feedbackTip,
        image_path: `${user.id}/${currentWorksheet.id}/${Date.now()}.jpg`
      };
      
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert(submissionData);
        
      if (submissionError) {
        console.error("SUBMISSION SAVE FAILED:", submissionError);
      }
      
      // Update user XP
      const { error } = await supabase
        .from('profiles')
        .update({ xp: newXp })
        .eq('id', user.id);

      if (error) {
        console.error("DATABASE UPDATE FAILED:", error);
      } else {
        router.refresh(); // Refresh server data
        setLocalProfile(p => p ? { ...p, xp: newXp } : null);
      }

      // Refresh submissions
      await fetchSubmissions();

      setShowGrading(false);
      setUploadSuccess(true);
      setCompletedSteps(prev => new Set(prev).add(numbers69WorkbookSteps[currentStep].id));
      
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFile(null);
        if (currentStep < numbers69WorkbookSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 2000);
    } catch (err) {
      console.error("Error completing grading:", err);
    }
  };

  const openWorksheet = (worksheetUrl: string) => window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  const goToPreviousStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const goToNextStep = () => { if (currentStep < numbers69WorkbookSteps.length - 1) setCurrentStep(currentStep + 1); };

  const currentWorksheet = numbers69WorkbookSteps[currentStep];
  const progressPercentage = (completedSteps.size / numbers69WorkbookSteps.length) * 100;

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
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500' : 'text-gray-900'}`}>
            Numbers 6-9 Practice
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-teal-700' : 'text-gray-600'}`}>
            Let's learn to write the more complex numbers from 6 to 9!
          </p>
        </div>

        {isKidsMode && (
          <div className="border-0 shadow-xl mb-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white overflow-hidden rounded-2xl">
            <div className="pt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="h-6 w-6" /> Your Amazing Progress!
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">{completedSteps.size} / {numbers69WorkbookSteps.length}</div>
                  <div className="text-sm opacity-90">Steps Done!</div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className={`mb-6 p-6 rounded-2xl flex items-center gap-4 animate-bounce shadow-lg ${isKidsMode ? 'bg-gradient-to-r from-green-100 to-emerald-100' : 'bg-green-50'}`}>
            <div className="flex-shrink-0">
                {isKidsMode ? <div className="text-4xl">🎉</div> : <CheckCircle className="h-8 w-8 text-green-500" />}
            </div>
            <div>
                <p className="font-bold text-lg text-green-800">🌟 Fantastic work! Your submission has been saved.</p>
                <p className="text-green-700">Moving to the next adventure... 🚀</p>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className={`border-0 shadow-xl overflow-hidden rounded-2xl ${isKidsMode ? `bg-gradient-to-br ${currentWorksheet.color} text-white` : 'bg-white border'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{currentWorksheet.emoji}</div>
                    <div>
                      <h3 className={`text-2xl font-bold ${isKidsMode ? 'text-white' : 'text-gray-900'}`}>{isKidsMode ? currentWorksheet.friendlyTitle : currentWorksheet.title}</h3>
                      <p className={`mt-2 text-lg ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>{isKidsMode ? currentWorksheet.kidsDescription : currentWorksheet.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-center gap-4">
                    <Button onClick={() => openWorksheet(currentWorksheet.worksheetUrl)} className="flex-1 h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center">
                      <Eye className="h-5 w-5 mr-2" />
                      <span>Open Worksheet</span>
                    </Button>
                    <Button onClick={() => window.print()} variant="outline" size="icon" className="h-12 w-12 flex items-center justify-center">
                      <Printer className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Button onClick={goToPreviousStep} disabled={currentStep === 0} variant="outline" className="flex items-center">
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    <span>Previous</span>
                  </Button>
                  <span className="font-bold">{currentStep + 1} of {numbers69WorkbookSteps.length}</span>
                  <Button onClick={goToNextStep} disabled={currentStep === numbers69WorkbookSteps.length - 1} variant="outline" className="flex items-center">
                    <span>Next</span>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {showGrading && analysisResult && (
              <div className="p-6 rounded-2xl shadow-xl bg-white border">
                <h2 className="text-2xl font-bold text-center mb-6">AI Grading Results</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Your Submission</h3>
                    <img src={analysisResult.imageUrl} alt="Graded worksheet" className="w-full rounded-lg shadow-md" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="rounded-xl p-6 text-center mb-4 bg-gray-100">
                      <p className="text-lg text-gray-600">Overall Score</p>
                      <p className={`text-5xl font-bold ${analysisResult.overallScore >= 90 ? 'text-green-500' : analysisResult.overallScore >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>{analysisResult.overallScore}%</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-blue-600 font-medium">Steadiness</p>
                        <p className="text-2xl font-bold text-blue-700">{analysisResult.steadiness}%</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-green-600 font-medium">Accuracy</p>
                        <p className="text-2xl font-bold text-green-700">{analysisResult.accuracy}%</p>
                      </div>
                    </div>
                    <div className="border-l-4 p-4 rounded-r-lg mb-6 bg-blue-50 border-blue-500">
                      <h4 className="font-bold text-blue-800">Actionable Tip</h4>
                      <p className="text-sm text-blue-700">{analysisResult.feedbackTip}</p>
                    </div>
                    <Button onClick={handleGradingComplete} className="w-full h-12 text-lg font-bold bg-green-600 text-white hover:bg-green-700 flex items-center justify-center">
                      <span>Continue to Next Step</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {!showGrading && (
              <div className="p-6 border-0 shadow-xl rounded-2xl bg-white/50">
                <h3 className="text-xl font-bold mb-4">Upload Your Completed Number</h3>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={selectedFile}
                  uploading={uploading}
                  disabled={uploadSuccess}
                  isKidsMode={isKidsMode}
                />
                {selectedFile && !uploading && !showGrading && (
                  <Button onClick={handleUpload} size="lg" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center">
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
            <div className="p-6 border-0 shadow-xl rounded-2xl bg-white/50">
              <h3 className="font-bold text-lg mb-4">Number Navigation</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {numbers69WorkbookSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-3 ${
                      index === currentStep
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : completedSteps.has(step.id)
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="font-mono text-xl">{step.emoji}</span>
                    <span className="font-semibold">{isKidsMode ? step.friendlyTitle : step.title}</span>
                    {completedSteps.has(step.id) && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submission History Section */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-7 w-7 text-gray-400" />
            <h2 className="text-3xl font-bold text-gray-800">Submission History</h2>
          </div>
          <div className="space-y-4">
            {submissions.length > 0 ? (
              submissions.map((submission) => {
                // Get the public URL for the image
                const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(submission.image_path);
                
                return (
                  <div key={submission.id} className="p-6 bg-white rounded-2xl border flex items-center gap-6">
                    {/* Display the image with proper error handling */}
                    <div className="w-32 h-32 rounded-lg border overflow-hidden flex items-center justify-center bg-gray-100 relative">
                      <img 
                        src={publicUrl} 
                        alt={`Submission for ${submission.worksheet_id}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load image:', publicUrl);
                          // Replace with a placeholder when image fails to load
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite error loop
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmaWxsPSIjOWNhM2FmIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-bold text-lg">Score: {submission.score}%</p>
                        <p className="text-xs text-gray-400">{new Date(submission.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-4 mt-1">
                        <p className="text-sm text-blue-600">Steadiness: {submission.steadiness}%</p>
                        <p className="text-sm text-green-600">Accuracy: {submission.accuracy}%</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-md"><strong>Feedback:</strong> <em>"{submission.feedback}"</em></p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border">
                <p className="text-gray-500">You haven't made any submissions for this number yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}