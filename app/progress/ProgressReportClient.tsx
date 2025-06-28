'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import PageLayout from '@/components/PageLayout';
import { Database, Profile } from '@/lib/database.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Award,
  Star,
  Clock,
  CheckCircle,
  BookOpen,
  Zap,
  LineChart,
  PieChart,
  Flame,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Medal,
  Trophy
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

interface ProgressReportClientProps {
  user: User;
  profile: Profile | null;
  initialSubmissions: Submission[];
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper function to group submissions by date
const groupSubmissionsByDate = (submissions: Submission[]) => {
  const grouped: Record<string, Submission[]> = {};
  
  submissions.forEach(submission => {
    const date = new Date(submission.created_at).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(submission);
  });
  
  return grouped;
};

// Helper function to calculate average scores
const calculateAverageScores = (submissions: Submission[]) => {
  if (submissions.length === 0) return { overall: 0, steadiness: 0, accuracy: 0 };
  
  const sum = submissions.reduce((acc, submission) => {
    return {
      overall: acc.overall + submission.score,
      steadiness: acc.steadiness + (submission.steadiness || 0),
      accuracy: acc.accuracy + (submission.accuracy || 0)
    };
  }, { overall: 0, steadiness: 0, accuracy: 0 });
  
  return {
    overall: Math.round(sum.overall / submissions.length),
    steadiness: Math.round(sum.steadiness / submissions.length),
    accuracy: Math.round(sum.accuracy / submissions.length)
  };
};

// Helper function to get score trend (improved, declined, or stable)
const getScoreTrend = (recentSubmissions: Submission[]) => {
  if (recentSubmissions.length < 2) return 'stable';
  
  const oldest = recentSubmissions[recentSubmissions.length - 1].score;
  const newest = recentSubmissions[0].score;
  
  if (newest > oldest + 5) return 'improved';
  if (newest < oldest - 5) return 'declined';
  return 'stable';
};

// Component for the progress chart
const ProgressChart = ({ data, isKidsMode }: { data: { date: string, score: number }[], isKidsMode: boolean }) => {
  // Simple visual chart representation
  const maxScore = Math.max(...data.map(d => d.score), 100);
  const minScore = Math.min(...data.map(d => d.score), 0);
  
  return (
    <div className="w-full h-40 flex items-end justify-between gap-1 mt-4">
      {data.map((point, index) => {
        const height = ((point.score - minScore) / (maxScore - minScore || 1)) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full ${isKidsMode ? 'bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg' : 'bg-primary rounded-t'}`} 
              style={{ height: `${Math.max(height, 5)}%` }}
            ></div>
            <div className="text-xs mt-1 text-gray-500">{point.date}</div>
          </div>
        );
      })}
    </div>
  );
};

// Component for the skill radar chart
const SkillRadarChart = ({ skills, isKidsMode }: { skills: Record<string, number>, isKidsMode: boolean }) => {
  // Calculate positions for each skill point on the radar chart
  const skillPoints = Object.entries(skills).map(([skill, value], index) => {
    const angle = (index * (360 / Object.keys(skills).length)) * (Math.PI / 180);
    const radius = (value / 100) * 40; // 40% of container
    const x = 50 + Math.sin(angle) * radius;
    const y = 50 - Math.cos(angle) * radius;
    
    return { skill, value, x, y, angle };
  });
  
  return (
    <div className="relative h-64 w-full mt-4">
      {/* Background circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-full h-full max-w-[200px] max-h-[200px] rounded-full ${isKidsMode ? 'bg-purple-100' : 'bg-gray-100'} opacity-20`}></div>
        <div className={`absolute w-3/4 h-3/4 rounded-full ${isKidsMode ? 'bg-purple-100' : 'bg-gray-100'} opacity-30`}></div>
        <div className={`absolute w-1/2 h-1/2 rounded-full ${isKidsMode ? 'bg-purple-100' : 'bg-gray-100'} opacity-40`}></div>
        <div className={`absolute w-1/4 h-1/4 rounded-full ${isKidsMode ? 'bg-purple-100' : 'bg-gray-100'} opacity-50`}></div>
      </div>
      
      {/* Skill points and labels */}
      {skillPoints.map(({ skill, value, x, y, angle }) => (
        <div key={skill} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
          <div className={`w-4 h-4 rounded-full ${isKidsMode ? 'bg-pink-500' : 'bg-primary'} -ml-2 -mt-2`}></div>
          <div 
            className={`absolute text-xs font-medium ${isKidsMode ? 'text-purple-700' : 'text-gray-700'} whitespace-nowrap`}
            style={{ 
              transform: `translate(${Math.sin(angle) > 0 ? '10px' : Math.sin(angle) < 0 ? '-110%' : '-50%'}, ${Math.cos(angle) < 0 ? '10px' : '-150%'})` 
            }}
          >
            {skill} ({value}%)
          </div>
        </div>
      ))}
      
      {/* Connect the dots with SVG polygon */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <polygon 
          points={skillPoints.map(({ x, y }) => `${x},${y}`).join(' ')}
          fill={isKidsMode ? 'rgba(219, 39, 119, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
          stroke={isKidsMode ? '#db2777' : 'hsl(var(--primary))'}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default function ProgressReportClient({ user, profile, initialSubmissions }: ProgressReportClientProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [loading, setLoading] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  
  // Effect to keep local profile state in sync with props from the server component
  useEffect(() => {
    setLocalProfile(profile);
    setSubmissions(initialSubmissions);
  }, [profile, initialSubmissions]);
  
  const isKidsMode = localProfile?.display_mode === 'kids';
  
  // Filter submissions based on selected time range
  const filteredSubmissions = useMemo(() => {
    if (timeRange === 'all') return submissions;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return submissions.filter(submission => 
      new Date(submission.created_at) >= cutoffDate
    );
  }, [submissions, timeRange]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    const totalSubmissions = filteredSubmissions.length;
    const averageScores = calculateAverageScores(filteredSubmissions);
    const trend = getScoreTrend(filteredSubmissions.slice(0, Math.min(10, filteredSubmissions.length)));
    
    // Group by worksheet type to see which areas the user has practiced
    const worksheetTypes: Record<string, number> = {};
    filteredSubmissions.forEach(submission => {
      const type = submission.worksheet_id.split('-')[0]; // Extract the type from worksheet_id
      worksheetTypes[type] = (worksheetTypes[type] || 0) + 1;
    });
    
    // Calculate improvement over time
    let improvement = 0;
    if (filteredSubmissions.length >= 5) {
      const firstFive = filteredSubmissions.slice(-5).reverse();
      const lastFive = filteredSubmissions.slice(0, 5);
      
      const firstFiveAvg = calculateAverageScores(firstFive).overall;
      const lastFiveAvg = calculateAverageScores(lastFive).overall;
      
      improvement = lastFiveAvg - firstFiveAvg;
    }
    
    // Get most recent submission date
    const lastPracticeDate = filteredSubmissions.length > 0 
      ? new Date(filteredSubmissions[0].created_at) 
      : null;
    
    // Calculate streak (simplified - in a real app, this would be more complex)
    const streak = localProfile?.current_streak || 0;
    
    return {
      totalSubmissions,
      averageScores,
      trend,
      worksheetTypes,
      improvement,
      lastPracticeDate,
      streak
    };
  }, [filteredSubmissions, localProfile]);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    // Group submissions by date
    const groupedByDate = groupSubmissionsByDate(filteredSubmissions);
    
    // Calculate average score for each date
    const chartPoints = Object.entries(groupedByDate).map(([date, subs]) => ({
      date: formatDate(date),
      score: calculateAverageScores(subs).overall
    }));
    
    // Sort by date
    return chartPoints.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ).slice(-7); // Show last 7 data points
  }, [filteredSubmissions]);
  
  // Prepare skill radar data
  const skillRadarData = useMemo(() => {
    return {
      'Steadiness': stats.averageScores.steadiness,
      'Accuracy': stats.averageScores.accuracy,
      'Consistency': Math.round((stats.averageScores.steadiness + stats.averageScores.accuracy) / 2),
      'Form': Math.round(stats.averageScores.overall * 0.9),
      'Speed': 65 // Placeholder - in a real app, this would be calculated
    };
  }, [stats.averageScores]);
  
  // Calculate badges and achievements
  const achievements = useMemo(() => {
    const badges = [];
    
    if (stats.totalSubmissions >= 1) {
      badges.push({ name: 'First Step', description: 'Completed your first handwriting exercise', icon: <Zap className="h-5 w-5" /> });
    }
    
    if (stats.totalSubmissions >= 10) {
      badges.push({ name: 'Dedicated Learner', description: 'Completed 10 handwriting exercises', icon: <BookOpen className="h-5 w-5" /> });
    }
    
    if (stats.averageScores.overall >= 80) {
      badges.push({ name: 'Precision Master', description: 'Achieved an average score of 80% or higher', icon: <Target className="h-5 w-5" /> });
    }
    
    if (stats.streak >= 3) {
      badges.push({ name: 'Consistency Champion', description: `Maintained a ${stats.streak}-day practice streak`, icon: <Flame className="h-5 w-5" /> });
    }
    
    if (stats.improvement > 10) {
      badges.push({ name: 'Rapid Improver', description: 'Improved your average score by more than 10%', icon: <TrendingUp className="h-5 w-5" /> });
    }
    
    return badges;
  }, [stats]);
  
  // Get personalized recommendations
  const recommendations = useMemo(() => {
    const recs = [];
    
    if (stats.averageScores.steadiness < 70) {
      recs.push('Practice more vertical and horizontal line exercises to improve steadiness');
    }
    
    if (stats.averageScores.accuracy < 70) {
      recs.push('Focus on staying within the lines and following the guides precisely');
    }
    
    if (Object.keys(stats.worksheetTypes).length < 3) {
      recs.push('Try a wider variety of worksheet types to build well-rounded skills');
    }
    
    if (stats.streak < 3) {
      recs.push('Aim for daily practice to build muscle memory and consistency');
    }
    
    if (recs.length === 0) {
      recs.push('Keep up the great work! Try challenging yourself with more advanced exercises');
    }
    
    return recs;
  }, [stats]);

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-900'} mb-4`}>
            {isKidsMode ? '✨ Your Amazing Progress! ✨' : 'Progress Report'}
          </h1>
          <p className={`text-xl ${isKidsMode ? 'text-purple-700' : 'text-gray-600'} max-w-3xl mx-auto`}>
            {isKidsMode 
              ? 'Look at all the awesome progress you\'ve made with your handwriting!' 
              : 'Track your handwriting improvement and see detailed analytics of your progress.'}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex rounded-lg p-1 ${isKidsMode ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <Button
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('week')}
              className={isKidsMode && timeRange === 'week' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              Last Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('month')}
              className={isKidsMode && timeRange === 'month' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              Last Month
            </Button>
            <Button
              variant={timeRange === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('all')}
              className={isKidsMode && timeRange === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              All Time
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {filteredSubmissions.length === 0 ? (
          <div className={`text-center py-16 px-6 rounded-2xl border ${isKidsMode ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isKidsMode ? 'bg-purple-200' : 'bg-gray-200'}`}>
              <BookOpen className={`h-8 w-8 ${isKidsMode ? 'text-purple-600' : 'text-gray-500'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isKidsMode ? 'text-purple-700' : 'text-gray-700'}`}>
              {isKidsMode ? 'No practice adventures yet!' : 'No practice data yet'}
            </h3>
            <p className={`max-w-md mx-auto mb-6 ${isKidsMode ? 'text-purple-600' : 'text-gray-500'}`}>
              {isKidsMode 
                ? 'Start your handwriting journey by completing some fun worksheets!' 
                : 'Complete some handwriting exercises to see your progress analytics.'}
            </p>
            <Button 
              onClick={() => router.push('/practice')}
              className={isKidsMode ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              {isKidsMode ? '🚀 Start Practicing Now!' : 'Start Practicing'}
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Score Card */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Star className={`h-5 w-5 ${isKidsMode ? 'text-purple-600' : 'text-primary'}`} />
                  {isKidsMode ? 'Your Star Score!' : 'Overall Score'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'How awesome your handwriting is!' : 'Average score across all submissions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className={`text-5xl font-bold ${isKidsMode ? 'text-purple-700' : 'text-gray-900'}`}>
                    {stats.averageScores.overall}%
                  </div>
                  <div>
                    {stats.trend === 'improved' ? (
                      <div className="flex items-center text-green-600">
                        <ArrowUpRight className="h-5 w-5 mr-1" />
                        <span className="font-medium">Improving</span>
                      </div>
                    ) : stats.trend === 'declined' ? (
                      <div className="flex items-center text-red-600">
                        <ArrowDownRight className="h-5 w-5 mr-1" />
                        <span className="font-medium">Declining</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-600">
                        <Target className="h-5 w-5 mr-1" />
                        <span className="font-medium">Stable</span>
                      </div>
                    )}
                    {stats.improvement !== 0 && (
                      <div className={`text-sm font-medium ${stats.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.improvement > 0 ? '+' : ''}{stats.improvement}% change
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Steadiness</span>
                      <span className="text-sm font-medium">{stats.averageScores.steadiness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isKidsMode ? 'bg-blue-500' : 'bg-blue-600'}`} 
                        style={{ width: `${stats.averageScores.steadiness}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Accuracy</span>
                      <span className="text-sm font-medium">{stats.averageScores.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isKidsMode ? 'bg-green-500' : 'bg-green-600'}`} 
                        style={{ width: `${stats.averageScores.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary Card */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${isKidsMode ? 'text-blue-600' : 'text-primary'}`} />
                  {isKidsMode ? 'Your Practice Adventures!' : 'Activity Summary'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'All the fun practice you\'ve done!' : 'Overview of your practice sessions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isKidsMode ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <BookOpen className={`h-5 w-5 ${isKidsMode ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Submissions</div>
                        <div className={`text-2xl font-bold ${isKidsMode ? 'text-blue-700' : 'text-gray-900'}`}>{stats.totalSubmissions}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isKidsMode ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Flame className={`h-5 w-5 ${isKidsMode ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Current Streak</div>
                        <div className={`text-2xl font-bold ${isKidsMode ? 'text-blue-700' : 'text-gray-900'}`}>{stats.streak} days</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium mb-2">Last Practice Session</div>
                    {stats.lastPracticeDate ? (
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isKidsMode ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <Clock className={`h-4 w-4 ${isKidsMode ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="text-sm">
                          {stats.lastPracticeDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No recent practice</div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium mb-2">Most Practiced</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.worksheetTypes)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([type, count]) => (
                          <Badge key={type} variant="secondary">
                            {type} ({count})
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Award className={`h-5 w-5 ${isKidsMode ? 'text-yellow-600' : 'text-primary'}`} />
                  {isKidsMode ? 'Your Awesome Badges!' : 'Achievements'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'Special awards you\'ve earned!' : 'Badges and milestones you\'ve reached'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.length > 0 ? (
                    achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          isKidsMode 
                            ? 'bg-gradient-to-br from-yellow-200 to-amber-200' 
                            : 'bg-yellow-100'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <div className={`font-medium ${isKidsMode ? 'text-yellow-800' : 'text-gray-900'}`}>{achievement.name}</div>
                          <div className="text-xs text-gray-600">{achievement.description}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className={`h-12 w-12 mx-auto mb-2 ${isKidsMode ? 'text-yellow-400' : 'text-gray-300'}`} />
                      <p className="text-sm text-gray-500">
                        {isKidsMode 
                          ? 'Keep practicing to earn awesome badges!' 
                          : 'Complete more exercises to earn achievements'}
                      </p>
                    </div>
                  )}
                  
                  {achievements.length > 0 && achievements.length < 5 && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      isKidsMode ? 'bg-yellow-100 border border-yellow-200' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Sparkles className={`h-4 w-4 ${isKidsMode ? 'text-yellow-600' : 'text-yellow-500'}`} />
                        <p className={`text-sm font-medium ${isKidsMode ? 'text-yellow-800' : 'text-yellow-700'}`}>
                          {isKidsMode 
                            ? 'More badges waiting for you!' 
                            : 'More achievements to unlock'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Chart Card */}
            <Card className={`border-0 shadow-lg lg:col-span-2 ${isKidsMode ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className={`h-5 w-5 ${isKidsMode ? 'text-green-600' : 'text-primary'}`} />
                  {isKidsMode ? 'Your Progress Journey!' : 'Progress Over Time'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'Watch how much better you\'re getting!' : 'Track your score improvements over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 1 ? (
                  <ProgressChart data={chartData} isKidsMode={isKidsMode} />
                ) : (
                  <div className="text-center py-12">
                    <LineChart className={`h-12 w-12 mx-auto mb-2 ${isKidsMode ? 'text-green-400' : 'text-gray-300'}`} />
                    <p className="text-sm text-gray-500">
                      {isKidsMode 
                        ? 'Practice more to see your progress chart grow!' 
                        : 'Complete more exercises to see your progress chart'}
                    </p>
                  </div>
                )}
                
                {chartData.length > 0 && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    isKidsMode ? 'bg-green-100 border border-green-200' : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {stats.trend === 'improved' ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : stats.trend === 'declined' ? (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        ) : (
                          <Target className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          stats.trend === 'improved' 
                            ? 'text-green-800' 
                            : stats.trend === 'declined' 
                            ? 'text-red-800' 
                            : 'text-blue-800'
                        }`}>
                          {stats.trend === 'improved' 
                            ? (isKidsMode ? '🎉 You\'re getting better and better!' : 'Your handwriting is improving!') 
                            : stats.trend === 'declined' 
                            ? (isKidsMode ? '😮 Let\'s practice a bit more!' : 'Your recent scores have decreased slightly') 
                            : (isKidsMode ? '👍 You\'re doing great, keep it up!' : 'Your scores are consistently stable')}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {stats.trend === 'improved' 
                            ? `Your average score has improved by ${Math.abs(stats.improvement)}% recently.` 
                            : stats.trend === 'declined' 
                            ? `Your average score has decreased by ${Math.abs(stats.improvement)}% recently.` 
                            : 'Your scores have been consistent over time.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skill Breakdown Card */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className={`h-5 w-5 ${isKidsMode ? 'text-pink-600' : 'text-primary'}`} />
                  {isKidsMode ? 'Your Handwriting Powers!' : 'Skill Breakdown'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'See what you\'re super good at!' : 'Analysis of your handwriting skills'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSubmissions.length > 0 ? (
                  <SkillRadarChart skills={skillRadarData} isKidsMode={isKidsMode} />
                ) : (
                  <div className="text-center py-12">
                    <PieChart className={`h-12 w-12 mx-auto mb-2 ${isKidsMode ? 'text-pink-400' : 'text-gray-300'}`} />
                    <p className="text-sm text-gray-500">
                      {isKidsMode 
                        ? 'Practice more to see your special skills!' 
                        : 'Complete more exercises to see your skill breakdown'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations Card */}
            <Card className={`border-0 shadow-lg lg:col-span-3 ${isKidsMode ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${isKidsMode ? 'text-indigo-600' : 'text-primary'}`} />
                  {isKidsMode ? 'Super Tips Just For You!' : 'Personalized Recommendations'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'Special advice to help you get even better!' : 'Tailored suggestions to improve your handwriting'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className={`p-4 rounded-lg ${
                      isKidsMode 
                        ? 'bg-indigo-100 border border-indigo-200' 
                        : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full ${
                          isKidsMode ? 'bg-indigo-200' : 'bg-blue-100'
                        }`}>
                          <CheckCircle className={`h-4 w-4 ${
                            isKidsMode ? 'text-indigo-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <p className={`${
                          isKidsMode ? 'text-indigo-800' : 'text-blue-800'
                        }`}>
                          {isKidsMode ? recommendation.replace('Practice', 'Try').replace('Focus on', 'Try to') : recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => router.push('/practice')}
                    size="lg"
                    className={isKidsMode ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    {isKidsMode ? '🚀 Continue Your Adventure!' : 'Continue Practicing'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className={`border-0 shadow-lg lg:col-span-3 ${isKidsMode ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className={`h-5 w-5 ${isKidsMode ? 'text-violet-600' : 'text-primary'}`} />
                  {isKidsMode ? 'Your Recent Masterpieces!' : 'Recent Submissions'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'Check out your latest awesome work!' : 'Your most recent handwriting exercises'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSubmissions.slice(0, 5).map((submission) => {
                    const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(submission.image_path);
                    return (
                      <div key={submission.id} className={`p-4 rounded-lg border flex items-center gap-4 ${
                        isKidsMode ? 'border-violet-200 bg-white' : 'border-gray-200'
                      }`}>
                        <img 
                          src={publicUrl} 
                          alt={`Submission for ${submission.worksheet_id}`} 
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium">{submission.worksheet_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            <div className="text-sm text-gray-500">{new Date(submission.created_at).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                              submission.score >= 80 
                                ? 'bg-green-100 text-green-800' 
                                : submission.score >= 60 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {submission.score}%
                            </div>
                            <div className="text-sm text-gray-600">
                              Steadiness: {submission.steadiness}% • Accuracy: {submission.accuracy}%
                            </div>
                          </div>
                          {submission.feedback && (
                            <div className="mt-2 text-sm text-gray-600 italic">
                              "{submission.feedback}"
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredSubmissions.length > 5 && (
                    <div className="text-center mt-4">
                      <Button variant="outline">
                        View All {filteredSubmissions.length} Submissions
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}