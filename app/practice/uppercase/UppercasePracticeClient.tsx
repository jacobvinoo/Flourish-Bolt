// app/practice/uppercase/UppercasePracticeClient.tsx
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
  BookOpen
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

// This array defines the practice steps for the uppercase letters workbook.
const uppercaseWorkbookSteps: WorksheetStep[] = [
  {
    id: 'letter-A',
    title: 'Worksheet 3.1: Letter A',
    friendlyTitle: 'The letter A!',
    description: 'Practice the two diagonal lines and horizontal line of the letter "A".',
    kidsDescription: "Let's draw two slanted lines and connect them with a bridge to make an \"A\"!",
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Diagonal lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-amber-400 to-amber-600',
    emoji: 'A'
  },
  {
    id: 'letter-B',
    title: 'Worksheet 3.2: Letter B',
    friendlyTitle: 'The letter B!',
    description: 'Master the vertical line and two curves of the letter "B".',
    kidsDescription: 'Draw a straight line and two round bumps to make a "B"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-curve-line.html',
    skills: ['Vertical lines', 'Curved strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-purple-400 to-purple-600',
    emoji: 'B'
  },
  {
    id: 'letter-C',
    title: 'Worksheet 3.3: Letter C',
    friendlyTitle: 'The letter C!',
    description: 'Practice the open curve of the letter "C".',
    kidsDescription: 'Draw a big curve like a smile to make a "C"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    skills: ['Curved strokes', 'Open shapes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-rose-400 to-rose-600',
    emoji: 'C'
  },
  {
    id: 'letter-D',
    title: 'Worksheet 3.4: Letter D',
    friendlyTitle: 'The letter D!',
    description: 'Master the vertical line and single curve of the letter "D".',
    kidsDescription: 'Draw a straight line and a big curve to make a "D"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-curve-line.html',
    skills: ['Vertical lines', 'Curved strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'D'
  },
  {
    id: 'letter-E',
    title: 'Worksheet 3.5: Letter E',
    friendlyTitle: 'The letter E!',
    description: 'Practice the vertical line and three horizontal lines of the letter "E".',
    kidsDescription: 'Draw a straight line and three shelves to make an "E"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'E'
  },
  {
    id: 'letter-F',
    title: 'Worksheet 3.6: Letter F',
    friendlyTitle: 'The letter F!',
    description: 'Master the vertical line and two horizontal lines of the letter "F".',
    kidsDescription: 'Draw a straight line and two shelves to make an "F"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-indigo-400 to-indigo-600',
    emoji: 'F'
  },
  {
    id: 'letter-G',
    title: 'Worksheet 3.7: Letter G',
    friendlyTitle: 'The letter G!',
    description: 'Practice the curve and small line of the letter "G".',
    kidsDescription: 'Draw a "C" with a little line in the middle to make a "G"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    skills: ['Curved strokes', 'Straight lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-orange-400 to-orange-600',
    emoji: 'G'
  },
  {
    id: 'letter-H',
    title: 'Worksheet 3.8: Letter H',
    friendlyTitle: 'The letter H!',
    description: 'Master the two vertical lines and one horizontal line of the letter "H".',
    kidsDescription: 'Draw two straight lines with a bridge in the middle to make an "H"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-violet-400 to-violet-600',
    emoji: 'H'
  },
  {
    id: 'letter-I',
    title: 'Worksheet 3.9: Letter I',
    friendlyTitle: 'The letter I!',
    description: 'Practice the vertical line and two horizontal lines of the letter "I".',
    kidsDescription: 'Draw a straight line with a hat and shoes to make an "I"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-purple-400 to-purple-600',
    emoji: 'I'
  },
  {
    id: 'letter-J',
    title: 'Worksheet 3.10: Letter J',
    friendlyTitle: 'The letter J!',
    description: 'Master the vertical line and curve of the letter "J".',
    kidsDescription: 'Draw a straight line with a hook at the bottom to make a "J"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-mixed-formation.html',
    skills: ['Vertical lines', 'Curved strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-cyan-400 to-cyan-600',
    emoji: 'J'
  },
  {
    id: 'letter-K',
    title: 'Worksheet 3.11: Letter K',
    friendlyTitle: 'The letter K!',
    description: 'Practice the vertical line and two diagonal lines of the letter "K".',
    kidsDescription: 'Draw a straight line and two slanted lines to make a "K"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Vertical lines', 'Diagonal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-yellow-400 to-yellow-600',
    emoji: 'K'
  },
  {
    id: 'letter-L',
    title: 'Worksheet 3.12: Letter L',
    friendlyTitle: 'The letter L!',
    description: 'Master the vertical line and horizontal line of the letter "L".',
    kidsDescription: 'Draw a straight line down and a line across the bottom to make an "L"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-fuchsia-400 to-fuchsia-600',
    emoji: 'L'
  },
  {
    id: 'letter-M',
    title: 'Worksheet 3.13: Letter M',
    friendlyTitle: 'The letter M!',
    description: 'Practice the two vertical lines and two diagonal lines of the letter "M".',
    kidsDescription: 'Draw two straight lines with a mountain in the middle to make an "M"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Vertical lines', 'Diagonal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-lime-400 to-lime-600',
    emoji: 'M'
  },
  {
    id: 'letter-N',
    title: 'Worksheet 3.14: Letter N',
    friendlyTitle: 'The letter N!',
    description: 'Master the two vertical lines and one diagonal line of the letter "N".',
    kidsDescription: 'Draw two straight lines with a slide in the middle to make an "N"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Vertical lines', 'Diagonal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-green-400 to-green-600',
    emoji: 'N'
  },
  {
    id: 'letter-O',
    title: 'Worksheet 3.15: Letter O',
    friendlyTitle: 'The letter O!',
    description: 'Practice the closed curve of the letter "O".',
    kidsDescription: 'Make a perfect circle to create an "O"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    skills: ['Closed curves', 'Circular motion', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-amber-400 to-amber-600',
    emoji: 'O'
  },
  {
    id: 'letter-P',
    title: 'Worksheet 3.16: Letter P',
    friendlyTitle: 'The letter P!',
    description: 'Master the vertical line and single curve at the top of the letter "P".',
    kidsDescription: 'Make a straight line and a curve at the top for "P"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-curve-line.html',
    skills: ['Vertical lines', 'Curved strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-green-400 to-green-600',
    emoji: 'P'
  },
  {
    id: 'letter-Q',
    title: 'Worksheet 3.17: Letter Q',
    friendlyTitle: 'The letter Q!',
    description: 'Practice the circle and small diagonal line of the letter "Q".',
    kidsDescription: 'Draw an "O" and add a little tail to make a "Q"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    skills: ['Closed curves', 'Diagonal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-yellow-400 to-yellow-600',
    emoji: 'Q'
  },
  {
    id: 'letter-R',
    title: 'Worksheet 3.18: Letter R',
    friendlyTitle: 'The letter R!',
    description: 'Master the vertical line, curve, and diagonal line of the letter "R".',
    kidsDescription: 'Draw a "P" and add a leg to make an "R"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-curve-line.html',
    skills: ['Vertical lines', 'Curved strokes', 'Diagonal lines'],
    estimatedTime: '10-15 minutes',
    color: 'from-red-400 to-red-600',
    emoji: 'R'
  },
  {
    id: 'letter-S',
    title: 'Worksheet 3.19: Letter S',
    friendlyTitle: 'The letter S!',
    description: 'Practice the double curve of the letter "S".',
    kidsDescription: 'Draw a snake shape to make an "S"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    skills: ['Double curves', 'Flowing motion', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-lime-400 to-lime-600',
    emoji: 'S'
  },
  {
    id: 'letter-T',
    title: 'Worksheet 3.20: Letter T',
    friendlyTitle: 'The letter T!',
    description: 'Master the vertical line and horizontal line of the letter "T".',
    kidsDescription: 'Draw a straight line with a hat on top to make a "T"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Vertical lines', 'Horizontal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-pink-400 to-pink-600',
    emoji: 'T'
  },
  {
    id: 'letter-U',
    title: 'Worksheet 3.21: Letter U',
    friendlyTitle: 'The letter U!',
    description: 'Practice the two vertical lines and curve of the letter "U".',
    kidsDescription: 'Draw two straight lines with a smile at the bottom to make a "U"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-mixed-formation.html',
    skills: ['Vertical lines', 'Curved strokes', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: 'U'
  },
  {
    id: 'letter-V',
    title: 'Worksheet 3.22: Letter V',
    friendlyTitle: 'The letter V!',
    description: 'Master the two diagonal lines of the letter "V".',
    kidsDescription: 'Draw two slanted lines that meet at the bottom to make a "V"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Diagonal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-teal-400 to-teal-600',
    emoji: 'V'
  },
  {
    id: 'letter-W',
    title: 'Worksheet 3.23: Letter W',
    friendlyTitle: 'The letter W!',
    description: 'Practice the four diagonal lines of the letter "W".',
    kidsDescription: 'Draw two "V"s next to each other to make a "W"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Diagonal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-cyan-400 to-cyan-600',
    emoji: 'W'
  },
  {
    id: 'letter-X',
    title: 'Worksheet 3.24: Letter X',
    friendlyTitle: 'The letter X!',
    description: 'Master the two crossing diagonal lines of the letter "X".',
    kidsDescription: 'Draw two slanted lines that cross in the middle to make an "X"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Diagonal lines', 'Crossing lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-sky-400 to-sky-600',
    emoji: 'X'
  },
  {
    id: 'letter-Y',
    title: 'Worksheet 3.25: Letter Y',
    friendlyTitle: 'The letter Y!',
    description: 'Practice the two diagonal lines and one vertical line of the letter "Y".',
    kidsDescription: 'Draw a "V" with a straight line at the bottom to make a "Y"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Diagonal lines', 'Vertical lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'Y'
  },
  {
    id: 'letter-Z',
    title: 'Worksheet 3.26: Letter Z',
    friendlyTitle: 'The letter Z!',
    description: 'Master the two horizontal lines and one diagonal line of the letter "Z".',
    kidsDescription: 'Draw a top line, a bottom line, and connect them with a slide to make a "Z"!',
    level: 3,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Horizontal lines', 'Diagonal lines', 'Letter formation'],
    estimatedTime: '10-15 minutes',
    color: 'from-indigo-400 to-indigo-600',
    emoji: 'Z'
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
        onClick={() => { if (!disabled && !uploading) document.getElementById('file-upload-uppercase')?.click(); }}>
        <div className={`mx-auto mb-4 p-4 rounded-full ${isKidsMode ? 'bg-gradient-to-br from-purple-200 to-pink-200' : 'bg-gray-100'}`}>
          <Upload className={`h-12 w-12 mx-auto ${isKidsMode ? 'text-purple-600' : 'text-gray-400'}`} />
        </div>
        <h3 className="text-xl font-bold mb-2">{isKidsMode ? dragActive ? '📸 Drop your photo here!' : '📷 Add Your Worksheet Photo!' : dragActive ? 'Drop your image here' : 'Upload worksheet image'}</h3>
        <p className="text-gray-600 mb-4">{isKidsMode ? 'Drag and drop your photo here, or click to choose one from your device! 🖱️' : 'Drag and drop or click to select an image file'}</p>
        <Input id="file-upload-uppercase" type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleChange} className="hidden" disabled={disabled || uploading} />
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

export default function UppercasePracticeClient({ user, profile, initialSubmissions }: PracticePageClientProps) {
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
  const [uploadFilePath, setUploadFilePath] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Effect to keep local profile state in sync with props from the server component
  useEffect(() => {
    setLocalProfile(profile);
    setSubmissions(initialSubmissions);
  }, [profile, initialSubmissions]);

  // Fetch submissions when the current step changes
  useEffect(() => {
    fetchSubmissions();
  }, [currentStep]);

  const fetchSubmissions = async () => {
    if (!user) return;
    
    try {
      const currentWorksheet = uppercaseWorkbookSteps[currentStep];
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
      feedbackTip: 'Great work on your uppercase letters! Keep practicing for even more consistent letter shapes.',
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
      const currentWorksheet = uppercaseWorkbookSteps[currentStep];
      const fileName = `${user.id}/${currentWorksheet.id}/${timestamp}.${fileExt}`;

      setUploadFilePath(fileName);
      
      const { error: uploadError } = await supabase.storage.from('submissions').upload(fileName, selectedFile);
      if (uploadError) throw new Error(uploadError.message);

    } catch (error: any) {
      setUploadError(error.message || 'An unexpected error occurred during upload');
      setUploading(false);
    }
  };

  const handleGradingComplete = async () => {
    if (!analysisResult || !uploadFilePath) return;
    
    const newXp = (localProfile?.xp ?? 0) + 30; // Award 30 XP for an uppercase letter
    const currentWorksheet = uppercaseWorkbookSteps[currentStep];
    
    try {
      // Save the submission to the database
      const submissionData = {
        user_id: user.id,
        worksheet_id: currentWorksheet.id,
        score: analysisResult.overallScore,
        steadiness: analysisResult.steadiness,
        accuracy: analysisResult.accuracy,
        feedback: analysisResult.feedbackTip,
        image_path: uploadFilePath
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
      setCompletedSteps(prev => new Set(prev).add(uppercaseWorkbookSteps[currentStep].id));
      
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFile(null);
        if (currentStep < uppercaseWorkbookSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 2000);
    } catch (err) {
      console.error("Error completing grading:", err);
    }
  };

  const openWorksheet = (worksheetUrl: string) => window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  const goToPreviousStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const goToNextStep = () => { if (currentStep < uppercaseWorkbookSteps.length - 1) setCurrentStep(currentStep + 1); };

  const currentWorksheet = uppercaseWorkbookSteps[currentStep];
  const progressPercentage = (completedSteps.size / uppercaseWorkbookSteps.length) * 100;

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
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-900'}`}>
            Uppercase Letter Practice
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-blue-700' : 'text-gray-600'}`}>
            Let's master writing all the uppercase letters, from 'A' to 'Z'!
          </p>
        </div>

        {isKidsMode && (
          <div className="border-0 shadow-xl mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white overflow-hidden rounded-2xl">
            <div className="pt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="h-6 w-6" /> Your Amazing Progress!
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">{completedSteps.size} / {uppercaseWorkbookSteps.length}</div>
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
                    <Button onClick={() => openWorksheet(currentWorksheet.worksheetUrl)} className="flex-1 h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"><Eye className="h-5 w-5 mr-2" />Open Worksheet</Button>
                    <Button onClick={() => window.print()} variant="outline" size="icon" className="h-12 w-12"><Printer className="h-5 w-5" /></Button>
                </div>
                <div className="flex items-center justify-between">
                  <Button onClick={goToPreviousStep} disabled={currentStep === 0} variant="outline"><ChevronLeft className="h-5 w-5 mr-2" />Previous</Button>
                  <span className="font-bold">{currentStep + 1} of {uppercaseWorkbookSteps.length}</span>
                  <Button onClick={goToNextStep} disabled={currentStep === uppercaseWorkbookSteps.length - 1} variant="outline">Next<ChevronRight className="h-5 w-5 ml-2" /></Button>
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
                    <Button onClick={handleGradingComplete} className="w-full h-12 text-lg font-bold bg-green-600 text-white hover:bg-green-700">Continue to Next Step</Button>
                  </div>
                </div>
              </div>
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
                  <Button onClick={handleUpload} size="lg" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                    Grade My Letter!
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 border-0 shadow-xl rounded-2xl bg-white/50">
              <h3 className="font-bold text-lg mb-4">Letter Navigation</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {uppercaseWorkbookSteps.map((step, index) => (
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
                const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(submission.image_path);
                return (
                  <div key={submission.id} className="p-6 bg-white rounded-2xl border flex items-center gap-6">
                    <img src={publicUrl} alt={`Submission for ${submission.worksheet_id}`} className="w-32 h-32 object-cover rounded-lg border"/>
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
                <p className="text-gray-500">You haven't made any submissions for this letter yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}