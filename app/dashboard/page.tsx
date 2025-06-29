'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
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
  LogOut,
  AlertTriangle
} from 'lucide-react';

import { Database, Profile } from '@/lib/database.types';

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

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [totalPracticeTime] = useState(145);
  const [weeklyGoal] = useState(150);
  const [weeklyProgress] = useState(90);
  const [level] = useState(8);
  const [xpToNextLevel] = useState(650);
  const [completedWorksheets, setCompletedWorksheets] = useState<Set<string>>(new Set());

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Dashboard Auth Event:', event);
      if (session) {
        // User is signed in
        setUser(session.user);
        await fetchProfile(session.user.id);
        await fetchCompletedWorksheets(session.user.id);
        setLoading(false);
      } else {
        // User is not signed in, redirect to login
        console.log('Dashboard: No session found, redirecting to login');
        router.push('/login');
      }
    });

    // The cleanup function unsubscribes from the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Dashboard: Fetching profile for user:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Dashboard: Profile fetch error:', error);
        return;
      }

      console.log('Dashboard: Profile fetched:', data);
      setProfile(data);
    } catch (error: any) {
      console.error('Dashboard: Error fetching profile:', error);
    }
  };

  const fetchCompletedWorksheets = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('worksheet_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching completed worksheets:', error);
        return;
      }

      if (data) {
        // Create a Set of unique worksheet IDs that the user has completed
        const completedIds = new Set(data.map(sub => sub.worksheet_id));
        setCompletedWorksheets(completedIds);
      }
    } catch (error) {
      console.error('Error fetching completed worksheets:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
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

  // Calculate completed lessons for each learning path
  const mockLearningPaths = [
    {
      id: 'basic-strokes',
      title: 'Basic Strokes',
      description: 'Master fundamental writing movements',
      icon: '📏',
      totalLessons: 7,
      unlockedLessons: 6,
      nextLesson: 'Continuous Curves',
      difficulty: 'beginner',
      href: '/practice',
      worksheetIds: ['vertical-lines', 'horizontal-lines', 'circles', 'diagonal-lines', 'intersecting-lines', 'basic-shapes', 'continuous-curves']
    },
    {
      id: 'lowercase-letters',
      title: 'Lowercase Letters',
      description: 'Learn proper lowercase formation',
      icon: 'abc',
      totalLessons: 26,
      unlockedLessons: 12,
      nextLesson: 'Letter m',
      difficulty: 'beginner',
      href: '/practice/lowercase',
      worksheetIds: ['letter-a', 'letter-b', 'letter-c', 'letter-d', 'letter-e', 'letter-f', 'letter-g', 'letter-h', 'letter-i', 'letter-j', 'letter-k', 'letter-l', 'letter-m', 'letter-n', 'letter-o', 'letter-p', 'letter-q', 'letter-r', 'letter-s', 'letter-t', 'letter-u', 'letter-v', 'letter-w', 'letter-x', 'letter-y', 'letter-z']
    },
    {
      id: 'uppercase-letters',
      title: 'Uppercase Letters',
      description: 'Perfect your capital letters',
      icon: 'ABC',
      totalLessons: 26,
      unlockedLessons: 0,
      nextLesson: 'Letter A',
      difficulty: 'intermediate',
      href: '/practice/uppercase',
      worksheetIds: ['letter-A', 'letter-B', 'letter-C', 'letter-D', 'letter-E', 'letter-F', 'letter-G', 'letter-H', 'letter-I', 'letter-J', 'letter-K', 'letter-L', 'letter-M', 'letter-N', 'letter-O', 'letter-P', 'letter-Q', 'letter-R', 'letter-S', 'letter-T', 'letter-U', 'letter-V', 'letter-W', 'letter-X', 'letter-Y', 'letter-Z']
    }
  ].map(path => {
    // Calculate completed lessons based on user's submissions
    const completedCount = path.worksheetIds ? 
      path.worksheetIds.filter(id => completedWorksheets.has(id)).length : 0;
    
    return {
      ...path,
      completedLessons: completedCount,
      progress: path.totalLessons > 0 ? (completedCount / path.totalLessons) * 100 : 0
    };
  });

  const levelProgress = (profile?.xp ?? 0 / (profile?.xp ?? 0 + xpToNextLevel)) * 100;
  const weeklyGoalProgress = (weeklyProgress / weeklyGoal) * 100;
  const isKidsMode = profile?.display_mode === 'kids';

  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          {authError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{authError}</span>
              </div>
              <p className="text-xs text-red-600 mt-2">Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // User not found state (this will be briefly visible before the redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access your dashboard.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
  <PageLayout
    isKidsMode={profile?.display_mode === 'kids'}
    headerVariant="authenticated"
    headerProps={{
      showUserControls: true,
      profile,
      currentStreak: profile?.current_streak ?? 0,
      xp: profile?.xp ?? 0
    }}
  >
    {/* Welcome Section */}
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-3xl font-bold ${
            isKidsMode
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
              : 'text-gray-900'
          }`}>
            {isKidsMode ? '🌟 Welcome Back!' : 'Welcome back!'}
          </h2>
          <p className={`${
            isKidsMode
              ? 'text-purple-600'
              : 'text-gray-600'
          } mt-1`}>
            {user?.email || 'Ready to improve your handwriting?'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Current Streak */}
          <div className={`px-4 py-2 rounded-xl ${
            isKidsMode
              ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <div className="flex items-center gap-2">
              <Flame className={`h-5 w-5 ${
                isKidsMode ? 'text-white' : 'text-orange-500'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  isKidsMode ? 'text-white' : 'text-orange-700'
                }`}>
                  {profile?.current_streak ?? 0} day streak
                </p>
              </div>
            </div>
          </div>

          {/* Level & XP */}
          <div className={`px-4 py-2 rounded-xl ${
            isKidsMode
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              <Star className={`h-5 w-5 ${
                isKidsMode ? 'text-white' : 'text-blue-500'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  isKidsMode ? 'text-white' : 'text-blue-700'
                }`}>
                  Level {level}
                </p>
                <div className="w-16 bg-white/30 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className={`p-4 rounded-xl ${
        isKidsMode
          ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-200'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className={`h-5 w-5 ${
              isKidsMode ? 'text-green-600' : 'text-green-600'
            }`} />
            <h3 className={`font-semibold ${
              isKidsMode ? 'text-green-700' : 'text-gray-900'
            }`}>
              Weekly Goal
            </h3>
          </div>
          <span className={`text-sm ${
            isKidsMode ? 'text-green-600' : 'text-gray-600'
          }`}>
            {weeklyProgress} / {weeklyGoal} minutes
          </span>
        </div>
        <Progress value={weeklyGoalProgress} className="mb-2" />
        <p className={`text-sm ${
          isKidsMode ? 'text-green-600' : 'text-gray-600'
        }`}>
          {weeklyGoal - weeklyProgress} minutes to reach your goal!
        </p>
      </div>
    </div>

    {/* Learning Paths */}
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${
          isKidsMode
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            : 'text-gray-900'
        }`}>
          {isKidsMode ? '🎯 Your Learning Adventure' : 'Learning Paths'}
        </h3>
        <Link href="/learning-paths">
          <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
            isKidsMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            {isKidsMode ? '🚀 Explore All' : 'View All'}
          </button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLearningPaths.map((path) => (
          <Link href={path.href} key={path.id}>
            <div className={`p-6 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer ${
              isKidsMode
                ? 'bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover:border-purple-300'
                : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-3xl p-3 rounded-xl ${
                  isKidsMode ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  {path.icon}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(path.difficulty)}`}>
                  {path.difficulty}
                </span>
              </div>

              <h4 className={`text-lg font-semibold mb-2 ${
                isKidsMode ? 'text-purple-900' : 'text-gray-900'
              }`}>
                {path.title}
              </h4>

              <p className={`text-sm mb-4 ${
                isKidsMode ? 'text-purple-600' : 'text-gray-600'
              }`}>
                {path.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isKidsMode ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    Progress
                  </span>
                  <span className={`text-sm ${
                    isKidsMode ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {path.completedLessons}%
                  </span>
                </div>
                <Progress value={path.progress} />
              </div>

              {/* Next Lesson */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${
                    isKidsMode ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    Next: {path.nextLesson}
                  </p>
                  <p className={`text-xs ${
                    isKidsMode ? 'text-purple-500' : 'text-gray-400'
                  }`}>
                    {path.completedLessons}/{path.totalLessons} completed
                  </p>
                </div>
                <ChevronRight className={`h-4 w-4 ${
                  isKidsMode ? 'text-purple-500' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid md:grid-cols-3 gap-6">
      {/* Practice Session */}
      <Link href="/practice">
        <div className={`p-6 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer ${
          isKidsMode
            ? 'bg-gradient-to-br from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600'
            : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${
              isKidsMode ? 'bg-white/20' : 'bg-green-100'
            }`}>
              <Play className={`h-6 w-6 ${
                isKidsMode ? 'text-white' : 'text-green-600'
              }`} />
            </div>
            <h4 className={`text-lg font-semibold ${
              isKidsMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isKidsMode ? '🎮 Start Playing!' : 'Quick Practice'}
            </h4>
          </div>
          <p className={`text-sm ${
            isKidsMode ? 'text-white/90' : 'text-gray-600'
          }`}>
            {isKidsMode ? 'Jump into a fun writing game!' : 'Start a 10-minute practice session'}
          </p>
        </div>
      </Link>

      {/* Worksheets */}
      <Link href="/worksheets">
        <div className={`p-6 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer ${
          isKidsMode
            ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600'
            : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${
              isKidsMode ? 'bg-white/20' : 'bg-orange-100'
            }`}>
              <BookOpen className={`h-6 w-6 ${
                isKidsMode ? 'text-white' : 'text-orange-600'
              }`} />
            </div>
            <h4 className={`text-lg font-semibold ${
              isKidsMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isKidsMode ? '📚 Fun Worksheets' : 'Worksheets'}
            </h4>
          </div>
          <p className={`text-sm ${
            isKidsMode ? 'text-white/90' : 'text-gray-600'
          }`}>
            {isKidsMode ? 'Print and practice with colorful sheets!' : 'Download printable practice sheets'}
          </p>
        </div>
      </Link>

      {/* Progress Report */}
      <Link href="/progress">
        <div className={`p-6 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer ${
          isKidsMode
            ? 'bg-gradient-to-br from-purple-400 to-indigo-500 text-white hover:from-purple-500 hover:to-indigo-600'
            : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${
              isKidsMode ? 'bg-white/20' : 'bg-purple-100'
            }`}>
              <TrendingUp className={`h-6 w-6 ${
                isKidsMode ? 'text-white' : 'text-purple-600'
              }`} />
            </div>
            <h4 className={`text-lg font-semibold ${
              isKidsMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isKidsMode ? '⭐ Your Stars!' : 'Progress Report'}
            </h4>
          </div>
          <p className={`text-sm ${
            isKidsMode ? 'text-white/90' : 'text-gray-600'
          }`}>
            {isKidsMode ? 'See all the stars you\'ve earned!' : 'View detailed progress analytics'}
          </p>
        </div>
      </Link>
    </div>
  </PageLayout>
);

}