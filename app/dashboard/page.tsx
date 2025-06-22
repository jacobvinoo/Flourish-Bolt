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

import { Database, Profile } from '@/lib/database.types';
// Add animations styles
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(-5px) rotate(-1deg); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(2deg); }
  }
  
  @keyframes float-delay {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-8px) rotate(-1deg); }
    66% { transform: translateY(-12px) rotate(1deg); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes twinkle-delay {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
  .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
  .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
  .animate-twinkle-delay { animation: twinkle-delay 4s ease-in-out infinite; }
  .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-spin-reverse { animation: spin-reverse 25s linear infinite; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

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
    <div className={`min-h-screen transition-all duration-500 relative ${
      isKidsMode 
        ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50' 
        : 'bg-gray-50'
    }`}>

      {/* Animated Background Elements - Fixed positioning and sizing */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Left Wavy Edge - Reduced width and positioned further left */}
        <div className="absolute -left-20 top-0 h-full w-40 opacity-30">
          <svg viewBox="0 0 100 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="leftWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isKidsMode ? "#ec4899" : "#3b82f6"} />
                <stop offset="50%" stopColor={isKidsMode ? "#8b5cf6" : "#6366f1"} />
                <stop offset="100%" stopColor={isKidsMode ? "#06b6d4" : "#1e40af"} />
              </linearGradient>
            </defs>
            <path 
              d="M0,0 L0,800 L60,800 Q80,720 60,640 Q40,560 60,480 Q80,400 60,320 Q40,240 60,160 Q80,80 60,0 Z" 
              fill="url(#leftWave)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values="0,0; 0,-8; 0,0; 0,4; 0,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Right Wavy Edge - Reduced width and positioned further right */}
        <div className="absolute -right-20 top-0 h-full w-40 opacity-30">
          <svg viewBox="0 0 100 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rightWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isKidsMode ? "#06b6d4" : "#10b981"} />
                <stop offset="50%" stopColor={isKidsMode ? "#3b82f6" : "#059669"} />
                <stop offset="100%" stopColor={isKidsMode ? "#ec4899" : "#3b82f6"} />
              </linearGradient>
            </defs>
            <path 
              d="M100,0 L100,800 L40,800 Q20,720 40,640 Q60,560 40,480 Q20,400 40,320 Q60,240 40,160 Q20,80 40,0 Z" 
              fill="url(#rightWave)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values="0,0; 0,6; 0,0; 0,-4; 0,0"
                dur="7s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Subtle background patterns - moved further out */}
        <div className="absolute -top-32 -left-40 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isKidsMode ? "#ec4899" : "#3b82f6"} />
                <stop offset="100%" stopColor={isKidsMode ? "#8b5cf6" : "#1e40af"} />
              </linearGradient>
            </defs>
            <path d="M20,100 Q100,20 180,100 Q100,180 20,100" fill="url(#gradient1)" opacity="0.3" />
          </svg>
        </div>

        <div className="absolute -bottom-32 -right-40 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-reverse">
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isKidsMode ? "#06b6d4" : "#10b981"} />
                <stop offset="100%" stopColor={isKidsMode ? "#3b82f6" : "#059669"} />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#gradient2)" opacity="0.4" />
          </svg>
        </div>

        {/* Kids Mode Floating Elements - Positioned outside content area */}
        {isKidsMode && (
          <>
            {/* Left side elements - positioned further left */}
            <div className="absolute top-20 left-4 w-12 h-12 animate-float opacity-70">
              <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
                <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </div>

            <div className="absolute top-64 left-2 w-12 h-12 animate-float-delay opacity-70">
              <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                A
              </div>
            </div>

            <div className="absolute top-96 left-6 w-14 h-14 animate-bounce-slow opacity-70">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                <path d="M20,40 Q35,20 50,40 Q65,60 50,80 Q35,60 20,40 M50,40 Q65,30 80,50 Q75,70 60,80" stroke="#8b5cf6" strokeWidth="6" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="absolute bottom-32 left-8 w-10 h-10 animate-twinkle-delay opacity-70">
              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400 drop-shadow-lg">
                <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
              </svg>
            </div>

            {/* Right side elements - positioned further right */}
            <div className="absolute top-32 right-4 w-12 h-12 animate-twinkle opacity-70">
              <svg viewBox="0 0 24 24" className="w-full h-full text-pink-400 drop-shadow-lg">
                <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
              </svg>
            </div>

            <div className="absolute top-56 right-2 w-12 h-12 animate-float opacity-70">
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                B
              </div>
            </div>

            <div className="absolute bottom-56 right-6 w-12 h-12 animate-bounce-slow opacity-70">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                C
              </div>
            </div>

            <div className="absolute bottom-20 right-4 w-12 h-12 animate-bounce-slow opacity-70">
              <svg viewBox="0 0 24 24" className="w-full h-full text-amber-500 drop-shadow-lg">
                <path fill="currentColor" d="M7.5,14H16.5L16,12.5L15.5,11H8.5L8,12.5L7.5,14M12,3.8C9.68,3.8 7.8,5.68 7.8,8C7.8,8.76 8,9.47 8.34,10.1L9.5,12.5V21H14.5V12.5L15.66,10.1C16,9.47 16.2,8.76 16.2,8C16.2,5.68 14.32,3.8 12,3.8M5.91,6.41A1,1 0 0,1 6.84,6.48L7.5,7.13A1,1 0 0,1 6.13,8.5L5.48,7.84A1,1 0 0,1 5.41,6.91M18.09,6.41A1,1 0 0,1 18.52,7.84L17.87,8.5A1,1 0 0,1 16.5,7.13L17.16,6.48A1,1 0 0,1 18.09,6.41Z" />
              </svg>
            </div>
          </>
        )}

        {/* Adult mode subtle elements - positioned outside content area */}
        {!isKidsMode && (
          <>
            <div className="absolute top-20 right-8 w-6 h-6 opacity-10 animate-float">
              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-600">
                <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div className="absolute bottom-32 left-8 w-6 h-6 opacity-10 animate-float-slow">
              <svg viewBox="0 0 24 24" className="w-full h-full text-green-600">
                <path fill="currentColor" d="M9,5V9H15V5M9,11V15H15V11M9,17V21H15V17M5,5V9H7V5M5,11V15H7V11M5,17V21H7V17M17,5V9H19V5M17,11V15H19V11M17,17V21H19V17Z" />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <header className={`${
        isKidsMode 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
          : 'bg-white border-b border-gray-200'
      } relative z-20`}>
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

      {/* Main Content - Constrained width with proper centering */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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