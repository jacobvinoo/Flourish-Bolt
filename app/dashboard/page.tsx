'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/database.types';
import { 
  User, Settings, LogOut, BookOpen, Trophy, Target, Flame, Clock, 
  Crown, Zap, ArrowRight, Play, Calendar, Award, TrendingUp,
  Bell, Search, Menu, X
} from 'lucide-react';

// ... (keep all the existing interfaces and data)

export default function DashboardPage() {
  // ... (keep all existing state and functions)

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isKidsMode 
        ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50' 
        : 'bg-gray-50'
    }`}>

      {/* Fixed Animated Background Elements - Contained within viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Left Wavy Edge - Properly contained */}
        <div className="absolute left-0 top-0 h-full w-16 opacity-30">
          <svg viewBox="0 0 64 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="leftWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isKidsMode ? "#ec4899" : "#3b82f6"} />
                <stop offset="50%" stopColor={isKidsMode ? "#8b5cf6" : "#6366f1"} />
                <stop offset="100%" stopColor={isKidsMode ? "#06b6d4" : "#1e40af"} />
              </linearGradient>
            </defs>
            <path 
              d="M0,0 L0,800 L40,800 Q60,720 40,640 Q20,560 40,480 Q60,400 40,320 Q20,240 40,160 Q60,80 40,0 Z" 
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

        {/* Right Wavy Edge - Properly contained */}
        <div className="absolute right-0 top-0 h-full w-16 opacity-30">
          <svg viewBox="0 0 64 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rightWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isKidsMode ? "#06b6d4" : "#10b981"} />
                <stop offset="50%" stopColor={isKidsMode ? "#3b82f6" : "#059669"} />
                <stop offset="100%" stopColor={isKidsMode ? "#ec4899" : "#3b82f6"} />
              </linearGradient>
            </defs>
            <path 
              d="M64,0 L64,800 L24,800 Q4,720 24,640 Q44,560 24,480 Q4,400 24,320 Q44,240 24,160 Q4,80 24,0 Z" 
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

        {/* Subtle background patterns - Contained within viewport */}
        <div className="absolute top-16 left-16 w-32 h-32 opacity-10">
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

        <div className="absolute bottom-16 right-16 w-32 h-32 opacity-10">
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

        {/* Kids Mode Floating Elements - Contained within safe margins */}
        {isKidsMode && (
          <>
            {/* Left side elements - Safe positioning */}
            <div className="absolute top-20 left-20 w-12 h-12 animate-float opacity-70">
              <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
                <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </div>

            <div className="absolute top-64 left-24 w-12 h-12 animate-float-delay opacity-70">
              <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                A
              </div>
            </div>

            <div className="absolute bottom-32 left-20 w-10 h-10 animate-twinkle-delay opacity-70">
              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400 drop-shadow-lg">
                <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
              </svg>
            </div>

            {/* Right side elements - Safe positioning */}
            <div className="absolute top-32 right-20 w-12 h-12 animate-twinkle opacity-70">
              <svg viewBox="0 0 24 24" className="w-full h-full text-pink-400 drop-shadow-lg">
                <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
              </svg>
            </div>

            <div className="absolute top-56 right-24 w-12 h-12 animate-float opacity-70">
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                B
              </div>
            </div>

            <div className="absolute bottom-56 right-20 w-12 h-12 animate-bounce-slow opacity-70">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                C
              </div>
            </div>

            <div className="absolute bottom-20 right-24 w-12 h-12 animate-bounce-slow opacity-70">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                D
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isKidsMode 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-green-600'
              }`}>
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h1 className={`text-2xl font-bold ${
                isKidsMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'text-gray-900'
              }`}>
                {isKidsMode ? 'Flourish! ✨' : 'Flourish'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{profile?.full_name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Properly contained */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-3xl font-bold ${
                isKidsMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'text-gray-900'
              }`}>
                {isKidsMode ? `Welcome back, ${profile?.full_name?.split(' ')[0] || 'friend'}! 🌟` : `Welcome back, ${profile?.full_name || 'demo'}`}
              </h2>
              <p className={`text-lg ${
                isKidsMode ? 'text-purple-700' : 'text-gray-600'
              }`}>
                {isKidsMode ? 'Ready for some awesome handwriting fun?' : 'Continue your handwriting journey'}
              </p>
            </div>
            <div className={`rounded-2xl p-4 text-center ${
              isKidsMode 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-green-600'
            }`}>
              <Crown className="h-8 w-8 text-white mx-auto mb-1" />
              <p className="text-white font-bold text-sm">Level</p>
              <p className="text-white font-bold text-2xl">{currentLevel}</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className={`rounded-2xl p-6 ${
            isKidsMode 
              ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200' 
              : 'bg-white border border-gray-200'
          } shadow-sm`}>
            <div className="flex justify-between items-center mb-2">
              <p className={`font-medium ${
                isKidsMode ? 'text-purple-700' : 'text-gray-700'
              }`}>
                {isKidsMode ? `🚀 Progress to Level ${currentLevel + 1}` : `Progress to Level ${currentLevel + 1}`}
              </p>
              <p className={`text-sm ${
                isKidsMode ? 'text-purple-600' : 'text-gray-600'
              }`}>
                {xp.toLocaleString()} / {(xp + xpToNextLevel).toLocaleString()} XP
              </p>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Streak */}
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

          {/* Weekly Goal */}
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

          {/* Total Practice */}
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
                }`}>{Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m</p>
                <p className={`text-xs ${
                  isKidsMode ? 'text-blue-600' : 'text-gray-500'
                }`}>this month</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isKidsMode ? 'bg-blue-500' : 'bg-blue-600'
              }`}>
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className={`rounded-2xl p-6 border transition-shadow ${
            isKidsMode 
              ? 'bg-gradient-to-br from-purple-100 to-violet-100 border-purple-200 hover:shadow-lg' 
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
                }`}>{achievements}</p>
                <p className={`text-xs ${
                  isKidsMode ? 'text-purple-600' : 'text-gray-500'
                }`}>of {totalAchievements} unlocked</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isKidsMode ? 'bg-purple-500' : 'bg-purple-600'
              }`}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Path */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-2xl font-bold ${
                isKidsMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'text-gray-900'
              }`}>
                {isKidsMode ? '🎯 Your Learning Path' : 'Your Learning Path'}
              </h3>
              <Button 
                className={`${
                  isKidsMode 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
                asChild
              >
                <Link href="/practice">
                  {isKidsMode ? '🚀 Continue Learning' : 'Continue Learning'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Current Exercise */}
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${
              isKidsMode 
                ? 'bg-gradient-to-br from-white to-purple-50 border-purple-200' 
                : 'bg-white'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className={`h-5 w-5 ${isKidsMode ? 'text-purple-600' : 'text-primary'}`} />
                  {isKidsMode ? '📚 Current Lesson' : 'Basic Strokes'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'Learn to make awesome letter movements!' : 'Master fundamental writing movements'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={isKidsMode 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-green-50 text-green-700 border-green-200'
                    }
                  >
                    {isKidsMode ? '🌟 beginner' : 'beginner'}
                  </Badge>
                  <span className={`text-sm ${
                    isKidsMode ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    6 / 7 {isKidsMode ? '✨' : 'completed'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isKidsMode ? 'text-purple-700' : 'text-gray-700'}>
                      {isKidsMode ? 'Next: Continuous Curves 🌊' : 'Next: Continuous Curves'}
                    </span>
                    <span className={`font-medium ${
                      isKidsMode ? 'text-green-600' : 'text-green-600'
                    }`}>85% complete</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <Button 
                  className={`w-full ${
                    isKidsMode 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-primary hover:bg-primary/90'
                  } text-white`}
                  asChild
                >
                  <Link href="/exercise/basic-strokes">
                    {isKidsMode ? '🎨 Continue' : 'Continue'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Next Lesson Preview */}
            <Card className={`border-0 shadow-md ${
              isKidsMode 
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                : 'bg-gray-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className={`h-5 w-5 ${isKidsMode ? 'text-yellow-600' : 'text-gray-600'}`} />
                  {isKidsMode ? '📖 Next Up' : 'Lowercase Letters'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'Coming up next in your adventure!' : 'Learn proper lowercase formation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={isKidsMode 
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }
                  >
                    {isKidsMode ? '🌟 beginner' : 'beginner'}
                  </Badge>
                  <span className={`text-sm ${
                    isKidsMode ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    12 / 26 {isKidsMode ? '🔤' : 'letters'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <Card className={`border-0 shadow-lg ${
              isKidsMode 
                ? 'bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-200' 
                : 'bg-white'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${isKidsMode ? 'text-orange-600' : 'text-orange-600'}`} />
                  {isKidsMode ? '⚡ Daily Challenge' : 'Daily Challenge'}
                </CardTitle>
                <CardDescription>
                  {isKidsMode ? 'Complete for bonus XP!' : 'Complete for bonus XP'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  isKidsMode 
                    ? 'bg-gradient-to-r from-yellow-300 to-orange-300' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                } text-white`}>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8" />
                    <div>
                      <h4 className="font-bold">
                        {isKidsMode ? '✍️ Perfect 10 Letters' : 'Perfect 10 Letters'}
                      </h4>
                      <p className="text-sm opacity-90">
                        {isKidsMode ? 'Write 10 letters with 100% accuracy' : 'Write 10 letters with 100% accuracy'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isKidsMode ? 'text-orange-700' : 'text-gray-700'}>
                      Progress: 7/10
                    </span>
                    <span className={`font-medium ${
                      isKidsMode ? 'text-orange-600' : 'text-orange-600'
                    }`}>+50 XP</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <Button 
                  className={`w-full ${
                    isKidsMode 
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white`}
                >
                  {isKidsMode ? '🎯 Continue Challenge' : 'Continue Challenge'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`border-0 shadow-lg ${
              isKidsMode 
                ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200' 
                : 'bg-white'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${isKidsMode ? 'text-blue-600' : 'text-blue-600'}`} />
                  {isKidsMode ? '🚀 Quick Actions' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    isKidsMode 
                      ? 'border-blue-200 hover:bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  asChild
                >
                  <Link href="/practice">
                    <Play className="mr-2 h-4 w-4" />
                    {isKidsMode ? '🎮 Start Practice' : 'Start Practice'}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    isKidsMode 
                      ? 'border-blue-200 hover:bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  asChild
                >
                  <Link href="/progress">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {isKidsMode ? '📈 View Progress' : 'View Progress'}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    isKidsMode 
                      ? 'border-blue-200 hover:bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  asChild
                >
                  <Link href="/achievements">
                    <Award className="mr-2 h-4 w-4" />
                    {isKidsMode ? '🏆 Achievements' : 'Achievements'}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    isKidsMode 
                      ? 'border-blue-200 hover:bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  asChild
                >
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {isKidsMode ? '⚙️ Settings' : 'Settings'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className={`border-0 shadow-lg ${
              isKidsMode 
                ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-200' 
                : 'bg-white'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${isKidsMode ? 'text-green-600' : 'text-green-600'}`} />
                  {isKidsMode ? '📅 Recent Activity' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                  <div className={`w-2 h-2 rounded-full ${
                    isKidsMode ? 'bg-green-400' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isKidsMode ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {isKidsMode ? '✏️ Completed Basic Strokes' : 'Completed Basic Strokes'}
                    </p>
                    <p className={`text-xs ${
                      isKidsMode ? 'text-green-600' : 'text-gray-500'
                    }`}>2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                  <div className={`w-2 h-2 rounded-full ${
                    isKidsMode ? 'bg-blue-400' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isKidsMode ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {isKidsMode ? '🏆 Earned "Week Warrior" badge' : 'Earned "Week Warrior" badge'}
                    </p>
                    <p className={`text-xs ${
                      isKidsMode ? 'text-green-600' : 'text-gray-500'
                    }`}>1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                  <div className={`w-2 h-2 rounded-full ${
                    isKidsMode ? 'bg-purple-400' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isKidsMode ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {isKidsMode ? '🔥 Started 12-day streak' : 'Started 12-day streak'}
                    </p>
                    <p className={`text-xs ${
                      isKidsMode ? 'text-green-600' : 'text-gray-500'
                    }`}>3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}