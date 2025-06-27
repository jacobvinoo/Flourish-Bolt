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
  Heart,
  Sparkles,
  Award,
  Plus,
  Square,
  TrendingUp,
  Circle,
  PenTool
} from 'lucide-react';

interface PracticePageClientProps {
  user: User;
  profile: Profile;
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
  completed?: boolean;
}

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
        onClick={() => { if (!disabled && !uploading) document.getElementById('file-upload')?.click(); }}>
        <div className={`mx-auto mb-4 p-4 rounded-full ${isKidsMode ? 'bg-gradient-to-br from-purple-200 to-pink-200' : 'bg-gray-100'}`}>
          <Upload className={`h-12 w-12 mx-auto ${isKidsMode ? 'text-purple-600' : 'text-gray-400'}`} />
        </div>
        <h3 className="text-xl font-bold mb-2">{isKidsMode ? dragActive ? '📸 Drop your photo here!' : '📷 Add Your Worksheet Photo!' : dragActive ? 'Drop your image here' : 'Upload worksheet image'}</h3>
        <p className="text-gray-600 mb-4">{isKidsMode ? 'Drag and drop your photo here, or click to choose one from your device! 🖱️' : 'Drag and drop or click to select an image file'}</p>
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${isKidsMode ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
          {isKidsMode ? '✨ Photos (JPG, PNG) up to 10MB' : 'Supports JPEG, PNG up to 10MB'}
        </div>
        <Input id="file-upload" type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleChange} className="hidden" disabled={disabled || uploading} />
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

export default function PracticePageClient({ user, profile }: PracticePageClientProps) {
  // const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showGrading, setShowGrading] = useState(false);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file); setUploadError(null); setUploadSuccess(false); setAnalysisResult(null); setShowGrading(false);
  };
  const handleFileRemove = () => {
    setSelectedFile(null); setUploadError(null); setUploadSuccess(false); setAnalysisResult(null); setShowGrading(false);
  };

  const simulateAIAnalysis = (file: File) => {
    const mockAnalysisData = [
      { score: 95, steadiness: 98, accuracy: 92 }, { score: 78, steadiness: 70, accuracy: 86 },
      { score: 92, steadiness: 95, accuracy: 89 }, { score: 65, steadiness: 80, accuracy: 50 },
      { score: 88, steadiness: 90, accuracy: 86 }, { score: 96, steadiness: 97, accuracy: 95 },
      { score: 91, steadiness: 92, accuracy: 90 }, { score: 94, steadiness: 95, accuracy: 93 },
      { score: 82, steadiness: 85, accuracy: 79 }, { score: 97, steadiness: 98, accuracy: 96 },
      { score: 75, steadiness: 72, accuracy: 78 }, { score: 90, steadiness: 91, accuracy: 89 },
      { score: 72, steadiness: 65, accuracy: 79 }, { score: 85, steadiness: 88, accuracy: 82 },
      { score: 93, steadiness: 94, accuracy: 92 }, { score: 68, steadiness: 60, accuracy: 76 },
      { score: 90, steadiness: 92, accuracy: 88 }, { score: 96, steadiness: 97, accuracy: 95 },
      { score: 88, steadiness: 90, accuracy: 86 }, { score: 55, steadiness: 70, accuracy: 40 },
    ];
    const totalScore = mockAnalysisData.reduce((sum, l) => sum + l.score, 0);
    const averageScore = Math.round(totalScore / mockAnalysisData.length);
    const averageSteadiness = Math.round(mockAnalysisData.reduce((sum, l) => sum + l.steadiness, 0) / mockAnalysisData.length);
    const averageAccuracy = Math.round(mockAnalysisData.reduce((sum, l) => sum + l.accuracy, 0) / mockAnalysisData.length);
    let feedbackTip = "";
    const isKidsMode = profile?.display_mode === 'kids';
    if (averageScore < 70) feedbackTip = isKidsMode ? "Good effort! Let's focus on both staying smooth and hitting the dots on our next try. Practice makes perfect! 🌟" : "Good effort! Let's focus on both staying smooth and hitting the dots on our next try. Practice makes perfect!";
    else if (averageSteadiness < averageAccuracy && averageSteadiness < 85) feedbackTip = isKidsMode ? "Great work on accuracy! For next time, let's focus on making our lines smoother and less wobbly. A relaxed grip can help! ✏️" : "Great work on accuracy! For next time, let's focus on making our lines smoother and less wobbly. A relaxed grip can help!";
    else if (averageAccuracy < averageSteadiness && averageAccuracy < 85) feedbackTip = isKidsMode ? "Your lines are nice and steady! Let's now focus on starting right on the green dot and stopping at the red dot. 🎯" : "Your lines are nice and steady! Let's now focus on starting right on the green dot and stopping at the red dot.";
    else feedbackTip = isKidsMode ? "Fantastic work! Your lines are accurate and steady. You're ready to move on to the next challenge! 🏆" : "Fantastic work! Your lines are accurate and steady. You're ready to move on to the next challenge!";
    return { lines: mockAnalysisData, overallScore: averageScore, steadiness: averageSteadiness, accuracy: averageAccuracy, feedbackTip, imageUrl: URL.createObjectURL(file) };
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setUploadError(profile?.display_mode === 'kids' ? '😅 Please pick a photo first!' : 'No file selected or user not authenticated');
      return;
    }
    setUploading(true); setUploadError(null); setUploadSuccess(false);
    try {
      setTimeout(() => {
        const result = simulateAIAnalysis(selectedFile);
        setAnalysisResult(result); setShowGrading(true); setUploading(false);
      }, 2500);

      const timestamp = new Date().getTime();
      const fileExt = selectedFile.name.split('.').pop();
      const currentWorksheet = firstWorkbookSteps[currentStep];
      const fileName = `${user.id}/${currentWorksheet.id}/${timestamp}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('submissions').upload(fileName, selectedFile, { cacheControl: '3600', upsert: false });
      if (uploadError) throw new Error(uploadError.message);
    } catch (error: any) {
      setUploadError(profile?.display_mode === 'kids' ? '😞 Oops! Something went wrong. Can you try again?' : error.message || 'An unexpected error occurred during upload');
      setUploading(false);
    }
  };

  const handleGradingComplete = () => {
    // Award 50 xp for completing a step
    const newXp = (profile?.xp ?? 0) + 50;

    // Update the profile in the database
    const { error } = await supabase
      .from('profiles')
      .update({ xp: newXp })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      
    }
    setUploadSuccess(true); 
    setSelectedFile(null); 
    setShowGrading(false); 
    setAnalysisResult(null);
    setCompletedSteps(prev => {
      const newSet = new Set(prev); 
      newSet.add(firstWorkbookSteps[currentStep].id); 
      return newSet;
    });
    setTimeout(() => {
      if (currentStep < firstWorkbookSteps.length - 1) setCurrentStep(currentStep + 1);
      setUploadSuccess(false);
    }, 2000);
  };

  const openWorksheet = (worksheetUrl: string) => { window.open(worksheetUrl, '_blank', 'noopener,noreferrer'); };
  const goToPreviousStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const goToNextStep = () => { if (currentStep < firstWorkbookSteps.length - 1) setCurrentStep(currentStep + 1); };

  const isKidsMode = profile?.display_mode === 'kids';
  const currentWorksheet = firstWorkbookSteps[currentStep];
  const progressPercentage = ((completedSteps.size) / firstWorkbookSteps.length) * 100;
  const isCompleted = completedSteps.has(currentWorksheet.id);

  return (
  <PageLayout
    isKidsMode={isKidsMode} 
    headerVariant="authenticated" 
    headerProps={{ 
      showUserControls: true, 
      profile: profile,
      currentStreak: profile?.current_streak ?? 0, 
      xp: profile?.xp ?? 0
    }}
    >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Progress */}
      <div className="mb-8 text-center">
        <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-900'}`}>
          {isKidsMode ? '🎨 Handwriting Adventure!' : 'First Workbook Practice'}
        </h2>
        <p className={`mt-2 text-lg ${isKidsMode ? 'text-purple-700' : 'text-gray-600'}`}>
          {isKidsMode
            ? 'Let\'s practice writing and have tons of fun! 🚀✨'
            : 'Master the fundamentals with our structured practice program'}
        </p>
      </div>
      {/* Progress Bar */}
      {isKidsMode && (
        <div className="border-0 shadow-xl mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden rounded-2xl">
          <div className="pt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6" />
                Your Amazing Progress!
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold">{completedSteps.size} / {firstWorkbookSteps.length}</div>
                <div className="text-sm opacity-90">Steps Done!</div>
              </div>
            </div>
            <div className="flex justify-between mb-3">
              {firstWorkbookSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                    completedSteps.has(step.id)
                      ? 'bg-yellow-400 text-yellow-900 scale-110'
                      : index === currentStep
                      ? 'bg-white text-purple-600 scale-105'
                      : 'bg-white/30 text-white/70'
                  }`}>
                    {completedSteps.has(step.id) ? '⭐' : index + 1}
                  </div>
                  <div className="text-xs mt-1 opacity-90 hidden sm:block">{index + 1}</div>
                </div>
              ))}
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Success */}
      {uploadSuccess && (
        <div className={`mb-6 p-6 rounded-2xl flex items-center gap-4 animate-bounce shadow-lg ${
          isKidsMode
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300'
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex-shrink-0">
            {isKidsMode ? (
              <div className="text-4xl">🎉</div>
            ) : (
              <div className="p-2 rounded-xl bg-green-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className={`font-bold text-lg ${isKidsMode ? 'text-green-800' : 'text-green-800'}`}>
              {isKidsMode ? '🌟 Fantastic work! You\'re amazing!' : 'Upload Successful!'}
            </p>
            <p className={`${isKidsMode ? 'text-green-700' : 'text-green-700'}`}>
              {isKidsMode
                ? 'Your beautiful work has been saved! Moving to the next adventure... 🚀'
                : 'Your worksheet has been uploaded successfully. Moving to next step...'}
            </p>
          </div>
        </div>
      )}

      {/* AI Grading */}
      {showGrading && analysisResult && (
        <div className={`mb-8 p-6 rounded-2xl shadow-xl ${
          isKidsMode
            ? 'bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200'
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold text-center mb-6 ${isKidsMode ? 'text-blue-700' : 'text-gray-900'}`}>
            {isKidsMode ? '🎓 Your Grading Report!' : 'AI Grading Results'}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Graded Image */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isKidsMode ? 'text-blue-600' : 'text-gray-700'}`}>
                {isKidsMode ? '📸 Visual Analysis' : 'Visual Analysis'}
              </h3>
              {/* Grading Overlay */}
              <div className="relative w-full max-w-lg mx-auto">
                <img src={analysisResult.imageUrl} alt="Graded worksheet" className="w-full rounded-lg shadow-md" />
                {/* (Omitted: grading bar overlay for brevity, can add if you want the lines as in original) */}
              </div>
            </div>
            {/* Score & Feedback */}
            <div className="flex flex-col justify-center">
              <h3 className={`text-lg font-semibold mb-4 ${isKidsMode ? 'text-blue-600' : 'text-gray-700'}`}>
                {isKidsMode ? '⭐ Your Performance!' : 'Overall Performance'}
              </h3>
              <div className={`rounded-xl p-6 text-center mb-4 ${isKidsMode ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <p className={`text-lg ${isKidsMode ? 'text-blue-600' : 'text-gray-600'}`}>
                  {isKidsMode ? 'Overall Score 🏆' : 'Overall Score'}
                </p>
                <p className={`text-5xl font-bold ${
                  analysisResult.overallScore >= 90
                    ? 'text-green-500'
                    : analysisResult.overallScore >= 70
                      ? 'text-yellow-500'
                      : 'text-red-500'
                }`}>
                  {analysisResult.overallScore}%
                </p>
              </div>
              {!isKidsMode && (
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
              )}
              <div className={`border-l-4 p-4 rounded-r-lg mb-6 ${
                isKidsMode ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex">
                  <div className="py-1">
                    <Sparkles className={`w-6 h-6 mr-4 ${isKidsMode ? 'text-yellow-500' : 'text-blue-500'}`} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${isKidsMode ? 'text-yellow-800' : 'text-blue-800'}`}>
                      {isKidsMode ? '💡 Helpful Tip!' : 'Actionable Tip'}
                    </h4>
                    <p className={`text-sm ${isKidsMode ? 'text-yellow-700' : 'text-blue-700'}`}>
                      {analysisResult.feedbackTip}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleGradingComplete}
                className={`w-full h-12 text-lg font-bold transition-all duration-200 ${
                  isKidsMode
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isKidsMode ? '🎉 Awesome! Continue Learning!' : 'Continue to Next Step'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className={`mb-6 p-6 rounded-2xl flex items-center gap-4 shadow-lg ${
          isKidsMode
            ? 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex-shrink-0">
            {isKidsMode ? (
              <div className="text-4xl">😅</div>
            ) : (
              <div className="p-2 rounded-xl bg-red-500">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className={`font-bold text-lg ${isKidsMode ? 'text-red-800' : 'text-red-800'}`}>
              {isKidsMode ? 'Oopsie! Let\'s try that again!' : 'Upload Failed'}
            </p>
            <p className={`${isKidsMode ? 'text-red-700' : 'text-red-700'}`}>{uploadError}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Current Worksheet Card */}
          <div className={`border-0 shadow-xl mb-8 overflow-hidden rounded-2xl ${isKidsMode ? `bg-gradient-to-br ${currentWorksheet.color} text-white` : 'bg-white border border-gray-200'}`}>
            <div className="pb-4 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-6xl ${isKidsMode ? 'animate-bounce' : ''}`}>
                    {currentWorksheet.emoji}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isKidsMode ? 'text-white' : 'text-gray-900'}`}>
                      {isKidsMode ? currentWorksheet.friendlyTitle : currentWorksheet.title}
                    </h3>
                    <p className={`mt-2 text-lg ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>
                      {isKidsMode ? currentWorksheet.kidsDescription : currentWorksheet.description}
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Star className="h-6 w-6 fill-current" />
                    <span className="font-bold">Completed!</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6 p-6 pt-0">
              <div className="flex flex-wrap gap-2">
                {currentWorksheet.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`text-sm px-3 py-1 rounded-full border ${
                      isKidsMode
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-6">
                <div className={`flex items-center gap-2 ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">{currentWorksheet.estimatedTime}</span>
                </div>
                <div className={`flex items-center gap-2 ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Step {currentStep + 1} of {firstWorkbookSteps.length}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => openWorksheet(currentWorksheet.worksheetUrl)}
                  className={`flex-1 h-12 text-lg font-bold transition-all duration-200 ${
                    isKidsMode
                      ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  {isKidsMode ? '📄 Open My Worksheet!' : 'Open Worksheet'}
                </Button>
                <Button
                  onClick={() => openWorksheet(currentWorksheet.worksheetUrl)}
                  variant={isKidsMode ? "secondary" : "outline"}
                  size="icon"
                  className={`h-12 w-12 ${
                    isKidsMode
                      ? 'bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-lg'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Printer className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              variant="outline"
              className={`h-12 px-6 transition-all duration-200 ${
                isKidsMode
                  ? 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50'
                  : 'border-gray-200 hover:bg-gray-50 disabled:opacity-50'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              {isKidsMode ? '⬅️ Previous' : 'Previous Step'}
            </Button>
            <div className={`text-center px-4 py-2 rounded-full ${
              isKidsMode
                ? 'bg-white/80 text-purple-700 font-bold'
                : 'bg-green-100 text-green-700 font-medium'
            }`}>
              {currentStep + 1} of {firstWorkbookSteps.length}
            </div>
            <Button
              onClick={goToNextStep}
              disabled={currentStep === firstWorkbookSteps.length - 1}
              variant="outline"
              className={`h-12 px-6 transition-all duration-200 ${
                isKidsMode
                  ? 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50'
                  : 'border-gray-200 hover:bg-gray-50 disabled:opacity-50'
              }`}
            >
              {isKidsMode ? 'Next ➡️' : 'Next Step'}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          {/* Upload Section */}
          <div className={`border-0 shadow-xl rounded-2xl ${
            isKidsMode
              ? 'bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200'
              : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <h3 className={`flex items-center gap-3 text-2xl font-bold mb-2 ${isKidsMode ? 'text-purple-700' : 'text-gray-900'}`}>
                <div className={`p-2 rounded-full ${isKidsMode ? 'bg-purple-100' : 'bg-green-100'}`}>
                  <Upload className={`h-6 w-6 ${isKidsMode ? 'text-purple-600' : 'text-green-600'}`} />
                </div>
                {isKidsMode ? '📸 Show Off Your Amazing Work!' : 'Upload Your Completed Worksheet'}
              </h3>
              <p className={`text-lg mb-6 ${isKidsMode ? 'text-purple-600' : 'text-gray-600'}`}>
                {isKidsMode
                  ? 'Take a super cool photo of your finished worksheet and share it with us! We can\'t wait to see how awesome you did! 🌟'
                  : 'Take a clear photo or scan of your completed worksheet for progress tracking'}
              </p>
            </div>
            <div className="space-y-6 p-6 pt-0">
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                uploading={uploading}
                disabled={uploadSuccess}
                isKidsMode={isKidsMode}
              />
              {selectedFile && !uploadSuccess && !showGrading && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    size="lg"
                    className={`flex-1 h-14 text-lg font-bold transition-all duration-200 ${
                      isKidsMode
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {isKidsMode ? '🔍 Analyzing your amazing work...' : 'Analyzing worksheet...'}
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-3" />
                        {isKidsMode ? '🎯 Grade My Work!' : 'Grade Worksheet'}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleFileRemove}
                    disabled={uploading}
                    variant="outline"
                    className={`h-14 px-6 ${
                      isKidsMode
                        ? 'border-purple-200 text-purple-700 hover:bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {isKidsMode ? '❌ Remove' : 'Cancel'}
                  </Button>
                </div>
              )}
              {/* Photo Tips */}
              <div className={`p-6 rounded-xl border-2 ${
                isKidsMode
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isKidsMode ? 'text-orange-700' : 'text-blue-800'}`}>
                  {isKidsMode ? '📸 Super Photo Tips! 🌟' : '📸 Photo Tips for Best Results'}
                </h4>
                <div className={`grid md:grid-cols-2 gap-4 text-sm ${isKidsMode ? 'text-orange-700' : 'text-blue-700'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'}`}>
                        ☀️
                      </div>
                      <span className="font-medium">
                        {isKidsMode ? 'Use bright, happy light!' : 'Ensure good lighting'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'}`}>
                        📐
                      </div>
                      <span className="font-medium">
                        {isKidsMode ? 'Hold your camera straight!' : 'Take photo straight on'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'}`}>
                        🔍
                      </div>
                      <span className="font-medium">
                        {isKidsMode ? 'Make sure everything is clear!' : 'Ensure text is visible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'}`}>
                        📄
                      </div>
                      <span className="font-medium">
                        {isKidsMode ? 'Include your whole worksheet!' : 'Include entire worksheet'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Steps Nav */}
          <div className={`border-0 shadow-xl rounded-2xl ${isKidsMode ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200' : 'bg-white border border-gray-200'}`}>
            <div className="p-6">
              <h3 className={`flex items-center gap-2 font-bold text-lg mb-2 ${isKidsMode ? 'text-indigo-700' : 'text-gray-900'}`}>
                <div className={`p-2 rounded-full ${isKidsMode ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  <Star className="h-5 w-5" />
                </div>
                {isKidsMode ? '🎮 Quick Jump!' : 'Quick Navigation'}
              </h3>
              <p className={`text-sm mb-4 ${isKidsMode ? 'text-indigo-600' : 'text-gray-600'}`}>
                {isKidsMode ? 'Jump to any step you want!' : 'Navigate between worksheets'}
              </p>
            </div>
            <div className="space-y-2 p-6 pt-0">
              {firstWorkbookSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    index === currentStep
                      ? isKidsMode
                        ? 'border-purple-400 bg-purple-100 text-purple-800 shadow-lg transform scale-105'
                        : 'border-green-500 bg-green-50 text-green-700'
                      : completedSteps.has(step.id)
                      ? isKidsMode
                        ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-green-200 bg-green-50 text-green-700'
                      : isKidsMode
                        ? 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-gray-700'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl ${completedSteps.has(step.id) ? 'animate-bounce' : ''}`}>
                      {completedSteps.has(step.id) ? '⭐' : step.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {isKidsMode ? step.friendlyTitle : `Step ${index + 1}`}
                      </p>
                      <p className="text-xs opacity-75">{step.estimatedTime}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Encouragement */}
          {isKidsMode && (
            <div className="border-0 shadow-xl bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200 rounded-2xl">
              <div className="pt-6 text-center p-6">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-bold text-lg text-pink-700 mb-2">
                  You're Doing Amazing!
                </h3>
                <p className="text-pink-600 text-sm mb-4">
                  Every line you draw makes you a better writer! Keep up the fantastic work!
                </p>
                <div className="flex justify-center gap-2">
                  {['💪', '🎨', '✨', '🏆', '🌈'].map((emoji, index) => (
                    <span key={index} className="text-xl animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Tips Card */}
          <div className={`border-0 shadow-xl rounded-2xl ${isKidsMode ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}>
            <div className="p-6">
              <h3 className={`flex items-center gap-2 font-bold text-lg mb-4 ${isKidsMode ? 'text-emerald-700' : 'text-amber-800'}`}>
                <Star className="h-5 w-5" />
                {isKidsMode ? '💡 Super Secret Tips!' : '💡 Practice Tips'}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <ul className={`space-y-3 text-sm ${isKidsMode ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isKidsMode ? (
                  <>
                    <li className="flex items-center gap-3"><span className="text-lg">🪑</span><span className="font-medium">Sit up tall like a superhero!</span></li>
                    <li className="flex items-center gap-3"><span className="text-lg">✏️</span><span className="font-medium">Hold your pencil like you're holding a butterfly!</span></li>
                    <li className="flex items-center gap-3"><span className="text-lg">🐢</span><span className="font-medium">Go slow and steady like a wise turtle!</span></li>
                    <li className="flex items-center gap-3"><span className="text-lg">🎉</span><span className="font-medium">Celebrate every line you draw!</span></li>
                    <li className="flex items-center gap-3"><span className="text-lg">☀️</span><span className="font-medium">Practice a little bit every sunny day!</span></li>
                  </>
                ) : (
                  <>
                    <li>• Find a comfortable, well-lit workspace</li>
                    <li>• Hold your pencil with a relaxed grip</li>
                    <li>• Take breaks every 10-15 minutes</li>
                    <li>• Focus on accuracy over speed</li>
                    <li>• Practice regularly for best results</li>
                    <li>• Upload completed worksheets to track progress</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          {/* Completed Steps Summary */}
          {completedSteps.size > 0 && (
            <div className={`border-0 shadow-lg rounded-2xl ${isKidsMode ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200' : 'bg-white border border-gray-200'}`}>
              <div className="p-6">
                <h3 className="flex items-center gap-2 font-bold text-lg mb-4">
                  <Award className="h-5 w-5 text-yellow-500" />
                  {isKidsMode ? '🏆 My Achievements!' : 'Completed Steps'}
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {isKidsMode ? 'Steps Completed:' : 'Progress:'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${isKidsMode ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                      {completedSteps.size} / {firstWorkbookSteps.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${isKidsMode ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-green-500'}`}
                      style={{ width: `${(completedSteps.size / firstWorkbookSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  {completedSteps.size === firstWorkbookSteps.length && (
                    <div className={`text-center py-3 ${isKidsMode ? 'text-green-700 font-bold' : 'text-green-600 font-medium'}`}>
                      {isKidsMode ? '🎉 Congratulations! You completed all steps! 🌟' : '🎉 Congratulations! All steps completed!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </PageLayout>
);
}