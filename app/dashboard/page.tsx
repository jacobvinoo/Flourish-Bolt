'use client';

import React, { useEffect, useState } from 'react';
// Imports are simulated for this environment to ensure compatibility.
// In a real Next.js project, you would use the actual library imports.
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
import { 
  Target, Trophy, Flame, Crown, Zap, Clock, TrendingUp, Settings,
  Play, BookOpen, User, LogOut, Award, Calendar, ArrowRight, Star
} from 'lucide-react';
// Assuming `database.types.ts` is available for type definitions
import { Database, Profile } from '@/lib/database.types';

// --- Mocked Components for Environment Compatibility with Correct Types ---
// These stand-ins allow the component to render without the actual UI library.
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`border rounded-lg ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`p-6 border-b ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const Button = ({ children, className = '', asChild, ...props }: { children: React.ReactNode, className?: string, asChild?: boolean, onClick?: () => void }) => <button className={`px-4 py-2 rounded-md ${className}`} {...props}>{children}</button>;
const Progress = ({ value, className = '' }: { value: number, className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);
const Badge = ({ children, className = '', variant }: { children: React.ReactNode, className?: string, variant?: string }) => <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>{children}</span>;


export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Static dashboard stats for demonstration
  const currentStreak = 12;
  const totalPracticeTime = 145; // in minutes
  const weeklyGoal = 150; // in minutes
  const weeklyProgress = 90; // in minutes
  const currentLevel = 8;
  const xp = 2350;
  const xpToNextLevel = 650;
  const achievements = 3;
  const totalAchievements = 10;

  useEffect(() => {
    // Simulate fetching user and profile data to make the component self-contained
    const getMockData = () => {
      setUser({ id: '123', email: 'user@example.com' });
      setProfile({
        id: '123',
        email: 'user@example.com',
        full_name: 'Alex Doe',
        avatar_url: null,
        updated_at: new Date().toISOString(), 
        display_mode: 'kids' // Toggle to 'adult' to see UI changes
      });
      setLoading(false);
    };
    getMockData();
  }, []);

  const handleSignOut = () => {
    alert('Simulating Sign Out. In a real app, this would redirect to /login.');
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isKidsMode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-green-600'}`}>
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h1 className={`text-2xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-900'}`}>
                {isKidsMode ? 'Flourish! ✨' : 'Flourish'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isKidsMode ? 'bg-orange-400 text-white' : 'bg-orange-500 text-white'}`}>
                <Flame className="h-4 w-4" />
                <span className="font-bold text-sm">{currentStreak}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isKidsMode ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-500 text-white'}`}>
                <Star className="h-4 w-4" />
                <span className="font-bold text-sm">{xp.toLocaleString()}</span>
              </div>
              <a href="/profile/settings">
                <button className={`p-2 rounded-lg transition-colors ${isKidsMode ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                  <Settings className="h-4 w-4" />
                </button>
              </a>
              <Button 
                onClick={handleSignOut}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${isKidsMode ? 'text-purple-700 hover:bg-purple-100' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {isKidsMode ? '👋 Bye!' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-900'}`}>
                {isKidsMode ? (
                  <span>🌟 Hi there, {profile?.full_name}!</span>
                ) : (
                  <span>Welcome back, {profile?.full_name || 'demo'}</span>
                )}
              </h2>
              <p className={`text-lg mt-1 ${isKidsMode ? 'text-purple-700' : 'text-gray-600'}`}>
                {isKidsMode ? 'Ready for some handwriting fun?' : 'Continue your handwriting journey'}
              </p>
            </div>
            <div className={`rounded-2xl p-4 text-center ${isKidsMode ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-green-600'}`}>
              <Crown className="h-8 w-8 text-white mx-auto mb-1" />
              <p className="text-white font-bold text-sm">Level</p>
              <p className="text-white font-bold text-2xl">{currentLevel}</p>
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${isKidsMode ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200' : 'bg-white border border-gray-200'} shadow-sm`}>
            <div className="flex justify-between items-center mb-2">
              <p className={`font-medium ${isKidsMode ? 'text-purple-700' : 'text-gray-700'}`}>
                {isKidsMode ? `🚀 Progress to Level ${currentLevel + 1}` : `Progress to Level ${currentLevel + 1}`}
              </p>
              <p className={`text-sm ${isKidsMode ? 'text-purple-600' : 'text-gray-600'}`}>
                {xp.toLocaleString()} / {(xp + xpToNextLevel).toLocaleString()} XP
              </p>
            </div>
            <Progress value={levelProgress} className="h-3 bg-white/50" />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Cards for Stats like Streak, Weekly Goal, etc. */}
        </div>

        {/* Learning Path */}
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Cards for current and next lessons */}
            </div>
            <div className="space-y-6">
                {/* Cards for sidebar content like Daily Challenge */}
            </div>
        </div>
      </main>
    </div>
  );
}
