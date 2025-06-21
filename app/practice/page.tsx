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
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

type Profile = Tables<'profiles'>;

interface WorksheetStep {
  id: string;
  title: string;
  description: string;
  level: number;
  worksheetUrl: string;
  skills: string[];
  estimatedTime: string;
  completed?: boolean;
}

const firstWorkbookSteps: WorksheetStep[] = [
  {
    id: 'vertical-lines',
    title: 'Worksheet 1.1: Vertical Lines',
    description: 'Start with basic vertical lines from top to bottom. Master downward stroke control.',
    level: 1,
    worksheetUrl: '/worksheets/vertical-lines.html',
    skills: ['Downward stroke control', 'Starting at the top', 'Motor control'],
    estimatedTime: '10-15 minutes'
  },
  {
    id: 'horizontal-lines',
    title: 'Worksheet 1.2: Horizontal Lines',
    description: 'Practice horizontal lines from left to right. Build reading and writing flow.',
    level: 1,
    worksheetUrl: '/worksheets/horizontal-lines.html',
    skills: ['Left-to-right progression', 'Reading flow', 'Line control'],
    estimatedTime: '10-15 minutes'
  },
  {
    id: 'circles',
    title: 'Worksheet 1.3: Circles',
    description: 'Learn circular motions essential for letters like o, a, and d.',
    level: 1,
    worksheetUrl: '/worksheets/circles.html',
    skills: ['Circular motor patterns', 'Hand-eye coordination', 'Smooth curves'],
    estimatedTime: '15-20 minutes'
  },
  {
    id: 'diagonal-lines',
    title: 'Worksheet 1.4: Diagonal Lines',
    description: 'Master diagonal strokes for letters like A, V, X, and k.',
    level: 1,
    worksheetUrl: '/worksheets/diagonal-lines.html',
    skills: ['Diagonal control', 'Letter preparation', 'Angle consistency'],
    estimatedTime: '15-20 minutes'
  },
  {
    id: 'intersecting-lines',
    title: 'Worksheet 1.5: Intersecting Lines',
    description: 'Practice crosses and plus signs with precision.',
    level: 1,
    worksheetUrl: '/worksheets/intersecting-lines.html',
    skills: ['Precision', 'Letter formation', 'Intersection control'],
    estimatedTime: '15-20 minutes'
  },
  {
    id: 'basic-shapes',
    title: 'Worksheet 1.6: Basic Shapes',
    description: 'Combine strokes to create squares, triangles, and rectangles.',
    level: 1,
    worksheetUrl: '/worksheets/basic-shapes.html',
    skills: ['Shape recognition', 'Stroke combination', 'Geometric forms'],
    estimatedTime: '20-25 minutes'
  },
  {
    id: 'continuous-curves',
    title: 'Worksheet 1.7: Continuous Curves',
    description: 'Develop fluidity with wavy lines and loops for cursive preparation.',
    level: 1,
    worksheetUrl: '/worksheets/continuous-curves.html',
    skills: ['Fluidity of motion', 'Cursive preparation', 'Smooth transitions'],
    estimatedTime: '20-25 minutes'
  }
];

// Simple File Upload Component
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  uploading: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
}

function FileUpload({ 
  onFileSelect, 
  onFileRemove, 
  selectedFile, 
  uploading, 
  disabled = false,
  accept = "image/jpeg,image/png,image/jpg",
  maxSize = 10 
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
    
    if (disabled || uploading) return;
    
    const files = e.dataTransfer.files;
    handleFileSelection(files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled || uploading) return;
    
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);
    
    // Validate file type
    const validTypes = accept.split(',').map(t => t.trim());
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or JPG)');
      return;
    }
    
    // Validate file size (convert MB to bytes)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }
    
    onFileSelect(file);
  };

  if (selectedFile) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {!uploading && !disabled && (
            <Button
              onClick={onFileRemove}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {uploading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">
          {dragActive ? 'Drop your image here' : 'Upload worksheet image'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop or click to select an image file
        </p>
        <p className="text-xs text-gray-400">
          Supports JPEG, PNG, JPG up to {maxSize}MB
        </p>
        
        <Input
          id="file-upload"
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled || uploading}
        />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Debug logging function
  const addDebugInfo = (info: string) => {
    console.log('PRACTICE DEBUG:', info);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        addDebugInfo('Starting authentication check');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          addDebugInfo(`Auth error: ${error.message}`);
          router.push('/login');
          return;
        }
        
        if (!user) {
          addDebugInfo('No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        addDebugInfo(`User authenticated: ${user.email}`);
        setUser(user);
        await fetchProfile(user.id);
      } catch (error: any) {
        addDebugInfo(`Unexpected error: ${error.message}`);
        router.push('/login');
      } finally {
        addDebugInfo('Authentication complete');
        setLoading(false);
      }
    };

    getUser();
  }, [supabase.auth, router]);

  const fetchProfile = async (userId: string) => {
    try {
      addDebugInfo('Fetching user profile');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        addDebugInfo(`Profile fetch error: ${error.message}`);
        console.error('Error fetching profile:', error);
      } else if (data) {
        addDebugInfo('Profile loaded successfully');
        setProfile(data);
      } else {
        addDebugInfo('No profile found, using defaults');
      }
    } catch (error: any) {
      addDebugInfo(`Profile fetch failed: ${error.message}`);
      console.error('Error fetching profile:', error);
    }
  };

  const handleFileSelect = (file: File) => {
    addDebugInfo(`File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleFileRemove = () => {
    addDebugInfo('File removed');
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setUploadError('No file selected or user not authenticated');
      return;
    }

    addDebugInfo('Starting file upload');
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Create a unique filename
      const timestamp = new Date().getTime();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${currentWorksheet.id}/${timestamp}.${fileExt}`;
      
      addDebugInfo(`Uploading file: ${fileName}`);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        addDebugInfo(`Upload error: ${uploadError.message}`);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      addDebugInfo('File uploaded successfully to storage');

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(fileName);

      addDebugInfo(`File available at: ${publicUrl}`);

      // For now, we'll just simulate saving to a submissions table
      // In a real implementation, you'd save this to your database
      addDebugInfo('Simulating database save (no submissions table yet)');

      setUploadSuccess(true);
      setSelectedFile(null);
      
      // Mark current step as completed
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.add(firstWorkbookSteps[currentStep].id);
        return newSet;
      });
      
      addDebugInfo(`Step ${currentStep + 1} marked as completed`);
      
      // Auto-advance to next step after a delay
      setTimeout(() => {
        if (currentStep < firstWorkbookSteps.length - 1) {
          setCurrentStep(currentStep + 1);
          addDebugInfo(`Advanced to step ${currentStep + 2}`);
        } else {
          addDebugInfo('All steps completed!');
        }
        setUploadSuccess(false);
      }, 3000);

    } catch (error: any) {
      addDebugInfo(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
      setUploadError(error.message || 'An unexpected error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const openWorksheet = (worksheetUrl: string) => {
    addDebugInfo(`Opening worksheet: ${worksheetUrl}`);
    window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  };

  const isKidsMode = profile?.display_mode === 'kids';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground mb-4">Loading practice session...</p>
          
          {/* Debug information */}
          <div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs space-y-1">
            <div className="font-semibold mb-2">Debug Log:</div>
            {debugInfo.map((info, index) => (
              <div key={index} className="text-gray-600 dark:text-gray-400">{info}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentWorksheet = firstWorkbookSteps[currentStep];
  const progressPercentage = ((currentStep + (completedSteps.has(currentWorksheet.id) ? 1 : 0)) / firstWorkbookSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className={`hover:bg-primary/10 transition-colors ${isKidsMode ? 'button' : ''}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isKidsMode ? 'Back to Dashboard 🏠' : 'Back to Dashboard'}
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className={`text-3xl font-bold text-foreground ${isKidsMode ? 'wiggle' : ''}`}>
              {isKidsMode ? '📚 First Workbook Practice! 🎨' : 'First Workbook Practice'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isKidsMode 
                ? 'Start your handwriting journey with fun exercises! 🚀'
                : 'Master the fundamentals with our structured practice program'
              }
            </p>
          </div>
        </div>

        {/* Debug Panel (only in development) */}
        {debugInfo.length > 0 && process.env.NODE_ENV === 'development' && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800 dark:text-blue-200">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                {debugInfo.map((info, index) => (
                  <div key={index}>{info}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        <Card className={`border-0 shadow-lg mb-8 ${isKidsMode ? 'card bounce-in' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {isKidsMode ? '🎯 My Progress!' : 'Your Progress'}
            </CardTitle>
            <CardDescription>
              {isKidsMode 
                ? `You're on step ${currentStep + 1} of ${firstWorkbookSteps.length}! Keep going! 💪`
                : `Step ${currentStep + 1} of ${firstWorkbookSteps.length} in the First Workbook`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  isKidsMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-primary'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{isKidsMode ? 'Just started! 🌱' : 'Getting Started'}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
              <span>{isKidsMode ? 'Expert! 🏆' : 'Mastery'}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Worksheet */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success Message */}
            {uploadSuccess && (
              <div className={`p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 ${isKidsMode ? 'bounce-in' : ''}`}>
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    {isKidsMode ? '🎉 Awesome work! Upload successful!' : 'Upload Successful!'}
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    {isKidsMode 
                      ? 'Your worksheet is saved! Moving to the next step... 🚀'
                      : 'Your worksheet has been uploaded successfully. Moving to next step...'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    {isKidsMode ? '😞 Oops! Upload failed' : 'Upload Failed'}
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">{uploadError}</p>
                </div>
              </div>
            )}

            {/* Current Worksheet Card */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-primary">
                      {isKidsMode ? `🎯 ${currentWorksheet.title}` : currentWorksheet.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {currentWorksheet.description}
                    </CardDescription>
                  </div>
                  <Badge className="ml-4">
                    Level {currentWorksheet.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {currentWorksheet.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className={`text-xs ${isKidsMode ? 'badge' : ''}`}>
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{currentWorksheet.estimatedTime}</span>
                  </div>
                  {completedSteps.has(currentWorksheet.id) && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>{isKidsMode ? 'Completed! 🎉' : 'Completed'}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => openWorksheet(currentWorksheet.worksheetUrl)}
                    className={`flex-1 ${isKidsMode ? 'button big-button' : ''}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isKidsMode ? 'Open Worksheet! 📄' : 'Open Worksheet'}
                  </Button>
                  <Button
                    onClick={() => openWorksheet(currentWorksheet.worksheetUrl)}
                    variant="outline"
                    size="icon"
                    className={isKidsMode ? 'button' : ''}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  {isKidsMode ? '📸 Upload Your Completed Work!' : 'Upload Your Completed Worksheet'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode 
                    ? 'Take a photo of your finished worksheet and upload it here! 📱'
                    : 'Take a clear photo or scan of your completed worksheet'
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
                  accept="image/jpeg,image/png,image/jpg"
                  maxSize={10}
                />

                {selectedFile && !uploadSuccess && (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className={`flex-1 ${isKidsMode ? 'button big-button' : ''}`}
                      size="lg"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {isKidsMode ? 'Uploading... 🚀' : 'Uploading...'}
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {isKidsMode ? 'Submit Work! 🔍' : 'Submit Worksheet'}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleFileRemove}
                      disabled={uploading}
                      variant="outline"
                      className={isKidsMode ? 'button' : ''}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                <div className={`p-4 rounded-lg border ${
                  isKidsMode 
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    isKidsMode ? 'text-purple-800' : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {isKidsMode ? '📸 Photo Tips for Best Results! 🌟' : '📸 Photo Tips for Best Results'}
                  </h4>
                  <ul className={`text-sm space-y-1 ${
                    isKidsMode ? 'text-purple-700' : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    <li>• {isKidsMode ? '☀️ Make sure there\'s good light!' : 'Ensure good lighting - avoid shadows'}</li>
                    <li>• {isKidsMode ? '📐 Take the photo straight on!' : 'Take the photo straight on (not at an angle)'}</li>
                    <li>• {isKidsMode ? '🔍 Make sure everything is clear!' : 'Make sure all text is clearly visible'}</li>
                    <li>• {isKidsMode ? '📄 Include the whole worksheet!' : 'Include the entire worksheet in the frame'}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {isKidsMode ? '🎮 Worksheet Steps' : 'Worksheet Steps'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {firstWorkbookSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      index === currentStep
                        ? 'border-primary bg-primary/5'
                        : completedSteps.has(step.id)
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                        : 'border-border hover:border-primary/50'
                    } ${isKidsMode ? 'hover:scale-105' : ''}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : completedSteps.has(step.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {completedSteps.has(step.id) ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {isKidsMode ? step.title.replace('Worksheet ', '🎯 ') : step.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.estimatedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Storage Bucket Setup Notice */}
            <Card className={`border-0 shadow-lg ${
              isKidsMode 
                ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 card bounce-in' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800'
            }`}>
              <CardHeader>
                <CardTitle className={`${
                  isKidsMode ? 'text-blue-800' : 'text-blue-800 dark:text-blue-200'
                } flex items-center gap-2`}>
                  <Upload className="h-5 w-5" />
                  {isKidsMode ? '🔧 Setup Required!' : '🔧 Setup Required'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`space-y-3 text-sm ${
                  isKidsMode ? 'text-blue-700' : 'text-blue-700 dark:text-blue-300'
                }`}>
                  <p className="font-medium">To enable file uploads, create a Supabase storage bucket:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>Go to your Supabase dashboard</li>
                    <li>Navigate to Storage</li>
                    <li>Create a new bucket named "submissions"</li>
                    <li>Set it to public for easy access</li>
                  </ol>
                  <p className="text-xs opacity-75">
                    Files will be uploaded to: submissions/[user-id]/[worksheet-id]/[timestamp].[ext]
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className={`border-0 shadow-lg ${
              isKidsMode 
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 card bounce-in' 
                : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800'
            }`}>
              <CardHeader>
                <CardTitle className={`${
                  isKidsMode ? 'text-amber-800' : 'text-amber-800 dark:text-amber-200'
                } flex items-center gap-2`}>
                  <Star className="h-5 w-5" />
                  {isKidsMode ? '💡 Super Tips!' : '💡 Practice Tips'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className={`space-y-2 text-sm ${
                  isKidsMode ? 'text-amber-700' : 'text-amber-700 dark:text-amber-300'
                }`}>
                  <li>• {isKidsMode ? '🪑 Find a comfy place to practice!' : 'Find a comfortable, well-lit workspace'}</li>
                  <li>• {isKidsMode ? '✏️ Hold your pencil gently!' : 'Hold your pencil with a relaxed grip'}</li>
                  <li>• {isKidsMode ? '⏰ Take breaks when you need them!' : 'Take breaks every 10-15 minutes'}</li>
                  <li>• {isKidsMode ? '🎯 Focus on doing it right, not fast!' : 'Focus on accuracy over speed'}</li>
                  <li>• {isKidsMode ? '🌟 Practice a little bit every day!' : 'Practice regularly for best results'}</li>
                  <li>• {isKidsMode ? '📸 Upload your work to track progress!' : 'Upload completed worksheets to track progress'}</li>
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