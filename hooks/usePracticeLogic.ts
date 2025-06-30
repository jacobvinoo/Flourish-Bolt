Hooks/usePracticeLogic.ts

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

// It's recommended to define these shared types in a central file (e.g., `lib/app.types.ts`)
// For this example, we'll define them here for clarity.
export interface Profile {
  id: string;
  display_mode: 'kids' | 'adults';
  xp: number;
  current_streak: number;
  // Add other profile properties as needed
}

export interface Submission {
  id: string;
  user_id: string;
  worksheet_id: string;
  score: number;
  steadiness: number;
  accuracy: number;
  feedback: string | null;
  image_path: string;
  created_at: string;
}

export interface WorksheetStep {
  id: string;
  title: string;
  description: string;
  level: number;
  worksheetUrl: string;
  skills: string[];
  estimatedTime: string;
  color: string;
  emoji: string;
}


export function usePracticeLogic({
  user,
  profile,
  initialSubmissions,
  worksheetSteps,
}: {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
  worksheetSteps: WorksheetStep[];
}) {
  const router = useRouter();

  // State for practice flow and steps
  const [currentStep, setCurrentStep] = useState(0);
  const [completedWorksheets, setCompletedWorksheets] = useState<Set<string>>(new Set());

  // State for file handling and submission
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // State for grading and results
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showGrading, setShowGrading] = useState(false);

  // State for user data and submission history
  const [localProfile, setLocalProfile] = useState(profile);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Effect to synchronize incoming props with local state
  useEffect(() => {
    setLocalProfile(profile);
    setSubmissions(initialSubmissions);
    const completedIds = new Set(initialSubmissions.map(sub => sub.worksheet_id));
    setCompletedWorksheets(completedIds);
  }, [profile, initialSubmissions]);

  // --- Handlers for File and Submission Flow ---

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
    setAnalysisResult(null);
    setShowGrading(false);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);

    try {
      const currentWorksheet = worksheetSteps[currentStep];
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('worksheetId', currentWorksheet.id);

      const response = await fetch('/api/grade-worksheet', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to grade worksheet.');
      }

      const result = await response.json();
      setAnalysisResult({ ...result, imageUrl: URL.createObjectURL(selectedFile) });
      setShowGrading(true);

    } catch (error: any) {
      setUploadError(error.message || 'An unexpected error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const handleGradingComplete = () => {
    // Refresh server data to get the new submission and updated XP
    router.refresh();

    setShowGrading(false);
    setAnalysisResult(null);
    setUploadSuccess(true);
    
    // Mark the current worksheet as complete in the UI
    setCompletedWorksheets(prev => new Set(prev).add(worksheetSteps[currentStep].id));
    
    // Automatically advance to the next step after a short delay
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedFile(null);
      if (currentStep < worksheetSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 2000);
  };

  const handleDeleteSubmission = async (submissionId: string, imagePath: string) => {
    // Prevent multiple concurrent deletions
    if (deletingId) return;

    // Ask for user confirmation before deleting
    const confirmed = window.confirm('Are you sure you want to delete this submission? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(submissionId);
    
    try {
      const response = await fetch('/api/delete-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, imagePath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete the submission.');
      }

      // Optimistically remove the submission from the local state for an instant UI update
      setSubmissions(currentSubmissions => 
        currentSubmissions.filter(sub => sub.id !== submissionId)
      );

    } catch (error: any) {
      console.error(error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // --- Handlers for Step Navigation ---

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStep < worksheetSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Return all state and handlers needed by the UI components
  return {
    // State
    currentStep,
    selectedFile,
    uploading,
    uploadSuccess,
    uploadError,
    analysisResult,
    showGrading,
    localProfile,
    submissions,
    completedWorksheets,
    deletingId,
    // Handlers
    setCurrentStep,
    handleFileSelect,
    handleFileRemove,
    handleUpload,
    handleGradingComplete,
    handleDeleteSubmission,
    goToPreviousStep,
    goToNextStep,
  };
}