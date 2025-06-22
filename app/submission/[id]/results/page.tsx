'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Tables } from '@/lib/database.types';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Eye,
  Download,
  BarChart3,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

type AnalysisResult = {
  id: number;
  submission_id: number;
  overall_score: number;
  formation_score?: number;
  spacing_score?: number;
  consistency_score?: number;
  alignment_score?: number;
  letter_scores: any; // JSON data
  feedback: string;
  feedback_json?: any; // Add this missing property
  strengths: string[];
  areas_for_improvement: string[];
  created_at: string;
};

type Submission = {
  id: number;
  user_id: string;
  exercise_id: number;
  image_url: string;
  status: string;
  score?: number;
  feedback?: string;
  submitted_at?: string; // Add this property as it's used in the JSX
  created_at: string;
  updated_at: string;
};

type Exercise = {
  id: number;
  title: string;
  description: string;
  level: number;
  font_style?: string;
  worksheet_pdf_url?: string;
  created_at: string;
  updated_at: string;
};

interface AnalysisData {
  analysis: AnalysisResult;
  submission: Submission;
  exercise: Exercise;
}

interface FeedbackItem {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  severity?: 'low' | 'medium' | 'high';
  category?: 'formation' | 'spacing' | 'alignment' | 'consistency';
}

interface FeedbackJson {
  overall_feedback: string;
  detected_text: string;
  issues: FeedbackItem[];
  strengths: string[];
  recommendations: string[];
  image_dimensions?: {
    width: number;
    height: number;
  };
}

export default function ResultsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };

    getUser();
  }, [supabase.auth, router]);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!submissionId || !user) return;

      try {
        // Convert string ID to number for database query
        const submissionIdNumber = parseInt(submissionId, 10);
        
        if (isNaN(submissionIdNumber)) {
          console.error('Invalid submission ID:', submissionId);
          router.push('/dashboard');
          return;
        }

        // Fetch analysis result with submission and exercise data
        const { data, error } = await supabase
          .from('analysis_results')
          .select(`
            *,
            submissions!inner (
              *,
              exercises!inner (*)
            )
          `)
          .eq('submission_id', submissionIdNumber)
          .single();

        if (error) {
          console.error('Error fetching analysis data:', error);
          router.push('/dashboard');
          return;
        }

        // Verify user owns this submission
        if (data.submissions.user_id !== user.id) {
          console.error('User does not own this submission');
          router.push('/dashboard');
          return;
        }

        setAnalysisData({
          analysis: data,
          submission: data.submissions,
          exercise: data.submissions.exercises
        });

      } catch (error) {
        console.error('Error fetching analysis data:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [supabase, submissionId, user, router]);

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadgeColor = (score: number | null | undefined) => {
    if (!score) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (score >= 40) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getIssueColor = (type: string, severity?: string) => {
    switch (type) {
      case 'error':
        return severity === 'high' ? '#ef4444' : '#f97316';
      case 'warning':
        return '#eab308';
      case 'suggestion':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const parseFeedbackJson = (feedbackJson: any): FeedbackJson | null => {
    try {
      if (typeof feedbackJson === 'string') {
        return JSON.parse(feedbackJson);
      }
      return feedbackJson as FeedbackJson;
    } catch (error) {
      console.error('Error parsing feedback JSON:', error);
      return null;
    }
  };

  const renderOverlays = (feedback: FeedbackJson) => {
    if (!showOverlays || !feedback.issues) return null;

    return feedback.issues.map((issue, index) => {
      if (!issue.coordinates) return null;

      const { x, y, width, height } = issue.coordinates;
      const color = getIssueColor(issue.type, issue.severity);
      const isSelected = selectedIssue === index;

      return (
        <g key={index}>
          {/* Highlight rectangle */}
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={color}
            fillOpacity={isSelected ? 0.3 : 0.2}
            stroke={color}
            strokeWidth={isSelected ? 3 : 2}
            strokeDasharray={issue.type === 'suggestion' ? '5,5' : 'none'}
            className="cursor-pointer transition-all duration-200"
            onClick={() => setSelectedIssue(isSelected ? null : index)}
          />
          
          {/* Issue number badge */}
          <circle
            cx={x + width - 10}
            cy={y + 10}
            r="12"
            fill={color}
            className="cursor-pointer"
            onClick={() => setSelectedIssue(isSelected ? null : index)}
          />
          <text
            x={x + width - 10}
            y={y + 10}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            className="cursor-pointer pointer-events-none"
          >
            {index + 1}
          </text>
        </g>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (!user || !analysisData) {
    return null;
  }

  const { analysis, submission, exercise } = analysisData;
  const feedback = parseFeedbackJson(analysis.feedback_json);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
            <p className="text-muted-foreground mt-1">
              {exercise.title} • Submitted {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowOverlays(!showOverlays)}
              variant={showOverlays ? "default" : "outline"}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showOverlays ? 'Hide' : 'Show'} Overlays
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Image and Overlays */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Handwriting Analysis
                </CardTitle>
                <CardDescription>
                  Click on numbered markers to see specific feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-white rounded-lg p-4 shadow-inner">
                  {!imageLoaded && !imageError && (
                    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Loading image...</p>
                      </div>
                    </div>
                  )}
                  
                  {imageError && (
                    <div className="aspect-[4/3] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-600 dark:text-red-400 text-sm">Failed to load image</p>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <img
                      src={submission.image_url}
                      alt="Submitted handwriting"
                      className={`max-w-full h-auto rounded-lg shadow-md ${
                        !imageLoaded ? 'hidden' : ''
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                    />
                    
                    {imageLoaded && feedback && (
                      <svg
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ pointerEvents: showOverlays ? 'auto' : 'none' }}
                        viewBox={`0 0 ${feedback.image_dimensions?.width || 1000} ${feedback.image_dimensions?.height || 1000}`}
                        preserveAspectRatio="xMidYMid meet"
                      >
                        {renderOverlays(feedback)}
                      </svg>
                    )}
                  </div>
                </div>

                {/* Legend */}
                {feedback?.issues && feedback.issues.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-3">Legend</h4>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded border"></div>
                        <span>Errors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                        <span>Warnings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded border border-dashed"></div>
                        <span>Suggestions</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Issue Details */}
            {selectedIssue !== null && feedback?.issues && feedback.issues[selectedIssue] && (
              <Card className="border-0 shadow-lg border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {selectedIssue + 1}
                    </span>
                    Issue Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${
                          feedback.issues[selectedIssue].type === 'error' ? 'bg-red-100 text-red-800' :
                          feedback.issues[selectedIssue].type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {feedback.issues[selectedIssue].type.toUpperCase()}
                      </Badge>
                      {feedback.issues[selectedIssue].severity && (
                        <Badge variant="outline">
                          {feedback.issues[selectedIssue].severity?.toUpperCase()} PRIORITY
                        </Badge>
                      )}
                      {feedback.issues[selectedIssue].category && (
                        <Badge variant="secondary">
                          {feedback.issues[selectedIssue].category?.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-foreground">{feedback.issues[selectedIssue].message}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overall_score)}`}>
                    {analysis.overall_score ? `${Math.round(analysis.overall_score)}%` : 'N/A'}
                  </div>
                  <Badge className={getScoreBadgeColor(analysis.overall_score)}>
                    {analysis.overall_score && analysis.overall_score >= 80 ? 'Excellent' :
                     analysis.overall_score && analysis.overall_score >= 60 ? 'Good' :
                     analysis.overall_score && analysis.overall_score >= 40 ? 'Needs Work' : 'Poor'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Detailed Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Letter Formation</span>
                    <span className={`font-bold ${getScoreColor(analysis.formation_score)}`}>
                      {analysis.formation_score ? `${Math.round(analysis.formation_score)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysis.formation_score || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Letter Spacing</span>
                    <span className={`font-bold ${getScoreColor(analysis.spacing_score)}`}>
                      {analysis.spacing_score ? `${Math.round(analysis.spacing_score)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysis.spacing_score || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Consistency</span>
                    <span className={`font-bold ${getScoreColor(analysis.consistency_score)}`}>
                      {analysis.consistency_score ? `${Math.round(analysis.consistency_score)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysis.consistency_score || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Alignment</span>
                    <span className={`font-bold ${getScoreColor(analysis.alignment_score)}`}>
                      {analysis.alignment_score ? `${Math.round(analysis.alignment_score)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysis.alignment_score || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detected Text */}
            {feedback?.detected_text && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Detected Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-sm font-mono text-foreground whitespace-pre-wrap">
                      {feedback.detected_text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Strengths */}
            {feedback?.strengths && feedback.strengths.length > 0 && (
              <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {feedback?.recommendations && feedback.recommendations.length > 0 && (
              <Card className="border-0 shadow-lg border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Zap className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Overall Feedback */}
            {feedback?.overall_feedback && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed">
                    {feedback.overall_feedback}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}