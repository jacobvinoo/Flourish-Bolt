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
  LogOut
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
console.log('FloatingElements props:', { variant, density, showOnMobile, isKidsMode });

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fix: Added missing state variables that were referenced but not declared
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
          console.error('Auth error:', error);
          router.push('/login');
          return;
        }
        
        setUser(user);
        await fetchProfile(user.id);
      } catch (error: any) {
        console.error('Error in getUser:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase.auth]); // Fix: Added missing dependencies

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

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
    <PageLayout
  isKidsMode={profile?.display_mode === 'kids'}
  headerVariant="authenticated"
  containerWidth="max-w-6xl"
  showFloatingElements={true}
  floatingElementsProps={{
    variant: 'full',
    density: 'medium',
    showOnMobile: false
  }}
  headerProps={{
    showUserControls: true,
    profile,
    currentStreak,
    xp
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
              {isKidsMode ? "Let's Practice Writing! 🌟" : "Welcome back!"}
            </h2>
            <p className={`text-lg ${
              isKidsMode ? 'text-purple-600' : 'text-gray-600'
            }`}>
              {profile?.full_name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isKidsMode ? 'text-orange-500' : 'text-orange-600'
              }`}>
                <Flame className="inline-block w-6 h-6 mr-1" />
                {currentStreak}
              </div>
              <p className={`text-xs ${
                isKidsMode ? 'text-purple-600' : 'text-gray-500'
              }`}>
                Day Streak
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* XP Progress */}
          <div className={`p-4 rounded-lg border ${
            isKidsMode 
              ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${
                  isKidsMode ? 'text-yellow-500' : 'text-blue-600'
                }`} />
                <span className={`font-medium ${
                  isKidsMode ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  Level {level}
                </span>
              </div>
              <span className={`text-sm ${
                isKidsMode ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {xp} XP
              </span>
            </div>
            <Progress value={levelProgress} />
            <p className={`text-xs mt-1 ${
              isKidsMode ? 'text-purple-600' : 'text-gray-500'
            }`}>
              {xpToNextLevel} XP to next level
            </p>
          </div>

          {/* Weekly Goal */}
          <div className={`p-4 rounded-lg border ${
            isKidsMode 
              ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${
                  isKidsMode ? 'text-green-500' : 'text-green-600'
                }`} />
                <span className={`font-medium ${
                  isKidsMode ? 'text-green-700' : 'text-gray-700'
                }`}>
                  Weekly Goal
                </span>
              </div>
              <span className={`text-sm ${
                isKidsMode ? 'text-green-600' : 'text-gray-500'
              }`}>
                {weeklyProgress}/{weeklyGoal} min
              </span>
            </div>
            <Progress value={weeklyGoalProgress} />
            <p className={`text-xs mt-1 ${
              isKidsMode ? 'text-green-600' : 'text-gray-500'
            }`}>
              {weeklyGoal - weeklyProgress} min remaining
            </p>
          </div>

          {/* Total Practice Time */}
          <div className={`p-4 rounded-lg border ${
            isKidsMode 
              ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-5 h-5 ${
                isKidsMode ? 'text-orange-500' : 'text-purple-600'
              }`} />
              <span className={`font-medium ${
                isKidsMode ? 'text-orange-700' : 'text-gray-700'
              }`}>
                Total Practice
              </span>
            </div>
            <div className={`text-2xl font-bold ${
              isKidsMode ? 'text-orange-600' : 'text-purple-600'
            }`}>
              {totalPracticeTime}
            </div>
            <p className={`text-xs ${
              isKidsMode ? 'text-orange-600' : 'text-gray-500'
            }`}>
              minutes practiced
            </p>
          </div>

          {/* Achievement */}
          <div className={`p-4 rounded-lg border ${
            isKidsMode 
              ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className={`w-5 h-5 ${
                isKidsMode ? 'text-yellow-500' : 'text-yellow-600'
              }`} />
              <span className={`font-medium ${
                isKidsMode ? 'text-yellow-700' : 'text-gray-700'
              }`}>
                Achievement
              </span>
            </div>
            <div className={`text-sm font-medium ${
              isKidsMode ? 'text-yellow-600' : 'text-yellow-600'
            }`}>
              Writing Star ⭐
            </div>
            <p className={`text-xs ${
              isKidsMode ? 'text-yellow-600' : 'text-gray-500'
            }`}>
              Latest badge earned
            </p>
          </div>
        </div>

        {/* Learning Paths */}
        <div>
          <h3 className={`text-xl font-bold mb-4 ${
            isKidsMode ? 'text-purple-700' : 'text-gray-900'
          }`}>
            {isKidsMode ? "Fun Writing Adventures! 🚀" : "Your Learning Path"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLearningPaths.map((path) => (
              <Link key={path.id} href={path.href}>
                <div className={`group cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isKidsMode 
                    ? 'bg-gradient-to-br from-white to-purple-50 hover:shadow-xl' 
                    : 'bg-white hover:shadow-lg'
                } rounded-xl border ${
                  isKidsMode ? 'border-purple-200' : 'border-gray-200'
                } p-6`}>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl ${
                        isKidsMode ? 'transform group-hover:animate-bounce' : ''
                      }`}>
                        {path.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          isKidsMode ? 'text-purple-700' : 'text-gray-900'
                        }`}>
                          {path.title}
                        </h4>
                        <p className={`text-sm ${
                          isKidsMode ? 'text-purple-600' : 'text-gray-600'
                        }`}>
                          {path.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </div>
                  </div>
                  
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
                        {path.unlockedLessons}/{path.totalLessons} lessons
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
                        Next:
                      </p>
                      <p className={`text-sm font-medium ${
                        isKidsMode ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        {path.nextLesson}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      isKidsMode ? 'text-purple-600' : 'text-blue-600'
                    } group-hover:gap-3 transition-all`}>
                      {path.progress > 0 ? 'Continue' : 'Start'}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}