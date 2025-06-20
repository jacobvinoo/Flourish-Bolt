'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Database, Tables, TablesInsert } from '@/lib/database.types';
import { storageService } from '@/lib/storage';
import { ArrowLeft, Download, Upload, Star, Clock, BookOpen, FileText, Target, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Exercise = Tables<'exercises'>;
type SubmissionInsert = TablesInsert<'submissions'>;

export default function ExercisePage() {
  const [user, setUser] = useState<User | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [exerciseLoading, setExerciseLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const params = useParams();
  const exerciseId = params.id as string;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    getUser();
  }, [supabase.auth, router]);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!exerciseId) return;

      try {
        // Convert string ID to number for database query
        const exerciseIdNumber = parseInt(exerciseId, 10);
        
        // Validate that the conversion was successful
        if (isNaN(exerciseIdNumber)) {
          console.error('Invalid exercise ID:', exerciseId);
          router.push('/dashboard');
          return;
        }

        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseIdNumber)
          .single();

        if (error) {
          console.error('Error fetching exercise:', error);
          router.push('/dashboard');
        } else {
          setExercise(data);
        }
      } catch (error) {
        console.error('Error fetching exercise:', error);
        router.push('/dashboard');
      } finally {
        setExerciseLoading(false);
      }
    };

    fetchExercise();
  }, [supabase, exerciseId, router]);

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level <= 6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (level <= 8) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 3) return 'Beginner';
    if (level <= 6) return 'Intermediate';
    if (level <= 8) return 'Advanced';
    return 'Expert';
  };

  const handleDownloadWorksheet = async () => {
    if (!exercise?.worksheet_pdf_url) return;
    
    setDownloadLoading(true);
    try {
      // Open the PDF in a new tab
      window.open(exercise.worksheet_pdf_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening worksheet:', error);
    } finally {
      setDownloadLoading(false);
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
    if (!selectedFile || !user || !exercise) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // First, create a submission record to get the ID
      const submissionData: SubmissionInsert = {
        user_id: user.id,
        exercise_id: exercise.id,
        image_url: '', // Will be updated after upload
        status: 'pending'
      };

      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert(submissionData)
        .select()
        .single();

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      // Upload the file to storage
      const uploadResult = await storageService.uploadSubmissionImage(
        selectedFile,
        user.id,
        submission.id.toString()
      );

      if (!uploadResult) {
        // Clean up the submission record if upload failed
        await supabase.from('submissions').delete().eq('id', submission.id);
        throw new Error('Failed to upload image to storage');
      }

      // Update the submission with the image URL
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ image_url: uploadResult.url })
        .eq('id', submission.id);

      if (updateError) {
        // Clean up the uploaded file if database update failed
        await storageService.deleteSubmissionImage(uploadResult.path);
        await supabase.from('submissions').delete().eq('id', submission.id);
        throw new Error(`Failed to update submission: ${updateError.message}`);
      }

      setUploadSuccess(true);
      setSelectedFile(null);
      
      // Show success message for a few seconds, then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'An unexpected error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  if (loading || exerciseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exercise details...</p>
        </div>
      </div>
    );
  }

  if (!user || !exercise) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{exercise.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.level)}`}>
                {getDifficultyLabel(exercise.level)}
              </span>
            </div>
            <p className="text-muted-foreground">
              Level {exercise.level} • {exercise.font_style ? exercise.font_style.replace('_', ' ').toUpperCase() : 'Standard'} Style
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">Upload Successful!</p>
              <p className="text-green-700 dark:text-green-300 text-sm">Your worksheet has been submitted for analysis. Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Upload Failed</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{uploadError}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exercise Overview */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Exercise Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {exercise.description && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed text-lg">
                      {exercise.description}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Level {exercise.level}</span>
                  </div>
                  {exercise.font_style && (
                    <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {exercise.font_style.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                    <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Handwriting Practice
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  How to Complete This Exercise
                </CardTitle>
                <CardDescription>
                  Follow these steps to get the most out of your handwriting practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Download the Practice Worksheet</h4>
                      <p className="text-sm text-muted-foreground">
                        Click the download button to get your personalized practice worksheet in PDF format. This worksheet is designed specifically for this exercise level.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Print and Practice</h4>
                      <p className="text-sm text-muted-foreground">
                        Print the worksheet on standard 8.5" x 11" paper. Use a pencil or pen that feels comfortable in your hand. Take your time and focus on proper letter formation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Upload Your Completed Work</h4>
                      <p className="text-sm text-muted-foreground">
                        Take a clear photo or scan your completed worksheet. Upload it using the form below to receive detailed AI-powered analysis and personalized feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Submit Your Completed Worksheet
                </CardTitle>
                <CardDescription>
                  Upload a clear photo or scan of your completed worksheet for AI analysis
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
                      className="flex-1"
                      size="lg"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit for Analysis
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleFileRemove}
                      disabled={uploading}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📸 Photo Tips for Best Results</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Ensure good lighting - avoid shadows on the paper</li>
                    <li>• Take the photo straight on (not at an angle)</li>
                    <li>• Make sure all text is clearly visible and in focus</li>
                    <li>• Include the entire worksheet in the frame</li>
                    <li>• Use a high-resolution camera or scanner if possible</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Ready to Practice?</CardTitle>
                <CardDescription>
                  Download your worksheet to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleDownloadWorksheet}
                  disabled={downloadLoading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {downloadLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Opening Worksheet...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-3" />
                      Download Worksheet
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Exercise Details */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Exercise Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Difficulty Level</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.level)}`}>
                        {getDifficultyLabel(exercise.level)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Level Rating</span>
                    <div className="flex items-center gap-1">
                      {[...Array(10)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < exercise.level 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`} 
                        />
                      ))}
                      <span className="text-sm font-medium ml-2">{exercise.level}/10</span>
                    </div>
                  </div>
                  
                  {exercise.font_style && (
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm font-medium text-muted-foreground">Font Style</span>
                      <span className="text-sm font-medium">
                        {exercise.font_style.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">
                      {exercise.created_at ? new Date(exercise.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200">💡 Practice Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Find a comfortable, well-lit workspace</li>
                  <li>• Hold your pencil with a relaxed grip</li>
                  <li>• Take breaks every 10-15 minutes</li>
                  <li>• Focus on consistency over speed</li>
                  <li>• Practice regularly for best results</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}