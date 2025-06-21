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
  Users,
  BookOpen,
  Sparkles,
  CheckCircle,
  Lock,
  PenTool
} from 'lucide-react';
import Link from 'next/link';

type Profile = Tables<'profiles'>;

function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 ${className}`}>
      <div 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

const mockLearningPaths = [
  {
    id: 'basic-strokes',
    title: 'Basic Strokes',
    description: 'Master fundamental writing movements',
    icon: '📏',
    color: 'from-indigo-500 to-purple-600',
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
    color: 'from-emerald-500 to-teal-600',
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
    color: 'from-rose-500 to-pink-600',
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
  const [currentStreak] = useState(12);
  const [totalPracticeTime] = useState(145);
  const [weeklyGoal] = useState(150);
  const [weeklyProgress] = useState(90);
  const [level] = useState(8);
  const [xp] = useState(2350);
  const [xpToNextLevel] = useState(650);
  
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
      const { data } = await supabase
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const isKidsMode = profile?.display_mode === 'kids';
  const levelProgress = (xp / (xp + xpToNextLevel)) * 100;
  const weeklyGoalProgress = (weeklyProgress / weeklyGoal) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isKidsMode 
      ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50' 
      : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50'
    }`}>
      <header className="sticky top-0 z-50 border-b border-slate-200/60 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isKidsMode 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25'
              }`}>
                <PenTool className="h-5 w-5 text-white" />
              </div>
              <h1 className={`text-xl font-semibold ${isKidsMode 
                ? 'text-purple-700' 
                : 'text-slate-800'
              }`}>
                {isKidsMode ? '✨ Flourish' : 'Flourish'}
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-full border border-orange-200">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-700 text-sm">{currentStreak}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-full border border-yellow-200">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-amber-700 text-sm">{xp.toLocaleString()}</span>
              </div>

              <Link href="/profile/settings">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>

              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                size="sm" 
                className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              >
                {isKidsMode ? '👋 Bye!' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-3xl font-bold ${isKidsMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'text-slate-800'
              }`}>
                {isKidsMode 
                  ? `🌟 Welcome back, ${profile?.full_name || 'Superstar'}!` 
                  : `Welcome back, ${profile?.full_name || user.email?.split('@')[0]}`
                }
              </h2>
              <p className={`text-lg mt-1 ${isKidsMode ? 'text-purple-600' : 'text-slate-600'}`}>
                {isKidsMode 
                  ? 'Ready for another amazing writing adventure? 🚀'
                  : 'Continue your handwriting journey'
                }
              </p>
            </div>
            
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${isKidsMode 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
            }`}>
              <Crown className="h-5 w-5" />
              <div className="text-center">
                <div className="text-sm font-medium opacity-90">Level</div>
                <div className="text-xl font-bold">{level}</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isKidsMode ? 'text-purple-700' : 'text-slate-700'}`}>
                {isKidsMode ? '⭐ Progress to Next Level' : 'Progress to Level ' + (level + 1)}
              </span>
              <span className={`text-sm ${isKidsMode ? 'text-purple-600' : 'text-slate-600'}`}>
                {xp.toLocaleString()} / {(xp + xpToNextLevel).toLocaleString()} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">
                    {isKidsMode ? '🔥 Fire Streak!' : 'Current Streak'}
                  </p>
                  <p className="text-3xl font-bold text-orange-700">
                    {currentStreak}
                  </p>
                  <p className="text-xs text-orange-600">
                    {isKidsMode ? 'Days of awesome practice!' : 'days'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">
                    {isKidsMode ? '🎯 Weekly Goal' : 'Weekly Goal'}
                  </p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {Math.round(weeklyGoalProgress)}%
                  </p>
                  <p className="text-xs text-emerald-600">
                    {weeklyProgress} / {weeklyGoal} min
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                  <Target className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={weeklyGoalProgress} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">
                    {isKidsMode ? '⏰ Total Practice' : 'Total Practice'}
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    {Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m
                  </p>
                  <p className="text-xs text-blue-600">
                    {isKidsMode ? 'Time well spent!' : 'this month'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    {isKidsMode ? '🏆 Achievements' : 'Achievements'}
                  </p>
                  <p className="text-3xl font-bold text-purple-700">
                    3
                  </p>
                  <p className="text-xs text-purple-600">
                    of 10 unlocked
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                  <Trophy className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${isKidsMode ? 'text-purple-700' : 'text-slate-800'}`}>
                {isKidsMode ? '🎮 Your Learning Adventure!' : 'Your Learning Path'}
              </h3>
              <Link href="/practice">
                <Button className={`${isKidsMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                } text-white border-0`}>
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
                    className={`transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl ${
                      isLocked ? 'opacity-60' : ''
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className={`p-6 rounded-t-2xl bg-gradient-to-r ${path.color} text-white shadow-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                              {isLocked ? '🔒' : path.icon}
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold">{path.title}</h4>
                              <p className="text-white/90">{path.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`mb-2 border ${getDifficultyColor(path.difficulty)} text-xs font-medium`}>
                              {path.difficulty}
                            </Badge>
                            <div className="text-sm font-medium">
                              {path.unlockedLessons} / {path.totalLessons}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-slate-700">
                            {isLocked ? 'Complete previous paths to unlock' : `Next: ${path.nextLesson}`}
                          </span>
                          <span className="text-sm text-slate-500">
                            {isLocked ? '' : `${Math.round(path.progress)}% complete`}
                          </span>
                        </div>
                        
                        {!isLocked && (
                          <div className="flex items-center gap-4">
                            <Progress value={path.progress} className="flex-1 h-2" />
                            <Link href="/practice">
                              <Button 
                                size="sm" 
                                className={`${isKidsMode 
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                                } text-white border-0 shadow-lg`}
                              >
                                {isKidsMode ? '▶️ Play!' : 'Continue'}
                              </Button>
                            </Link>
                          </div>
                        )}
                        
                        {isLocked && (
                          <div className="flex items-center justify-center py-6">
                            <Lock className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <Zap className="h-5 w-5 text-amber-500" />
                  {isKidsMode ? '⚡ Today\'s Challenge!' : 'Daily Challenge'}
                </CardTitle>
                <CardDescription className="text-amber-600">
                  {isKidsMode ? 'Complete this for bonus XP!' : 'Complete for bonus XP'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-3 border border-amber-100">📝</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Perfect 10 Letters</h4>
                    <p className="text-sm text-slate-600">Write 10 letters with 100% accuracy</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-700">Progress: 7/10</span>
                  <span className="text-sm text-amber-600 font-medium">+50 XP</span>
                </div>
                <Progress value={70} className="mb-4" />
                <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-lg">
                  {isKidsMode ? '🎯 Continue Challenge!' : 'Continue Challenge'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  {isKidsMode ? '⚡ Quick Actions!' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/practice" className="block">
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-800">
                    <Play className="h-4 w-4 mr-2" />
                    {isKidsMode ? '🎮 Start Practice!' : 'Quick Practice'}
                  </Button>
                </Link>
                
                <Link href="/worksheets" className="block">
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-800">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {isKidsMode ? '📄 Get Worksheets!' : 'Browse Worksheets'}
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-800">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {isKidsMode ? '📊 See My Progress!' : 'View Progress'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-4xl mb-4">
                {isKidsMode ? '🌟' : '✨'}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isKidsMode ? 'text-purple-700' : 'text-slate-800'}`}>
                {isKidsMode ? 'Ready for Your Next Adventure?' : 'Ready to Continue Learning?'}
              </h3>
              <p className={`text-lg mb-6 ${isKidsMode ? 'text-purple-600' : 'text-slate-600'}`}>
                {isKidsMode 
                  ? 'Every practice session makes you a better writer! Let\'s keep the magic going! ✨'
                  : 'Consistent practice leads to beautiful handwriting. Your next breakthrough is just one session away.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/practice">
                  <Button size="lg" className={`px-8 ${isKidsMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                  } text-white border-0 text-lg`}>
                    <Play className="h-5 w-5 mr-2" />
                    {isKidsMode ? '🚀 Start Practicing!' : 'Start Practicing'}
                  </Button>
                </Link>
                <Link href="/worksheets">
                  <Button variant="outline" size="lg" className="px-8 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800">
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