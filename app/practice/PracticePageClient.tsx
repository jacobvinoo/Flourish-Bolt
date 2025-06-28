'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import PageLayout from '@/components/PageLayout';
import { Database, Profile, Tables } from '@/lib/database.types';
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
  Heart,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

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

interface PracticePageClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

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
  icon: string;
  color: string;
  emoji: string;
}

// Using the full list of worksheets
const firstWorkbookSteps: WorksheetStep[] = [
  {
    id: 'vertical-lines',
    title: 'Worksheet 1.1: Vertical Lines',
    friendlyTitle: 'Straight Up Lines!',
    description: 'Start with basic vertical lines from top to bottom. Master downward stroke control.',
    kidsDescription: 'Draw straight lines going up and down, like tall trees or birthday candles!',
    level: 1,
    worksheetUrl: '/worksheets/vertical-lines.html',
    skills: ['Drawing straight', 'Top to bottom', 'Holding pencil'],
    estimatedTime: '10-15 minutes',
    icon: 'AlignLeft',
    color: 'from-blue-400 to-blue-600',
    emoji: '📏'
  },
  {
    id: 'horizontal-lines',
    title: 'Worksheet 1.2: Horizontal Lines',
    friendlyTitle: 'Side to Side Lines!',
    description: 'Practice horizontal lines from left to right. Build reading and writing flow.',
    kidsDescription: 'Draw lines that go sideways, like a sleeping snake or a calm ocean!',
    level: 1,
    worksheetUrl: '/worksheets/horizontal-lines.html',
    skills: ['Left to right', 'Reading direction', 'Smooth lines'],
    estimatedTime: '10-15 minutes',
    icon: 'ArrowRight',
    color: 'from-green-400 to-green-600',
    emoji: '➡️'
  },
  {
    id: 'circles',
    title: 'Worksheet 1.3: Circles',
    friendlyTitle: 'Round and Round!',
    description: 'Learn circular motions essential for letters like o, a, and d.',
    kidsDescription: 'Make perfect circles like bubbles, donuts, or the sun! Practice going round and round!',
    level: 1,
    worksheetUrl: '/worksheets/circles.html',
    skills: ['Circular motions', 'Smooth curves', 'Hand control'],
    estimatedTime: '15-20 minutes',
    icon: 'Circle',
    color: 'from-yellow-400 to-orange-500',
    emoji: '⭕'
  },
  {
    id: 'diagonal-lines',
    title: 'Worksheet 1.4: Diagonal Lines',
    friendlyTitle: 'Slanted Lines!',
    description: 'Master diagonal strokes for letters like A, V, X, and k.',
    kidsDescription: 'Draw slanted lines like slides at the playground or roof tops!',
    level: 1,
    worksheetUrl: '/worksheets/diagonal-lines.html',
    skills: ['Diagonal drawing', 'Angles', 'Letter shapes'],
    estimatedTime: '15-20 minutes',
    icon: 'TrendingUp',
    color: 'from-purple-400 to-purple-600',
    emoji: '📐'
  },
  {
    id: 'intersecting-lines',
    title: 'Worksheet 1.5: Intersecting Lines',
    friendlyTitle: 'Crossing Lines!',
    description: 'Practice crosses and plus signs with precision.',
    kidsDescription: 'Make crossing lines like a tic-tac-toe game or a treasure map X!',
    level: 1,
    worksheetUrl: '/worksheets/intersecting-lines.html',
    skills: ['Crossing lines', 'Precision', 'Plus signs'],
    estimatedTime: '15-20 minutes',
    icon: 'Plus',
    color: 'from-red-400 to-pink-500',
    emoji: '✖️'
  },
  {
    id: 'basic-shapes',
    title: 'Worksheet 1.6: Basic Shapes',
    friendlyTitle: 'Fun Shapes!',
    description: 'Combine strokes to create squares, triangles, and rectangles.',
    kidsDescription: 'Draw squares like windows, triangles like pizza slices, and rectangles like doors!',
    level: 1,
    worksheetUrl: '/worksheets/basic-shapes.html',
    skills: ['Shape drawing', 'Combining lines', 'Geometric fun'],
    estimatedTime: '20-25 minutes',
    icon: 'Square',
    color: 'from-indigo-400 to-blue-500',
    emoji: '🔺'
  },
  {
    id: 'continuous-curves',
    title: 'Worksheet 1.7: Continuous Curves',
    friendlyTitle: 'Wavy Lines!',
    description: 'Develop fluidity with wavy lines and loops for cursive preparation.',
    kidsDescription: 'Draw wavy lines like ocean waves, roller coasters, or a snake dancing!',
    level: 1,
    worksheetUrl: '/worksheets/continuous-curves.html',
    skills: ['Wavy lines', 'Smooth flow', 'Cursive prep'],
    estimatedTime: '20-25 minutes',
    icon: 'Waves',
    color: 'from-teal-400 to-cyan-500',
    emoji: '🌊'
  }
];

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
              <Button onClick={onFileRemove} variant="outline" size="sm" className={isKidsMode ? 'hover:bg-red-100' : ''}>
                <X className="h-4 w-4" />
                {isKidsMode && <span className="ml-1">Remove</span>}
              </Button>
            )}
          </div>
        </div>
      );
  }
  return (
    <div className="space-y-3">
      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${dragActive ? 'border-purple-400 bg-purple-100' : 'border-gray-300 hover:border-gray-400'}`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrop} onDrop={handleDrop}
        onClick={() => { if (!disabled && !uploading) document.getElementById('file-upload')?.click(); }}>
        <div className={`mx-auto mb-4 p-4 rounded-full ${isKidsMode ? 'bg-purple-200' : 'bg-gray-100'}`}>
          <Upload className={`h-12 w-12 mx-auto ${isKidsMode ? 'text-purple-600' : 'text-gray-400'}`} />
        </div>
        <h3 className="text-xl font-bold mb-2">Upload Your Completed Worksheet</h3>
        <p className="text-gray-600 mb-4">Drag and drop or click to select an image file</p>
        <Input id="file-upload" type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleChange} className="hidden" disabled={disabled || uploading} />
      </div>
    </div>
  );
}


export default function PracticePageClient({ user, profile, initialSubmissions }: PracticePageClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showGrading, setShowGrading] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    setLocalProfile(profile);
    setSubmissions(initialSubmissions);
  }, [profile, initialSubmissions]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }
    
    setUploading(true);
    setUploadError(null);

    try {
      const currentWorksheet = firstWorkbookSteps[currentStep];
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('worksheetId', currentWorksheet.id);
      formData.append('worksheetTitle', currentWorksheet.title);
      formData.append('worksheetInstructions', currentWorksheet.description);

      const response = await fetch('/api/grade-worksheet', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Server error: ${responseText}`);
      }
      
      const result = JSON.parse(responseText);
      
      setAnalysisResult({ ...result, imageUrl: URL.createObjectURL(selectedFile) });
      setShowGrading(true);

    } catch (error: any) {
      setUploadError(error.message || 'An unexpected error occurred.');
    } finally {
      setUploading(false);
    }
  };


  const handleGradingComplete = async () => {
    const newXp = (localProfile?.xp ?? 0) + 50;
    await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);

    router.refresh();

    setShowGrading(false);
    setAnalysisResult(null);
    setUploadSuccess(true);
    
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedFile(null);
      if (currentStep < firstWorkbookSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 2000);
  };

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = firstWorkbookSteps[currentStep];

  const currentSubmissions = submissions
    .filter(s => s.worksheet_id === currentWorksheet.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const openWorksheet = (worksheetUrl: string) => { window.open(worksheetUrl, '_blank', 'noopener,noreferrer'); };
  const goToPreviousStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const goToNextStep = () => { if (currentStep < firstWorkbookSteps.length - 1) setCurrentStep(currentStep + 1); };

  const completedStepsCount = new Set(submissions.map(s => s.worksheet_id)).size;
  const progressPercentage = (completedStepsCount / firstWorkbookSteps.length) * 100;

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
        
        {/* Header and Progress */}
        <div className="mb-8 text-center">
            {/* ... */}
        </div>
        {/* Progress Bar */}
        {isKidsMode && (
          <div>...Progress Bar UI...</div>
        )}

        {/* Upload Success */}
        {uploadSuccess && (
          <div>...Upload Success UI...</div>
        )}
        
        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Worksheet Card */}
            <div className={`border-0 shadow-xl overflow-hidden rounded-2xl ${isKidsMode ? `bg-gradient-to-br ${currentWorksheet.color} text-white` : 'bg-white border border-gray-200'}`}>
              <div className="p-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`text-6xl ${isKidsMode ? 'animate-bounce' : ''}`}>{currentWorksheet.emoji}</div>
                      <div>
                        <h3 className={`text-2xl font-bold ${isKidsMode ? 'text-white' : 'text-gray-900'}`}>{isKidsMode ? currentWorksheet.friendlyTitle : currentWorksheet.title}</h3>
                        <p className={`mt-2 text-lg ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>{isKidsMode ? currentWorksheet.kidsDescription : currentWorksheet.description}</p>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <Button onClick={() => openWorksheet(currentWorksheet.worksheetUrl)} className="w-full h-12 text-lg font-bold">
                  <Eye className="h-5 w-5 mr-2" />
                  Open Worksheet
                </Button>
              </div>
            </div>
            
            {/* AI Grading Results (conditionally rendered) */}
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
                      <p className="text-5xl font-bold text-green-500">{analysisResult.score}%</p>
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
                      <p className="text-sm text-blue-700">{analysisResult.feedback}</p>
                    </div>
                    <Button onClick={handleGradingComplete} className="w-full h-12 text-lg font-bold bg-green-600 text-white hover:bg-green-700">Continue to Next Step</Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Upload Section (conditionally rendered) */}
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
                  <Button onClick={handleUpload} size="lg" disabled={uploading} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    {uploading ? "Analyzing..." : "Grade My Worksheet!"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 border-0 shadow-xl rounded-2xl bg-white/50">
              <h3 className="font-bold text-lg mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                {firstWorkbookSteps.map((step, index) => (
                  <button key={step.id} onClick={() => setCurrentStep(index)} className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-3 ${index === currentStep ? 'border-blue-500 bg-blue-50' : 'bg-white hover:border-gray-300'}`}>
                    <span className="font-mono text-xl">{step.emoji}</span>
                    <span className="font-semibold">{step.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Submission History Section --- */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-7 w-7 text-gray-400" />
            <h2 className="text-3xl font-bold text-gray-800">Submission History</h2>
          </div>
          <div className="space-y-4">
            {currentSubmissions.length > 0 ? (
              currentSubmissions.map((submission) => {
                const { data: imageUrlData } = supabase.storage
                  .from('submissions')
                  .getPublicUrl(submission.image_path);

                return (
                  <div key={submission.id} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
                    <img 
                      src={imageUrlData.publicUrl}
                      alt={`Submission for ${submission.worksheet_id}`}
                      className="w-full md:w-32 h-auto md:h-32 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg text-gray-800">Overall Score: {submission.score}%</p>
                        <p className="text-xs text-gray-400">{new Date(submission.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-4 mt-1">
                        <p className="text-sm text-blue-600">Steadiness: {submission.steadiness}%</p>
                        <p className="text-sm text-green-600">Accuracy: {submission.accuracy}%</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-md">
                        <strong>Feedback:</strong> <em>"{submission.feedback}"</em>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border">
                <p className="text-gray-500">You haven't made any submissions for this worksheet yet.</p>
                <p className="text-gray-400 text-sm mt-1">Complete the exercise above to see your history!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

