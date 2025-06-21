'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Tables } from '@/lib/database.types';
import { 
  Target, 
  Trophy, 
  Flame, 
  Star, 
  Crown, 
  Zap, 
  Clock,
  TrendingUp,
  Settings,
  Play,
  ChevronRight,
  Gift,
  Users,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle,
  Lock,
  PenTool,
  Smile,
  ArrowUp
} from 'lucide-react';
import Link from 'next/link';

type Profile = Tables<'profiles'>;

// Simple Progress component
interface ProgressProps {
  value: number;
  className?: string;
}

function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  totalLessons: number;
  unlockedLessons: number;
  nextLesson: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const mockAchievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👶',
    progress: 1,
    total: 1,
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Practice for 3 days in a row',
    icon: '🔥',
    progress: 2,
    total: 3,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'letter-master',
    title: 'Letter Master',
    description: 'Perfect all 26 letters',
    icon: '🎯',
    progress: 12,
    total: 26,
    unlocked: false,
    rarity: 'rare'
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: 'basic-strokes',
    title: 'Basic Strokes',
    description: 'Master fundamental writing movements',
    icon: '📏',
    color: 'from-blue-400 to-blue-600',
    progress: 85,
    totalLessons: 7,
    unlockedLessons: 6,
    nextLesson: 'Continuous Curves',
    difficulty: 'beginner'
  },
  {
    id: 'lowercase-letters',
    title: 'Lowercase Letters',
    description: 'Learn proper lowercase formation',
    icon: 'abc',
    color: 'from-green-400 to-green-600',
    progress: 45,
    totalLessons: 26,
    unlockedLessons: 12,
    nextLesson: 'Letter m',
    difficulty: 'beginner'
  },
  {
    id: 'uppercase-letters',
    title: 'Uppercase Letters',
    description: 'Perfect your capital letters',
    icon: 'ABC',
    color: 'from-purple-400 to-purple-600',
    progress: 0,
    totalLessons: 26,
    unlockedLessons: 0,
    nextLesson: 'Letter A',
    difficulty: 'intermediate'
  }
];

export default function ModernDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [totalPracticeTime, setTotalPracticeTime] = useState(145);
  const [weeklyGoal, setWeeklyGoal] = useState(150);
  const [weeklyProgress, setWeeklyProgress] = useState(90);
  const [level, setLevel] = useState(8);
  const [xp, setXp] = useState(2350);
  const [xpToNextLevel, setXpToNextLevel] = useState(650);
  
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
  }, [supabase.auth, router]);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isKidsMode = profile?.display_mode === 'kids';
  const levelProgress = (xp / (xp + xpToNextLevel)) * 100;
  const weeklyGoalProgress = (weeklyProgress / weeklyGoal) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isKidsMode 
      ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50' 
      : 'bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${isKidsMode 
        ? 'bg-white/90 border-purple-200' 
        : 'bg-white/90 border-emerald-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isKidsMode 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
                <PenTool className="h-5 w-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${isKidsMode 
                ? 'text-purple-700' 
                : 'text-emerald-700'
              }`}>
                {isKidsMode ? '✨ Flourish - My Writing Adventure!' : 'Flourish'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="flex items-center gap-2">
                <Flame className={`h-5 w-5 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className={`font-bold ${isKidsMode ? 'text-purple-700' : 'text-emerald-700'}`}>
                  {currentStreak}
                </span>
              </div>
              
              {/* XP */}
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className={`font-bold ${isKidsMode ? 'text-purple-700' : 'text-emerald-700'}`}>
                  {xp.toLocaleString()}
                </span>
              </div>

              {/* Settings */}
              <Link href="/profile/settings">
                <Button variant="ghost" size="sm" className={isKidsMode ? 'text-purple-600 hover:bg-purple-50' : 'text-emerald-600 hover:bg-emerald-50'}>
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>

              {/* Sign Out */}
              <Button onClick={handleSignOut} variant="outline" size="sm" className={isKidsMode ? 'border-purple-200 text-purple-700 hover:bg-purple-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
                {isKidsMode ? '👋 Bye!' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-2xl font-bold ${isKidsMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600'
              }`}>
                {isKidsMode 
                  ? `🌟 Welcome back, ${profile?.full_name || 'Superstar'}!` 
                  : `Welcome back, ${profile?.full_name || user.email}`
                }
              </h2>
              <p className={`text-lg ${isKidsMode ? 'text-purple-600' : 'text-emerald-600'}`}>
                {isKidsMode 
                  ? 'Ready for another amazing writing adventure? 🚀'
                  : 'Continue your handwriting journey'
                }
              </p>
            </div>
            
            {/* Level Badge */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${isKidsMode 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
            }`}>
              <Crown className="h-5 w-5" />
              <div className="text-center">
                <div className="text-sm font-medium">Level</div>
                <div className="text-xl font-bold">{level}</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isKidsMode ? 'text-purple-700' : 'text-emerald-700'}`}>
                {isKidsMode ? '⭐ Progress to Next Level' : 'Progress to Level ' + (level + 1)}
              </span>
              <span className={`text-sm ${isKidsMode ? 'text-purple-600' : 'text-emerald-600'}`}>
                {xp.toLocaleString()} / {(xp + xpToNextLevel).toLocaleString()} XP
              </span>
            </div>
            <Progress value={levelProgress} className={`h-3 ${isKidsMode ? 'bg-purple-100' : 'bg-emerald-100'}`} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Current Streak */}
          <Card className={`${isKidsMode 
            ? 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50' 
            : 'border-0 shadow-lg'
          } transition-all duration-200 hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isKidsMode ? 'text-orange-700' : 'text-muted-foreground'}`}>
                    {isKidsMode ? '🔥 Fire Streak!' : 'Current Streak'}
                  </p>
                  <p className={`text-3xl font-bold ${isKidsMode ? 'text-orange-800' : 'text-foreground'}`}>
                    {currentStreak}
                  </p>
                  <p className={`text-xs ${isKidsMode ? 'text-orange-600' : 'text-muted-foreground'}`}>
                    {isKidsMode ? 'Days of awesome practice!' : 'days'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${isKidsMode ? 'bg-orange-200' : 'bg-orange-100'}`}>
                  <Flame className={`h-6 w-6 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goal */}
          <Card className={`${isKidsMode 
            ? 'border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
            : 'border-0 shadow-lg'
          } transition-all duration-200 hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isKidsMode ? 'text-green-700' : 'text-muted-foreground'}`}>
                    {isKidsMode ? '🎯 Weekly Goal' : 'Weekly Goal'}
                  </p>
                  <p className={`text-3xl font-bold ${isKidsMode ? 'text-green-800' : 'text-foreground'}`}>
                    {Math.round(weeklyGoalProgress)}%
                  </p>
                  <p className={`text-xs ${isKidsMode ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {weeklyProgress} / {weeklyGoal} min
                  </p>
                </div>
                <div className={`p-3 rounded-full ${isKidsMode ? 'bg-green-200' : 'bg-green-100'}`}>
                  <Target className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <Progress value={weeklyGoalProgress} className="mt-3 h-2" />
            </CardContent>
          </Card>

          {/* Total Practice Time */}
          <Card className={`${isKidsMode 
            ? 'border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50' 
            : 'border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50'
          } transition-all duration-200 hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isKidsMode ? 'text-blue-700' : 'text-teal-700'}`}>
                    {isKidsMode ? '⏰ Total Practice' : 'Total Practice'}
                  </p>
                  <p className={`text-3xl font-bold ${isKidsMode ? 'text-blue-800' : 'text-teal-800'}`}>
                    {Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m
                  </p>
                  <p className={`text-xs ${isKidsMode ? 'text-blue-600' : 'text-teal-600'}`}>
                    {isKidsMode ? 'Time well spent!' : 'this month'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${isKidsMode ? 'bg-blue-200' : 'bg-teal-200'}`}>
                  <Clock className={`h-6 w-6 ${isKidsMode ? 'text-blue-500' : 'text-teal-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className={`${isKidsMode 
            ? 'border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' 
            : 'border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50'
          } transition-all duration-200 hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isKidsMode ? 'text-purple-700' : 'text-indigo-700'}`}>
                    {isKidsMode ? '🏆 Achievements' : 'Achievements'}
                  </p>
                  <p className={`text-3xl font-bold ${isKidsMode ? 'text-purple-800' : 'text-indigo-800'}`}>
                    {mockAchievements.filter(a => a.unlocked).length}
                  </p>
                  <p className={`text-xs ${isKidsMode ? 'text-purple-600' : 'text-indigo-600'}`}>
                    of {mockAchievements.length} unlocked
                  </p>
                </div>
                <div className={`p-3 rounded-full ${isKidsMode ? 'bg-purple-200' : 'bg-indigo-200'}`}>
                  <Trophy className={`h-6 w-6 ${isKidsMode ? 'text-purple-500' : 'text-indigo-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Learning Path */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isKidsMode ? 'text-purple-700' : 'text-emerald-700'}`}>
                {isKidsMode ? '🎮 Your Learning Adventure!' : 'Your Learning Path'}
              </h3>
              <Link href="/practice">
                <Button className={isKidsMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                }>
                  {isKidsMode ? '🚀 Continue Adventure!' : 'Continue Learning'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {mockLearningPaths.map((path, index) => {
                const isLocked = path.progress === 0 && index > 1;
                
                return (
                  <Card 
                    key={path.id} 
                    className={`transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                      isLocked 
                        ? 'opacity-60' 
                        : isKidsMode 
                          ? 'border-2 hover:shadow-xl' 
                          : 'border-0 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className={`p-6 rounded-t-lg bg-gradient-to-r ${path.color} text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">
                              {isLocked ? '🔒' : path.icon}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{path.title}</h4>
                              <p className="text-white/90">{path.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`mb-2 ${getDifficultyColor(path.difficulty)} text-xs`}>
                              {path.difficulty}
                            </Badge>
                            <div className="text-sm font-medium">
                              {path.unlockedLessons} / {path.totalLessons}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            {isLocked ? 'Complete previous paths to unlock' : `Next: ${path.nextLesson}`}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {isLocked ? '' : `${Math.round(path.progress)}% complete`}
                          </span>
                        </div>
                        
                        {!isLocked && (
                          <div className="flex items-center gap-3">
                            <Progress value={path.progress} className="flex-1 h-2" />
                            <Link href="/practice">
                              <Button size="sm" className={isKidsMode 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                                : ''
                              }>
                                {isKidsMode ? '▶️ Play!' : 'Continue'}
                              </Button>
                            </Link>
                          </div>
                        )}
                        
                        {isLocked && (
                          <div className="flex items-center justify-center py-4">
                            <Lock className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <Card className={`${isKidsMode 
              ? 'border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' 
              : 'border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isKidsMode ? 'text-yellow-700' : 'text-amber-700'}`}>
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {isKidsMode ? '⚡ Today\'s Challenge!' : 'Daily Challenge'}
                </CardTitle>
                <CardDescription className={isKidsMode ? 'text-yellow-600' : 'text-amber-600'}>
                  {isKidsMode ? 'Complete this for bonus XP!' : 'Complete for bonus XP'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">📝</div>
                  <div>
                    <h4 className="font-semibold">Perfect 10 Letters</h4>
                    <p className="text-sm text-gray-600">Write 10 letters with 100% accuracy</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Progress: 7/10</span>
                  <span className="text-sm text-yellow-600 font-medium">+50 XP</span>
                </div>
                <Progress value={70} className="mb-4" />
                <Button className={`w-full ${isKidsMode 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                }`}>
                  {isKidsMode ? '🎯 Continue Challenge!' : 'Continue Challenge'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`${isKidsMode 
              ? 'border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50' 
              : 'border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isKidsMode ? 'text-blue-700' : 'text-sky-700'}`}>
                  <Sparkles className="h-5 w-5" />
                  {isKidsMode ? '⚡ Quick Actions!' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/practice" className="block">
                  <Button variant="outline" className={`w-full justify-start ${isKidsMode 
                    ? 'border-purple-200 hover:bg-purple-50 text-purple-700' 
                    : 'border-emerald-200 hover:bg-emerald-50 text-emerald-700'
                  }`}>
                    <Play className="h-4 w-4 mr-2" />
                    {isKidsMode ? '🎮 Start Practice!' : 'Quick Practice'}
                  </Button>
                </Link>
                
                <Link href="/worksheets" className="block">
                  <Button variant="outline" className={`w-full justify-start ${isKidsMode 
                    ? 'border-green-200 hover:bg-green-50 text-green-700' 
                    : 'border-teal-200 hover:bg-teal-50 text-teal-700'
                  }`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    {isKidsMode ? '📄 Get Worksheets!' : 'Browse Worksheets'}
                  </Button>
                </Link>
                
                <Button variant="outline" className={`w-full justify-start ${isKidsMode 
                  ? 'border-pink-200 hover:bg-pink-50 text-pink-700' 
                  : 'border-indigo-200 hover:bg-indigo-50 text-indigo-700'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {isKidsMode ? '📊 See My Progress!' : 'View Progress'}
                </Button>
              </CardContent>
            </Card>: ''
                  }`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    {isKidsMode ? '📄 Get Worksheets!' : 'Browse Worksheets'}
                  </Button>
                </Link>
                
                <Button variant="outline" className={`w-full justify-start ${isKidsMode 
                  ? 'border-pink-200 hover:bg-pink-50' 
                  : ''
                }`}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {isKidsMode ? '📊 See My Progress!' : 'View Progress'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <Card className={`${isKidsMode 
            ? 'border-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100' 
            : 'border-2 border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100'
          } p-8`}>
            <div className="max-w-2xl mx-auto">
              <div className="text-4xl mb-4">
                {isKidsMode ? '🌟' : '✨'}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isKidsMode ? 'text-purple-700' : 'text-emerald-700'}`}>
                {isKidsMode ? 'Ready for Your Next Adventure?' : 'Ready to Continue Learning?'}
              </h3>
              <p className={`text-lg mb-6 ${isKidsMode ? 'text-purple-600' : 'text-emerald-600'}`}>
                {isKidsMode 
                  ? 'Every practice session makes you a better writer! Let\'s keep the magic going! ✨'
                  : 'Consistent practice leads to beautiful handwriting. Your next breakthrough is just one session away.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/practice">
                  <Button size="lg" className={`px-8 ${isKidsMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg'
                  }`}>
                    <Play className="h-5 w-5 mr-2" />
                    {isKidsMode ? '🚀 Start Practicing!' : 'Start Practicing'}
                  </Button>
                </Link>
                <Link href="/worksheets">
                  <Button variant="outline" size="lg" className={`px-8 ${isKidsMode 
                    ? 'border-purple-200 text-purple-700 hover:bg-purple-50' 
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  }`}>
                    <BookOpen className="h-5 w-5 mr-2" />
                    {isKidsMode ? '📄 Browse Worksheets' : 'Browse Worksheets'}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}