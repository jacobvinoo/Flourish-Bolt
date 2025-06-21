'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  PenTool,
  User,
  LogOut
} from 'lucide-react';
import { Database, Tables } from '@/lib/database.types';

type Profile = Tables<'profiles'>;

function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 ${className}`}>
      <div 
        className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
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
    progress: 85,
    totalLessons: 7,
    unlockedLessons: 6,
    nextLesson: 'Continuous Curves',
    difficulty: 'beginner',
    href: '/practice'
  },
  {
    id: 'lowercase-letters',
    title: 'Lowercase Letters',
    description: 'Learn proper lowercase formation',
    icon: 'abc',
    progress: 45,
    totalLessons: 26,
    unlockedLessons: 12,
    nextLesson: 'Letter m',
    difficulty: 'beginner',
    href: '/practice/lowercase'
  },
  {
    id: 'uppercase-letters',
    title: 'Uppercase Letters',
    description: 'Perfect your capital letters',
    icon: 'ABC',
    progress: 0,
    totalLessons: 26,
    unlockedLessons: 0,
    nextLesson: 'Letter A',
    difficulty: 'intermediate',
    href: '/practice/uppercase'
  }
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
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
  }, []);

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
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const levelProgress = (xp / (xp + xpToNextLevel)) * 100;
  const weeklyGoalProgress = (weeklyProgress / weeklyGoal) * 100;
  const isKidsMode = profile?.display_mode === 'kids';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${
      isKidsMode 
        ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50' 
        : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`${
        isKidsMode 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isKidsMode ? 'bg-white/20' : 'bg-green-600'
              }`}>
                <PenTool className={`h-4 w-4 ${
                  isKidsMode ? 'text-white' : 'text-white'
                }`} />
              </div>
              <h1 className={`text-xl font-bold ${
                isKidsMode ? 'text-white' : 'text-gray-900'
              }`}>
                {isKidsMode ? '✨ Flourish Kids!' : 'Flourish'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isKidsMode 
                  ? 'bg-orange-400 text-white' 
                  : 'bg-orange-500 text-white'
              }`}>
                <Flame className="h-4 w-4" />
                <span className="font-bold text-sm">{currentStreak}</span>
              </div>
              
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isKidsMode 
                  ? 'bg-yellow-400 text-yellow-900' 
                  : 'bg-orange-500 text-white'
              }`}>
                <Star className="h-4 w-4" />
                <span className="font-bold text-sm">{xp.toLocaleString()}</span>
              </div>

              <Link href="/profile/settings">
                <button className={`p-2 rounded-lg transition-colors ${
                  isKidsMode 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}>
                  <Settings className="h-4 w-4" />
                </button>
              </Link>

              <Link href="/profile">
                <button className={`p-2 rounded-lg transition-colors ${
                  isKidsMode 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}>
                  <User className="h-4 w-4" />
                </button>
              </Link>

              <button 
                onClick={handleSignOut}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isKidsMode 
                    ? 'text-white/90 hover:bg-white/10' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isKidsMode ? '👋 Bye!' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-3xl font-bold ${
                isKidsMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'text-gray-900'
              }`}>
                {isKidsMode ? (
                  <>🌟 Hi there, <span className="text-purple-600">{profile?.full_name}</span>!</>
                ) : (
                  <>Welcome back, <span className="text-green-700">{profile?.full_name}</span></>
                )}
              </h2>
              <p className={`text-lg mt-1 ${
                isKidsMode ? 'text-purple-700' : 'text-gray-600'
              }`}>
                {isKidsMode 
                  ? 'Ready for some handwriting fun? 🎨✨' 
                  : 'Continue your handwriting journey'
                }
              </p>
            </div>
            
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm ${
              isKidsMode 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              <Crown className="h-5 w-5" />
              <div className="text-center">
                <div className="text-sm font-medium opacity-90">Level</div>
                <div className="text-xl font-bold">{level}</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className={`mb-8 p-6 rounded-2xl border ${
            isKidsMode 
              ? 'bg-white border-purple-200 shadow-lg' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${
                isKidsMode ? 'text-purple-700' : 'text-gray-700'
              }`}>
                {isKidsMode ? `🚀 Almost Level ${level + 1}!` : `Progress to Level ${level + 1}`}
              </span>
              <span className={`text-sm ${
                isKidsMode ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {xp.toLocaleString()} / {(xp + xpToNextLevel).toLocaleString()} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-2xl p-6 border transition-shadow ${
            isKidsMode 
              ? 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-200 hover:shadow-lg' 
              : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  isKidsMode ? 'text-orange-700' : 'text-gray-600'
                }`}>
                  {isKidsMode ? '🔥 Streak' : 'Current Streak'}
                </p>
                <p className={`text-3xl font-bold ${
                  isKidsMode ? 'text-orange-800' : 'text-gray-900'
                }`}>{currentStreak}</p>
                <p className={`text-xs ${
                  isKidsMode ? 'text-orange-600' : 'text-gray-500'
                }`}>days</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isKidsMode ? 'bg-orange-400' : 'bg-orange-500'
              }`}>
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 border transition-shadow ${
            isKidsMode 
              ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-200 hover:shadow-lg' 
              : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  isKidsMode ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {isKidsMode ? '🎯 Weekly Goal' : 'Weekly Goal'}
                </p>
                <p className={`text-3xl font-bold ${
                  isKidsMode ? 'text-green-800' : 'text-gray-900'
                }`}>{Math.round(weeklyGoalProgress)}%</p>
                <p className={`text-xs ${
                  isKidsMode ? 'text-green-600' : 'text-gray-500'
                }`}>{weeklyProgress} / {weeklyGoal} min</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isKidsMode ? 'bg-green-500' : 'bg-green-600'
              }`}>
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={weeklyGoalProgress} className="h-2" />
            </div>
          </div>

          <div className={`rounded-2xl p-6 border transition-shadow ${
            isKidsMode 
              ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200 hover:shadow-lg' 
              : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  isKidsMode ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {isKidsMode ? '⏰ Practice Time' : 'Total Practice'}
                </p>
                <p className={`text-3xl font-bold ${
                  isKidsMode ? 'text-blue-800' : 'text-gray-900'
                }`}>
                  {Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m
                </p>
                <p className={`text-xs ${
                  isKidsMode ? 'text-blue-600' : 'text-gray-500'
                }`}>this month</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isKidsMode ? 'bg-blue-500' : 'bg-blue-500'
              }`}>
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 border transition-shadow ${
            isKidsMode 
              ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 hover:shadow-lg' 
              : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  isKidsMode ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  {isKidsMode ? '🏆 Achievements' : 'Achievements'}
                </p>
                <p className={`text-3xl font-bold ${
                  isKidsMode ? 'text-purple-800' : 'text-gray-900'
                }`}>3</p>
                <p className={`text-xs ${
                  isKidsMode ? 'text-purple-600' : 'text-gray-500'
                }`}>of 10 unlocked</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isKidsMode ? 'bg-purple-500' : 'bg-purple-500'
              }`}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Paths */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${
                isKidsMode ? 'text-purple-800' : 'text-gray-900'
              }`}>
                {isKidsMode ? '🎮 Your Learning Adventure!' : 'Your Learning Path'}
              </h3>
              <Link href="/practice">
                <button className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${
                  isKidsMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                  {isKidsMode ? '🚀 Start Learning!' : 'Continue Learning'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            <div className="space-y-4">
              {mockLearningPaths.map((path, index) => {
                const isLocked = path.progress === 0 && index > 1;
                
                return (
                  <Link key={path.id} href={isLocked ? '#' : path.href}>
                    <div className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isKidsMode 
                        ? isLocked 
                          ? 'bg-gray-100 border-gray-200 opacity-60' 
                          : 'bg-white border-purple-200 hover:shadow-lg hover:scale-102'
                        : isLocked 
                          ? 'bg-white border-gray-200 opacity-60' 
                          : 'bg-white border-gray-200 hover:shadow-md'
                    }`}>
                      {/* Header */}
                      <div className={`p-6 border-b ${
                        isKidsMode ? 'border-purple-100' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`text-4xl rounded-xl p-3 ${
                              isKidsMode 
                                ? isLocked 
                                  ? 'bg-gray-100' 
                                  : 'bg-gradient-to-br from-purple-100 to-pink-100'
                                : 'bg-gray-50'
                            }`}>
                              {isLocked ? '🔒' : path.icon}
                            </div>
                            <div>
                              <h4 className={`text-xl font-bold ${
                                isKidsMode ? 'text-purple-800' : 'text-gray-900'
                              }`}>{path.title}</h4>
                              <p className={`${
                                isKidsMode ? 'text-purple-600' : 'text-gray-600'
                              }`}>{path.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`mb-2 px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(path.difficulty)}`}>
                              {path.difficulty}
                            </div>
                            <div className={`text-sm font-medium ${
                              isKidsMode ? 'text-purple-600' : 'text-gray-500'
                            }`}>
                              {path.unlockedLessons} / {path.totalLessons}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-sm font-medium ${
                            isKidsMode ? 'text-purple-700' : 'text-gray-700'
                          }`}>
                            {isLocked 
                              ? (isKidsMode ? '🔓 Complete previous adventures!' : 'Complete previous paths to unlock')
                              : (isKidsMode ? `🎯 Next: ${path.nextLesson}` : `Next: ${path.nextLesson}`)
                            }
                          </span>
                          <span className={`text-sm font-bold ${
                            isKidsMode ? 'text-purple-700' : 'text-green-700'
                          }`}>
                            {isLocked ? '' : `${Math.round(path.progress)}% complete`}
                          </span>
                        </div>
                        
                        {!isLocked && (
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Progress value={path.progress} className="h-2" />
                            </div>
                            <button className={`px-6 py-2 rounded-xl font-bold transition-colors ${
                              isKidsMode 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}>
                              {isKidsMode ? '▶️ Play!' : 'Continue'}
                            </button>
                          </div>
                        )}
                        
                        {isLocked && (
                          <div className="flex items-center justify-center py-6">
                            <Lock className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <div className={`rounded-2xl border p-6 ${
              isKidsMode 
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className={`h-5 w-5 ${
                  isKidsMode ? 'text-yellow-700' : 'text-yellow-600'
                }`} />
                <h3 className={`font-bold ${
                  isKidsMode ? 'text-yellow-800' : 'text-gray-900'
                }`}>
                  {isKidsMode ? '⚡ Daily Challenge!' : 'Daily Challenge'}
                </h3>
              </div>
              <p className={`text-sm mb-4 ${
                isKidsMode ? 'text-yellow-700' : 'text-gray-600'
              }`}>
                {isKidsMode ? 'Complete for bonus stars!' : 'Complete for bonus XP'}
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`text-3xl rounded-xl p-3 ${
                  isKidsMode ? 'bg-yellow-300' : 'bg-yellow-500'
                }`}>📝</div>
                <div>
                  <h4 className={`font-bold ${
                    isKidsMode ? 'text-yellow-800' : 'text-gray-900'
                  }`}>
                    {isKidsMode ? 'Perfect 10 Super Letters!' : 'Perfect 10 Letters'}
                  </h4>
                  <p className={`text-sm ${
                    isKidsMode ? 'text-yellow-700' : 'text-gray-600'
                  }`}>
                    {isKidsMode ? 'Write 10 letters perfectly!' : 'Write 10 letters with 100% accuracy'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${
                  isKidsMode ? 'text-yellow-700' : 'text-gray-700'
                }`}>Progress: 7/10</span>
                <span className={`text-sm font-bold ${
                  isKidsMode ? 'text-yellow-800' : 'text-yellow-600'
                }`}>
                  {isKidsMode ? '+50 ⭐' : '+50 XP'}
                </span>
              </div>
              <Progress value={70} className="mb-4 h-2" />
              <Link href="/practice">
                <button className={`w-full px-4 py-3 rounded-xl font-bold transition-colors ${
                  isKidsMode 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}>
                  {isKidsMode ? '🎮 Continue Challenge!' : 'Continue Challenge'}
                </button>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-2xl border p-6 ${
              isKidsMode 
                ? 'bg-white border-pink-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={`h-5 w-5 ${
                  isKidsMode ? 'text-pink-600' : 'text-purple-600'
                }`} />
                <h3 className={`font-bold ${
                  isKidsMode ? 'text-pink-800' : 'text-gray-900'
                }`}>
                  {isKidsMode ? '✨ Quick Fun!' : 'Quick Actions'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <Link href="/practice">
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                    isKidsMode 
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-800' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <Play className="h-4 w-4" />
                    <span className="font-medium">
                      {isKidsMode ? '🎮 Quick Practice!' : 'Quick Practice'}
                    </span>
                  </button>
                </Link>
                
                <Link href="/worksheets">
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                    isKidsMode 
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-800' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">
                      {isKidsMode ? '📚 Fun Worksheets!' : 'Browse Worksheets'}
                    </span>
                  </button>
                </Link>
                
                <Link href="/progress">
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                    isKidsMode 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-800' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">
                      {isKidsMode ? '📈 My Progress!' : 'View Progress'}
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className={`rounded-2xl border p-8 max-w-2xl mx-auto ${
            isKidsMode 
              ? 'bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-4xl mb-4">
              {isKidsMode ? '🎨' : '🌟'}
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${
              isKidsMode ? 'text-purple-800' : 'text-gray-900'
            }`}>
              {isKidsMode 
                ? 'Ready for More Fun Writing?' 
                : 'Ready to Continue Learning?'
              }
            </h3>
            <p className={`text-lg mb-6 ${
              isKidsMode ? 'text-purple-600' : 'text-gray-600'
            }`}>
              {isKidsMode 
                ? 'Every line you draw makes you a writing superstar! Let\'s create something amazing together! ✨'
                : 'Consistent practice leads to beautiful handwriting. Your next breakthrough is just one session away.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/practice">
                <button className={`px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 text-lg ${
                  isKidsMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                  <Play className="h-5 w-5" />
                  <span>{isKidsMode ? '🚀 Start Playing!' : 'Start Practicing'}</span>
                </button>
              </Link>
              <Link href="/worksheets">
                <button className={`px-8 py-3 rounded-xl transition-colors flex items-center gap-2 text-lg font-medium ${
                  isKidsMode 
                    ? 'border-2 border-purple-300 text-purple-700 hover:bg-purple-50' 
                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  <BookOpen className="h-5 w-5" />
                  <span>{isKidsMode ? '📚 Fun Worksheets!' : 'Browse Worksheets'}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}