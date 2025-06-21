'use client';

import { useEffect, useState } from 'react';
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
    difficulty: 'beginner'
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
    difficulty: 'beginner'
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
    difficulty: 'intermediate'
  }
];

export default function ElegantDashboard() {
  const [currentStreak] = useState(12);
  const [totalPracticeTime] = useState(145);
  const [weeklyGoal] = useState(150);
  const [weeklyProgress] = useState(90);
  const [level] = useState(8);
  const [xp] = useState(2350);
  const [xpToNextLevel] = useState(650);
  const [profile] = useState({ full_name: 'Alex Chen', display_mode: 'standard' });

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

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Flourish</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-500 rounded-full text-white">
                <Flame className="h-4 w-4" />
                <span className="font-bold text-sm">{currentStreak}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-500 rounded-full text-white">
                <Star className="h-4 w-4" />
                <span className="font-bold text-sm">{xp.toLocaleString()}</span>
              </div>

              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-4 w-4" />
              </button>

              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                Sign Out
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
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, <span className="text-green-700">{profile?.full_name}</span>
              </h2>
              <p className="text-lg mt-1 text-gray-600">
                Continue your handwriting journey
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-green-600 text-white rounded-xl shadow-sm">
              <Crown className="h-5 w-5" />
              <div className="text-center">
                <div className="text-sm font-medium opacity-90">Level</div>
                <div className="text-xl font-bold">{level}</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Progress to Level {level + 1}
              </span>
              <span className="text-sm text-gray-500">
                {xp.toLocaleString()} / {(xp + xpToNextLevel).toLocaleString()} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900">{currentStreak}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Weekly Goal</p>
                <p className="text-3xl font-bold text-gray-900">{Math.round(weeklyGoalProgress)}%</p>
                <p className="text-xs text-gray-500">{weeklyProgress} / {weeklyGoal} min</p>
              </div>
              <div className="p-3 rounded-xl bg-green-600">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={weeklyGoalProgress} className="h-2" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Practice</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m
                </p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Achievements</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-500">of 10 unlocked</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500">
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
              <h3 className="text-xl font-bold text-gray-900">Your Learning Path</h3>
              <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2">
                Continue Learning
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {mockLearningPaths.map((path, index) => {
                const isLocked = path.progress === 0 && index > 1;
                
                return (
                  <div 
                    key={path.id} 
                    className={`bg-white rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-md cursor-pointer ${
                      isLocked ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl bg-gray-50 rounded-xl p-3">
                            {isLocked ? '🔒' : path.icon}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{path.title}</h4>
                            <p className="text-gray-600">{path.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`mb-2 px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(path.difficulty)}`}>
                            {path.difficulty}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {path.unlockedLessons} / {path.totalLessons}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">
                          {isLocked ? 'Complete previous paths to unlock' : `Next: ${path.nextLesson}`}
                        </span>
                        <span className="text-sm text-green-700 font-bold">
                          {isLocked ? '' : `${Math.round(path.progress)}% complete`}
                        </span>
                      </div>
                      
                      {!isLocked && (
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Progress value={path.progress} className="h-2" />
                          </div>
                          <button className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors">
                            Continue
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
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold text-gray-900">Daily Challenge</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Complete for bonus XP</p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl bg-yellow-500 rounded-xl p-3">📝</div>
                <div>
                  <h4 className="font-bold text-gray-900">Perfect 10 Letters</h4>
                  <p className="text-sm text-gray-600">Write 10 letters with 100% accuracy</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">Progress: 7/10</span>
                <span className="text-sm font-bold text-yellow-600">+50 XP</span>
              </div>
              <Progress value={70} className="mb-4 h-2" />
              <button className="w-full px-4 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-colors">
                Continue Challenge
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <Play className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Quick Practice</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <BookOpen className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Browse Worksheets</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">View Progress</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Continue Learning?</h3>
            <p className="text-lg mb-6 text-gray-600">
              Consistent practice leads to beautiful handwriting. Your next breakthrough is just one session away.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 text-lg">
                <Play className="h-5 w-5" />
                <span>Start Practicing</span>
              </button>
              <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2 text-lg font-medium">
                <BookOpen className="h-5 w-5" />
                <span>Browse Worksheets</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}