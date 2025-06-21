'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Database, Tables } from '@/lib/database.types';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Upload, 
  Star,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Zap,
  Play,
  Eye,
  Printer,
  Clock,
  Award,
  TrendingUp,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Heart,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

type Profile = Tables<'profiles'>;

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
  emoji: string;
  color: string;
  completed?: boolean;
}

const firstWorkbookSteps: WorksheetStep[] = [
  {
    id: 'vertical-lines',
    title: 'Worksheet 1.1: Vertical Lines',
    friendlyTitle: 'Straight Up Lines!',
    description: 'Start with basic vertical lines from top to bottom. Master downward stroke control.',
    kidsDescription: 'Draw straight lines going up and down, like tall trees or birthday candles! 🕯️',
    level: 1,
    worksheetUrl: '/worksheets/vertical-lines.html',
    skills: ['Drawing straight', 'Top to bottom', 'Holding pencil'],
    estimatedTime: '10-15 minutes',
    emoji: '📏',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'horizontal-lines',
    title: 'Worksheet 1.2: Horizontal Lines',
    friendlyTitle: 'Side to Side Lines!',
    description: 'Practice horizontal lines from left to right. Build reading and writing flow.',
    kidsDescription: 'Draw lines that go sideways, like a sleeping snake or a calm ocean! 🌊',
    level: 1,
    worksheetUrl: '/worksheets/horizontal-lines.html',
    skills: ['Left to right', 'Reading direction', 'Smooth lines'],
    estimatedTime: '10-15 minutes',
    emoji: '➡️',
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'circles',
    title: 'Worksheet 1.3: Circles',
    friendlyTitle: 'Round and Round!',
    description: 'Learn circular motions essential for letters like o, a, and d.',
    kidsDescription: 'Make perfect circles like bubbles, donuts, or the sun! Practice going round and round! ☀️',
    level: 1,
    worksheetUrl: '/worksheets/circles.html',
    skills: ['Circular motions', 'Smooth curves', 'Hand control'],
    estimatedTime: '15-20 minutes',
    emoji: '⭕',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'diagonal-lines',
    title: 'Worksheet 1.4: Diagonal Lines',
    friendlyTitle: 'Slanted Lines!',
    description: 'Master diagonal strokes for letters like A, V, X, and k.',
    kidsDescription: 'Draw slanted lines like slides at the playground or roof tops! 🏠',
    level: 1,
    worksheetUrl: '/worksheets/diagonal-lines.html',
    skills: ['Diagonal drawing', 'Angles', 'Letter shapes'],
    estimatedTime: '15-20 minutes',
    emoji: '📐',
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'intersecting-lines',
    title: 'Worksheet 1.5: Intersecting Lines',
    friendlyTitle: 'Crossing Lines!',
    description: 'Practice crosses and plus signs with precision.',
    kidsDescription: 'Make crossing lines like a tic-tac-toe game or a treasure map X! 🗺️',
    level: 1,
    worksheetUrl: '/worksheets/intersecting-lines.html',
    skills: ['Crossing lines', 'Precision', 'Plus signs'],
    estimatedTime: '15-20 minutes',
    emoji: '➕',
    color: 'from-red-400 to-pink-500'
  },
  {
    id: 'basic-shapes',
    title: 'Worksheet 1.6: Basic Shapes',
    friendlyTitle: 'Fun Shapes!',
    description: 'Combine strokes to create squares, triangles, and rectangles.',
    kidsDescription: 'Draw squares like windows, triangles like pizza slices, and rectangles like doors! 🏠',
    level: 1,
    worksheetUrl: '/worksheets/basic-shapes.html',
    skills: ['Shape drawing', 'Combining lines', 'Geometric fun'],
    estimatedTime: '20-25 minutes',
    emoji: '🔷',
    color: 'from-indigo-400 to-blue-500'
  },
  {
    id: 'continuous-curves',
    title: 'Worksheet 1.7: Continuous Curves',
    friendlyTitle: 'Wavy Lines!',
    description: 'Develop fluidity with wavy lines and loops for cursive preparation.',
    kidsDescription: 'Draw wavy lines like ocean waves, roller coasters, or a snake dancing! 🐍',
    level: 1,
    worksheetUrl: '/worksheets/continuous-curves.html',
    skills: ['Wavy lines', 'Smooth flow', 'Cursive prep'],
    estimatedTime: '20-25 minutes',
    emoji: '🌊',
    color: 'from-teal-400 to-cyan-500'
  }
];

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  uploading: boolean;
  disabled?: boolean;
  isKidsMode?: boolean;
}

function FileUpload({ 
  onFileSelect, 
  onFileRemove, 
  selectedFile, 
  uploading, 
  disabled = false,
  isKidsMode = false
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
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
      <div className={`border-2 border-dashed rounded-xl p-6 ${
        isKidsMode 
          ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' 
          : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              isKidsMode ? 'bg-purple-200' : 'bg-blue-100'
            }`}>
              <ImageIcon className={`h-8 w-8 ${
                isKidsMode ? 'text-purple-600' : 'text-blue-500'
              }`} />
            </div>
            <div>
              <p className="font-medium text-lg">
                {isKidsMode ? '📸 Your awesome photo!' : selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {!uploading && (
            <Button
              onClick={onFileRemove}
              variant="outline"
              size="sm"
              className={isKidsMode ? 'hover:bg-red-100' : ''}
            >
              <X className="h-4 w-4" />
              {isKidsMode && <span className="ml-1">Remove</span>}
            </Button>
          )}
        </div>
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm font-medium">
                {isKidsMode ? '🚀 Uploading your amazing work...' : 'Uploading...'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className={`h-3 rounded-full animate-pulse ${
                isKidsMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-blue-600'
              }`} style={{ width: '70%' }}></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? isKidsMode 
              ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 scale-105' 
              : 'border-blue-400 bg-blue-50'
            : isKidsMode
              ? 'border-purple-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:scale-102'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !uploading) {
            document.getElementById('file-upload')?.click();
          }
        }}
      >
        <div className={`mx-auto mb-4 p-4 rounded-full ${
          isKidsMode 
            ? 'bg-gradient-to-br from-purple-200 to-pink-200' 
            : 'bg-gray-100'
        }`}>
          <Upload className={`h-12 w-12 mx-auto ${
            isKidsMode ? 'text-purple-600' : 'text-gray-400'
          }`} />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isKidsMode 
            ? dragActive 
              ? '📸 Drop your photo here!' 
              : '📷 Add Your Worksheet Photo!'
            : dragActive 
              ? 'Drop your image here' 
              : 'Upload worksheet image'
          }
        </h3>
        <p className="text-gray-600 mb-4">
          {isKidsMode 
            ? 'Drag and drop your photo here, or click to choose one from your device! 🖱️'
            : 'Drag and drop or click to select an image file'
          }
        </p>
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
          isKidsMode 
            ? 'bg-purple-100 text-purple-700 border border-purple-200'
            : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}>
          {isKidsMode ? '✨ Photos (JPG, PNG) up to 10MB' : 'Supports JPEG, PNG up to 10MB'}
        </div>

        <Input
          id="file-upload"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleChange}
          className="hidden"
          disabled={disabled || uploading}
        />
      </div>

      {error && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${
          isKidsMode 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
        await fetchProfile(user.id);
      } catch (error: any) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setUploadError(isKidsMode ? '😅 Please pick a photo first!' : 'No file selected or user not authenticated');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const timestamp = new Date().getTime();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${currentWorksheet.id}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(fileName);

      setUploadSuccess(true);
      setSelectedFile(null);

      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.add(firstWorkbookSteps[currentStep].id);
        return newSet;
      });
      
      setTimeout(() => {
        if (currentStep < firstWorkbookSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
        setUploadSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(isKidsMode 
        ? '😞 Oops! Something went wrong. Can you try again?' 
        : error.message || 'An unexpected error occurred during upload'
      );
    } finally {
      setUploading(false);
    }
  };

  const openWorksheet = (worksheetUrl: string) => {
    window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStep < firstWorkbookSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isKidsMode = profile?.display_mode === 'kids';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading practice session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentWorksheet = firstWorkbookSteps[currentStep];
  const progressPercentage = ((completedSteps.size) / firstWorkbookSteps.length) * 100;
  const isCompleted = completedSteps.has(currentWorksheet.id);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isKidsMode 
        ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50' 
        : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              size="sm" 
              className={`${
                isKidsMode 
                  ? 'bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800' 
                  : 'hover:bg-primary/10'
              } transition-all duration-200`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isKidsMode ? '🏠 Back Home' : 'Back to Dashboard'}
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className={`text-4xl font-bold ${
              isKidsMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'text-foreground'
            }`}>
              {isKidsMode ? '🎨 Handwriting Adventure!' : 'First Workbook Practice'}
            </h1>
            <p className={`mt-2 text-lg ${
              isKidsMode ? 'text-purple-700' : 'text-muted-foreground'
            }`}>
              {isKidsMode 
                ? 'Let\'s practice writing and have tons of fun! 🚀✨'
                : 'Master the fundamentals with our structured practice program'
              }
            </p>
          </div>
        </div>

        {/* Progress Star Bar */}
        {isKidsMode && (
          <Card className="border-0 shadow-xl mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
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
                      {completedSteps.has(step.id) ? '⭐' : step.emoji}
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
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className={`mb-6 p-6 rounded-xl flex items-center gap-4 animate-bounce ${
            isKidsMode 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300' 
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          }`}>
            <div className="flex-shrink-0">
              {isKidsMode ? (
                <div className="text-4xl">🎉</div>
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <p className={`font-bold text-lg ${
                isKidsMode ? 'text-green-800' : 'text-green-800 dark:text-green-200'
              }`}>
                {isKidsMode ? '🌟 Fantastic work! You\'re amazing!' : 'Upload Successful!'}
              </p>
              <p className={`${
                isKidsMode ? 'text-green-700' : 'text-green-700 dark:text-green-300'
              }`}>
                {isKidsMode 
                  ? 'Your beautiful work has been saved! Moving to the next adventure... 🚀'
                  : 'Your worksheet has been uploaded successfully. Moving to next step...'
                }
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className={`mb-6 p-6 rounded-xl flex items-center gap-4 ${
            isKidsMode 
              ? 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex-shrink-0">
              {isKidsMode ? (
                <div className="text-4xl">😅</div>
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className={`font-bold text-lg ${
                isKidsMode ? 'text-red-800' : 'text-red-800 dark:text-red-200'
              }`}>
                {isKidsMode ? 'Oopsie! Let\'s try that again!' : 'Upload Failed'}
              </p>
              <p className={`${
                isKidsMode ? 'text-red-700' : 'text-red-700 dark:text-red-300'
              }`}>
                {uploadError}
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Current Worksheet Card */}
            <Card className={`border-0 shadow-xl mb-8 overflow-hidden ${
              isKidsMode 
                ? `bg-gradient-to-br ${currentWorksheet.color} text-white` 
                : ''
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`text-6xl ${isKidsMode ? 'animate-bounce' : ''}`}>
                      {currentWorksheet.emoji}
                    </div>
                    <div>
                      <CardTitle className={`text-2xl font-bold ${
                        isKidsMode ? 'text-white' : 'text-primary'
                      }`}>
                        {isKidsMode ? currentWorksheet.friendlyTitle : currentWorksheet.title}
                      </CardTitle>
                      <CardDescription className={`mt-2 text-lg ${
                        isKidsMode ? 'text-white/90' : ''
                      }`}>
                        {isKidsMode ? currentWorksheet.kidsDescription : currentWorksheet.description}
                      </CardDescription>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Star className="h-6 w-6 fill-current" />
                      <span className="font-bold">Completed!</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {currentWorksheet.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`text-sm px-3 py-1 ${
                        isKidsMode 
                          ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' 
                          : ''
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <div className={`flex items-center gap-2 ${
                    isKidsMode ? 'text-white/90' : 'text-muted-foreground'
                  }`}>
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">{currentWorksheet.estimatedTime}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    isKidsMode ? 'text-white/90' : 'text-muted-foreground'
                  }`}>
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">Step {currentStep + 1} of {firstWorkbookSteps.length}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => openWorksheet(currentWorksheet.worksheetUrl)}
                    className={`flex-1 h-12 text-lg font-bold ${
                      isKidsMode 
                        ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200' 
                        : ''
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
                        : ''
                    }`}
                  >
                    <Printer className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Button
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                variant="outline"
                className={`h-12 px-6 ${
                  isKidsMode 
                    ? 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50' 
                    : ''
                }`}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                {isKidsMode ? '⬅️ Previous' : 'Previous Step'}
              </Button>

              <div className={`text-center px-4 py-2 rounded-full ${
                isKidsMode 
                  ? 'bg-white/80 text-purple-700 font-bold' 
                  : 'bg-primary/10 text-primary font-medium'
              }`}>
                {currentStep + 1} of {firstWorkbookSteps.length}
              </div>

              <Button
                onClick={goToNextStep}
                disabled={currentStep === firstWorkbookSteps.length - 1}
                variant="outline"
                className={`h-12 px-6 ${
                  isKidsMode 
                    ? 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50' 
                    : ''
                }`}
              >
                {isKidsMode ? 'Next ➡️' : 'Next Step'}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Upload Section */}
            <Card className={`border-0 shadow-xl ${
              isKidsMode 
                ? 'bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200' 
                : ''
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 text-2xl ${
                  isKidsMode ? 'text-purple-700' : 'text-primary'
                }`}>
                  <div className={`p-2 rounded-full ${
                    isKidsMode ? 'bg-purple-100' : 'bg-primary/10'
                  }`}>
                    <Upload className="h-6 w-6" />
                  </div>
                  {isKidsMode ? '📸 Show Off Your Amazing Work!' : 'Upload Your Completed Worksheet'}
                </CardTitle>
                <CardDescription className={`text-lg ${
                  isKidsMode ? 'text-purple-600' : ''
                }`}>
                  {isKidsMode 
                    ? 'Take a super cool photo of your finished worksheet and share it with us! We can\'t wait to see how awesome you did! 🌟'
                    : 'Take a clear photo or scan of your completed worksheet for progress tracking'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={selectedFile}
                  uploading={uploading}
                  disabled={uploadSuccess}
                  isKidsMode={isKidsMode}
                />

                {selectedFile && !uploadSuccess && (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      size="lg"
                      className={`flex-1 h-14 text-lg font-bold ${
                        isKidsMode 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200' 
                          : ''
                      }`}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          {isKidsMode ? '🚀 Uploading your masterpiece...' : 'Uploading...'}
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-3" />
                          {isKidsMode ? '✨ Submit My Amazing Work!' : 'Submit Worksheet'}
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
                          : ''
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
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}>
                  <h4 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                    isKidsMode ? 'text-orange-700' : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {isKidsMode ? '📸 Super Photo Tips! 🌟' : '📸 Photo Tips for Best Results'}
                  </h4>
                  <div className={`grid md:grid-cols-2 gap-4 text-sm ${
                    isKidsMode ? 'text-orange-700' : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'
                        }`}>
                          ☀️
                        </div>
                        <span className="font-medium">
                          {isKidsMode ? 'Use bright, happy light!' : 'Ensure good lighting'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'
                        }`}>
                          📐
                        </div>
                        <span className="font-medium">
                          {isKidsMode ? 'Hold your camera straight!' : 'Take photo straight on'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'
                        }`}>
                          🔍
                        </div>
                        <span className="font-medium">
                          {isKidsMode ? 'Make sure everything is clear!' : 'Ensure text is visible'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          isKidsMode ? 'bg-yellow-200' : 'bg-blue-100'
                        }`}>
                          📄
                        </div>
                        <span className="font-medium">
                          {isKidsMode ? 'Include your whole worksheet!' : 'Include entire worksheet'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Steps Navigation */}
            <Card className={`border-0 shadow-xl ${
              isKidsMode 
                ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200' 
                : ''
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  isKidsMode ? 'text-indigo-700' : ''
                }`}>
                  <div className={`p-2 rounded-full ${
                    isKidsMode ? 'bg-indigo-100' : 'bg-primary/10'
                  }`}>
                    <Star className="h-5 w-5" />
                  </div>
                  {isKidsMode ? '🎮 Quick Jump!' : 'Quick Navigation'}
                </CardTitle>
                <CardDescription className={isKidsMode ? 'text-indigo-600' : ''}>
                  {isKidsMode ? 'Jump to any step you want!' : 'Navigate between worksheets'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {firstWorkbookSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      index === currentStep
                        ? isKidsMode
                          ? 'border-purple-400 bg-purple-100 text-purple-800 shadow-lg transform scale-105'
                          : 'border-primary bg-primary/5 text-primary'
                        : completedSteps.has(step.id)
                        ? isKidsMode
                          ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                          : 'border-green-200 bg-green-50 dark:bg-green-900/20 text-green-700'
                        : isKidsMode
                          ? 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-gray-700'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${
                        completedSteps.has(step.id) ? 'animate-bounce' : ''
                      }`}>
                        {completedSteps.has(step.id) ? '⭐' : step.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {isKidsMode ? step.friendlyTitle : `Step ${index + 1}`}
                        </p>
                        <p className="text-xs opacity-75">
                          {step.estimatedTime}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Encouragement Card */}
            {isKidsMode && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">🌟</div>
                  <h3 className="font-bold text-lg text-pink-700 mb-2">
                    You're Doing Amazing!
                  </h3>
                  <p className="text-pink-600 text-sm mb-4">
                    Every line you draw makes you a better writer! Keep up the fantastic work!
                  </p>
                  <div className="flex justify-center gap-2">
                    {['💪', '🎨', '✨', '🏆', '🌈'].map((emoji, index) => (
                      <span 
                        key={index} 
                        className="text-xl animate-bounce" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className={`border-0 shadow-xl ${
              isKidsMode 
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200' 
                : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  isKidsMode ? 'text-emerald-700' : 'text-amber-800 dark:text-amber-200'
                }`}>
                  <Star className="h-5 w-5" />
                  {isKidsMode ? '💡 Super Secret Tips!' : '💡 Practice Tips'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className={`space-y-3 text-sm ${
                  isKidsMode ? 'text-emerald-700' : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {isKidsMode ? (
                    <>
                      <li className="flex items-center gap-3">
                        <span className="text-lg">🪑</span>
                        <span className="font-medium">Sit up tall like a superhero!</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-lg">✏️</span>
                        <span className="font-medium">Hold your pencil like you're holding a butterfly!</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-lg">🐢</span>
                        <span className="font-medium">Go slow and steady like a wise turtle!</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-lg">🎉</span>
                        <span className="font-medium">Celebrate every line you draw!</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-lg">☀️</span>
                        <span className="font-medium">Practice a little bit every sunny day!</span>
                      </li>
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
              </CardContent>
            </Card>

            {/* Completed Steps Summary */}
            {completedSteps.size > 0 && (
              <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    {isKidsMode ? '🏆 My Achievements!' : 'Completed Steps'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {isKidsMode ? 'Steps Completed:' : 'Progress:'}
                      </span>
                      <Badge variant="secondary">
                        {completedSteps.size} / {firstWorkbookSteps.length}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isKidsMode 
                            ? 'bg-gradient-to-r from-green-400 to-blue-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(completedSteps.size / firstWorkbookSteps.length) * 100}%` }}
                      ></div>
                    </div>
                    {completedSteps.size === firstWorkbookSteps.length && (
                      <div className={`text-center py-3 ${
                        isKidsMode 
                          ? 'text-green-700 font-bold' 
                          : 'text-green-600 font-medium'
                      }`}>
                        {isKidsMode ? '🎉 Congratulations! You completed all steps! 🌟' : '🎉 Congratulations! All steps completed!'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}