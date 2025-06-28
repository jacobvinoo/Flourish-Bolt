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
// update your `database.types.ts` by running the Supabase CLI,
// and then you can remove this manual definition.
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
];

// This helper component is defined outside the main component for clarity.
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
      return <div>...File selected UI...</div>; // Omitted for brevity
  }
  return <div>...File upload dropzone UI...</div>; // Omitted for brevity
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
        throw new Error(`Server returned an error: ${response.status}`);
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
    // Award XP and update the database
    const newXp = (localProfile?.xp ?? 0) + 50;
    const { error } = await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);

    if (error) {
      console.error("Failed to update user's XP:", error.message);
    } else {
      console.log("Database XP update successful");
    }

    // Refresh the page to get the latest submissions and profile data
    router.refresh();

    // Update UI state
    setShowGrading(false);
    setAnalysisResult(null);
    setUploadSuccess(true);
    
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedFile(null);
      // Advance to the next step if not the last one
      if (currentStep < firstWorkbookSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 2000);
  };

  const isKidsMode = localProfile?.display_mode === 'kids';
  const currentWorksheet = firstWorkbookSteps[currentStep];

  // Filter submissions for the currently selected worksheet
  const currentSubmissions = submissions
    .filter(s => s.worksheet_id === currentWorksheet.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const openWorksheet = (worksheetUrl: string) => { window.open(worksheetUrl, '_blank', 'noopener,noreferrer'); };
  const goToPreviousStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const goToNextStep = () => { if (currentStep < firstWorkbookSteps.length - 1) setCurrentStep(currentStep + 1); };

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
        {/* All UI components like Header, AI Grading, Upload, etc. go here */}
        
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
                      className="w-full md:w-32 md:h-32 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg text-gray-800">Overall Score: {submission.score}%</p>
                        <p className="text-xs text-gray-400">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </p>
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
