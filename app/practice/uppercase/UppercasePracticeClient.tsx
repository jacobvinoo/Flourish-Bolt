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
}

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
  linkTo?: string;
}

// This array defines the practice steps for the uppercase letters workbook.
const uppercaseWorkbookSteps: WorksheetStep[] = [
  {
    id: 'straight-lines',
    title: 'Worksheet 2.1: Straight Line Letters',
    friendlyTitle: 'Straight Line Letters!',
    description: 'Practice uppercase letters made with straight lines: E, F, H, I, L, T.',
    kidsDescription: 'Let\'s draw letters with straight lines like E, F, H, I, L, and T!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Straight lines', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '15-20 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'E',
    linkTo: '/practice/uppercase-straight-lines'
  },
  {
    id: 'curve-line',
    title: 'Worksheet 2.2: Curve & Line Letters',
    friendlyTitle: 'Curve & Line Letters!',
    description: 'Master uppercase letters with curves and lines: B, D, P, R.',
    kidsDescription: 'Let\'s make letters with curves and lines like B, D, P, and R!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-curve-line.html',
    skills: ['Curved lines', 'Straight lines', 'Letter formation'],
    estimatedTime: '15-20 minutes',
    color: 'from-purple-400 to-purple-600',
    emoji: 'B',
    linkTo: '/practice/uppercase-curve-line'
  },
  {
    id: 'full-curves',
    title: 'Worksheet 2.3: Full Curve Letters',
    friendlyTitle: 'Curvy Letters!',
    description: 'Learn to write uppercase letters with full curves: C, G, O, Q, S.',
    kidsDescription: 'Let\'s draw curvy letters like C, G, O, Q, and S!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    skills: ['Curved lines', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '15-20 minutes',
    color: 'from-rose-400 to-rose-600',
    emoji: 'C',
    linkTo: '/practice/uppercase-full-curves'
  },
  {
    id: 'diagonal-lines',
    title: 'Worksheet 2.4: Diagonal Line Letters',
    friendlyTitle: 'Slanted Line Letters!',
    description: 'Practice uppercase letters with diagonal lines: A, K, M, N, V, W, X, Y, Z.',
    kidsDescription: 'Let\'s make letters with slanted lines like A, K, M, N, V, W, X, Y, and Z!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Diagonal lines', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '15-20 minutes',
    color: 'from-amber-400 to-amber-600',
    emoji: 'A',
    linkTo: '/practice/uppercase-diagonal-lines'
  },
  {
    id: 'mixed-formation',
    title: 'Worksheet 2.5: Mixed Formation Letters',
    friendlyTitle: 'Special Letters!',
    description: 'Master special uppercase letters with unique shapes: J, U.',
    kidsDescription: 'Let\'s learn special letters like J and U!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-mixed-formation.html',
    skills: ['Mixed techniques', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '10-15 minutes',
    color: 'from-cyan-400 to-cyan-600',
    emoji: 'J',
    linkTo: '/practice/uppercase-mixed-formation'
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

export default function UppercasePracticeClient({ user, profile }: PracticePageClientProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localProfile, setLocalProfile] = useState(profile);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Effect to keep local profile state in sync with props from the server component
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

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

  const isKidsMode = localProfile?.display_mode === 'kids';

  const openWorksheet = (worksheetUrl: string) => window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  
  const navigateToWorksheet = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

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
                  <Star className="h-6 w-6" /> Your Uppercase Adventure!
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">5 Worksheets</div>
                  <div className="text-sm opacity-90">Pick one to start!</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uppercaseWorkbookSteps.map((step) => (
            <div 
              key={step.id}
              onClick={() => navigateToWorksheet(step.linkTo || '')}
              className={`border-0 shadow-xl overflow-hidden rounded-2xl transition-all duration-200 hover:scale-105 cursor-pointer ${
                isKidsMode 
                  ? `bg-gradient-to-br ${step.color} text-white` 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-4xl ${isKidsMode ? 'animate-bounce' : ''}`}>
                    {step.emoji}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isKidsMode ? 'text-white' : 'text-gray-900'}`}>
                      {isKidsMode ? step.friendlyTitle : step.title}
                    </h3>
                  </div>
                </div>
                <p className={`text-sm mb-4 ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>
                  {isKidsMode ? step.kidsDescription : step.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    isKidsMode 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {step.estimatedTime}
                  </div>
                  <Button 
                    size="sm" 
                    variant={isKidsMode ? "default" : "outline"}
                    className={isKidsMode ? "bg-white/20 hover:bg-white/30 text-white" : ""}
                  >
                    Start Practice
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 border-0 shadow-xl rounded-2xl bg-white/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            About Uppercase Letters
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700">
              Uppercase letters (also called capital letters) are important for starting sentences, writing names, and showing importance. 
              In this section, we've organized the uppercase alphabet into groups based on the types of strokes used to form them:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li><strong>Straight Line Letters:</strong> E, F, H, I, L, T - These letters use only straight lines.</li>
              <li><strong>Curve & Line Letters:</strong> B, D, P, R - These combine straight lines with curves.</li>
              <li><strong>Full Curve Letters:</strong> C, G, O, Q, S - These letters use primarily curved strokes.</li>
              <li><strong>Diagonal Line Letters:</strong> A, K, M, N, V, W, X, Y, Z - These use diagonal or slanted lines.</li>
              <li><strong>Special Formation Letters:</strong> J, U - These have unique formations that don't fit the other categories.</li>
            </ul>
            <p className="mt-4 text-gray-700">
              Choose any category to begin practicing. You can complete them in any order!
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}