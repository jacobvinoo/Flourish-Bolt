'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Tables } from '@/lib/database.types';
import { BookOpen, PenTool, TrendingUp, User as UserIcon, Play, Star, Settings, FileText, Target, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Exercise = Tables<'exercises'>;
type Profile = Tables<'profiles'>;

// First Workbook exercises data
const firstWorkbookExercises = [
  {
    id: 'vertical-lines',
    title: 'Vertical Lines',
    description: 'Master downward stroke control with straight vertical lines from top to bottom.',
    level: 1,
    estimatedTime: '10-15 minutes',
    skills: ['Motor Control', 'Line Direction', 'Pencil Grip'],
    worksheetUrl: '/worksheets/vertical-lines.html',
    completed: false
  },
  {
    id: 'horizontal-lines',
    title: 'Horizontal Lines',
    description: 'Practice horizontal lines from left to right to build reading and writing flow.',
    level: 1,
    estimatedTime: '10-15 minutes',
    skills: ['Left-to-right progression', 'Reading flow', 'Line control'],
    worksheetUrl: '/worksheets/horizontal-lines.html',
    completed: false
  },
  {
    id: 'circles',
    title: 'Circles',
    description: 'Learn circular motions essential for letters like o, a, and d.',
    level: 1,
    estimatedTime: '15-20 minutes',
    skills: ['Circular motor patterns', 'Hand-eye coordination', 'Smooth curves'],
    worksheetUrl: '/worksheets/circles.html',
    completed: false
  },
  {
    id: 'diagonal-lines',
    title: 'Diagonal Lines',
    description: 'Master diagonal strokes for letters like A, V, X, and k.',
    level: 1,
    estimatedTime: '15-20 minutes',
    skills: ['Diagonal control', 'Letter preparation', 'Angle consistency'],
    worksheetUrl: '/worksheets/diagonal-lines.html',
    completed: false
  },
  {
    id: 'intersecting-lines',
    title: 'Intersecting Lines',
    description: 'Practice crosses and plus signs with precision.',
    level: 1,
    estimatedTime: '15-20 minutes',
    skills: ['Precision', 'Letter formation', 'Intersection control'],
    worksheetUrl: '/worksheets/intersecting-lines.html',
    completed: false
  },
  {
    id: 'basic-shapes',
    title: 'Basic Shapes',
    description: 'Combine strokes to create squares, triangles, and rectangles.',
    level: 1,
    estimatedTime: '20-25 minutes',
    skills: ['Shape recognition', 'Stroke combination', 'Geometric forms'],
    worksheetUrl: '/worksheets/basic-shapes.html',
    completed: false
  },
  {
    id: 'continuous-curves',
    title: 'Continuous Curves',
    description: 'Develop fluidity with wavy lines and loops for cursive preparation.',
    level: 1,
    estimatedTime: '20-25 minutes',
    skills: ['Fluidity of motion', 'Cursive preparation', 'Smooth transitions'],
    worksheetUrl: '/worksheets/continuous-curves.html',
    completed: false
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log('Fetching user...');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          setAuthError(error.message);
          router.push('/login');
          return;
        }
        
        if (!user) {
          console.log('No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('User found:', user.email);
        setUser(user);
        await fetchProfile(user.id, user);
      } catch (err) {
        console.error('Error getting user:', err);
        setAuthError('Failed to authenticate user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase, router]);

  const fetchProfile = async (userId: string, user: User) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: user?.user_metadata?.full_name || 'User',
              user_role: 'student',
              display_mode: 'adult'
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
          } else {
            setProfile(newProfile);
          }
        }
      } else {
        console.log('Profile loaded:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('Fetching exercises...');
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .order('level', { ascending: true });

        if (error) {
          console.error('Error fetching exercises:', error);
        } else {
          console.log('Exercises loaded:', data?.length || 0);
          setExercises(data || []);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setExercisesLoading(false);
      }
    };

    // Only fetch exercises if we have a user
    if (user) {
      fetchExercises();
    } else {
      setExercisesLoading(false);
    }
  }, [supabase, user]);
  
  // [FIX] This new useEffect block manages the theme class on the body element.
  // This makes the theme switching between adult and kids mode more robust.
  useEffect(() => {
    if (profile) {
      const isKids = profile.display_mode === 'kids';
      const modeClass = isKids ? 'kids-mode' : 'adult-mode';
      const otherModeClass = isKids ? 'adult-mode' : 'kids-mode';
      
      document.body.classList.add(modeClass);
      document.body.classList.remove(otherModeClass);

      // Cleanup function to remove the class when the component unmounts
      return () => {
        document.body.classList.remove(modeClass);
      };
    }
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level <= 6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (level <= 8) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 3) return 'Beginner';
    if (level <= 6) return 'Intermediate';
    if (level <= 8) return 'Advanced';
    return 'Expert';
  };

  const openWorksheet = (worksheetUrl: string) => {
    window.open(worksheetUrl, '_blank', 'noopener,noreferrer');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Authentication Error</div>
          <p className="text-muted-foreground mb-4">{authError}</p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Show if no user (shouldn't happen due to redirect, but safety check)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No user session found</p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  // [FIX] Corrected typo from 'kid' to 'kids' to match file name 'globals-kids.css'
  // This ensures the correct theme and animations are applied for kids' profiles.
  const isKidsMode = profile?.display_mode === 'kids';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-foreground ${isKidsMode ? 'wiggle' : ''}`}>
              {isKidsMode ? '🎨 My Dashboard 🌟' : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isKidsMode ? (
                <>Welcome back, {profile?.full_name || user.email}! Ready to practice? <span className="emoji">✨</span></>
              ) : (
                <>Welcome back, {profile?.full_name || user.email}</>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/profile/settings">
              <Button variant="outline" className={isKidsMode ? 'button' : ''}>
                <Settings className="h-4 w-4 mr-2" />
                {isKidsMode ? 'My Settings' : 'Settings'}
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="outline" className={isKidsMode ? 'button' : ''}>
              {isKidsMode ? 'Sign Out 👋' : 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* Display Mode Indicator */}
        {isKidsMode && (
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl bounce-in">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-bold text-purple-800 dark:text-purple-200">Kids Mode Active!</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  You're using the fun, colorful interface! Change this in Settings if you want.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isKidsMode ? '📚 Fun Exercises' : 'Exercises Available'}
              </CardTitle>
              <BookOpen className={`h-4 w-4 text-muted-foreground ${isKidsMode ? 'icon' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exercises.length}</div>
              <p className="text-xs text-muted-foreground">
                {isKidsMode ? 'Ready to have fun!' : 'Ready to practice'}
              </p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isKidsMode ? '⭐ My Score' : 'Average Score'}
              </CardTitle>
              <TrendingUp className={`h-4 w-4 text-muted-foreground ${isKidsMode ? 'icon' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                {isKidsMode ? 'Do exercises to see your awesome progress!' : 'Complete exercises to see progress'}
              </p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isKidsMode ? '🎯 My Level' : 'Current Level'}
              </CardTitle>
              <PenTool className={`h-4 w-4 text-muted-foreground ${isKidsMode ? 'icon' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isKidsMode ? 'Beginner 🌱' : 'Beginner'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isKidsMode ? 'Keep practicing to level up!' : 'Keep practicing to advance'}
              </p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isKidsMode ? '👤 I am a' : 'Profile'}
              </CardTitle>
              <UserIcon className={`h-4 w-4 text-muted-foreground ${isKidsMode ? 'icon' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {profile?.user_role || 'Student'}
                {isKidsMode && profile?.user_role === 'student' && ' 🎓'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isKidsMode ? 'Your role in the app' : 'Default role'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* First Workbook Section - Enhanced */}
        <div className="mb-8">
          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Target className="h-6 w-6 text-primary" />
                    {isKidsMode ? '🎯 First Workbook - Start Here! 🚀' : 'First Workbook - Start Your Journey'}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {isKidsMode 
                      ? 'Master the basics with 7 fun exercises! Start with vertical lines and work your way up! 🌟'
                      : 'Master the fundamentals with our structured 7-exercise program. Build essential motor skills step by step.'
                    }
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">7</div>
                  <div className="text-sm text-muted-foreground">Exercises</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {isKidsMode ? 'My Progress 📈' : 'Progress'}
                  </span>
                  <span className="text-sm text-muted-foreground">0 of 7 completed</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isKidsMode 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-primary'
                    }`}
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>

              {/* Exercise Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {firstWorkbookExercises.map((exercise, index) => (
                  <Card key={exercise.id} className={`border border-border/50 hover:border-primary/50 transition-all duration-200 ${isKidsMode ? 'hover:scale-105' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              exercise.completed 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                              {exercise.completed ? <CheckCircle className="h-3 w-3" /> : index + 1}
                            </span>
                            {isKidsMode ? `${exercise.title} ✨` : exercise.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {exercise.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            {exercise.estimatedTime}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {exercise.skills.slice(0, 2).map((skill, skillIndex) => (
                              <span key={skillIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => openWorksheet(exercise.worksheetUrl)}
                          size="sm"
                          className={isKidsMode ? 'button' : ''}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          {isKidsMode ? 'Go!' : 'Start'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href="/practice" className="flex-1">
                  <Button className={`w-full h-12 text-lg font-semibold ${isKidsMode ? 'button big-button' : ''}`}>
                    <Play className="h-5 w-5 mr-2" />
                    {isKidsMode ? 'Start My Journey! 🚀' : 'Begin First Workbook'}
                  </Button>
                </Link>
                <Link href="/worksheets">
                  <Button variant="outline" className={`h-12 ${isKidsMode ? 'button' : ''}`}>
                    <FileText className="h-5 w-5 mr-2" />
                    {isKidsMode ? 'All Worksheets 📄' : 'All Worksheets'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {isKidsMode ? '⚡ Quick Practice!' : 'Quick Practice'}
              </CardTitle>
              <CardDescription>
                {isKidsMode 
                  ? 'Jump into any exercise and start practicing right away! 🎯'
                  : 'Jump into any exercise and start practicing immediately'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/worksheets">
                <Button variant="outline" className={`w-full ${isKidsMode ? 'button' : ''}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  {isKidsMode ? 'Browse Exercises! 🔍' : 'Browse All Exercises'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isKidsMode ? '📝 Practice Worksheets!' : 'Practice Worksheets'}
              </CardTitle>
              <CardDescription>
                {isKidsMode 
                  ? 'Print fun worksheets to practice your handwriting! �️'
                  : 'Download and print interactive worksheets for offline practice'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/worksheets">
                <Button variant="outline" className={`w-full ${isKidsMode ? 'button' : ''}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isKidsMode ? 'Get Worksheets! 🎨' : 'Browse Worksheets'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${isKidsMode ? 'card bounce-in' : ''}`}>
            <CardHeader>
              <CardTitle>
                {isKidsMode ? '📊 See My Progress!' : 'View Progress'}
              </CardTitle>
              <CardDescription>
                {isKidsMode 
                  ? 'Check out how much you\'ve improved! So cool! 🚀'
                  : 'Track your handwriting improvement over time'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className={`w-full ${isKidsMode ? 'button' : ''}`}>
                {isKidsMode ? 'Show My Progress! 📈' : 'View Analytics'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Exercises Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isKidsMode ? '🎮 Advanced Writing Games!' : 'Advanced Exercises'}
              </h2>
              <p className="text-muted-foreground">
                {isKidsMode 
                  ? 'Ready for more challenges? Try these advanced exercises! 🏆' 
                  : 'Advanced exercises for continued skill development'
                }
              </p>
            </div>
          </div>

          {exercisesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className={`border-0 shadow-lg ${isKidsMode ? 'card' : ''}`}>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card' : ''}`}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className={`h-12 w-12 text-muted-foreground mb-4 ${isKidsMode ? 'icon' : ''}`} />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {isKidsMode ? 'No Advanced Games Yet! 😢' : 'No Advanced Exercises Available'}
                </h3>
                <p className="text-muted-foreground text-center">
                  {isKidsMode 
                    ? 'Start with the First Workbook to unlock more games! 🎈'
                    : 'Complete the First Workbook to unlock advanced exercises.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${isKidsMode ? 'card bounce-in' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={`text-lg font-semibold group-hover:text-primary transition-colors ${isKidsMode ? 'text-primary' : ''}`}>
                          {isKidsMode ? `🎯 ${exercise.title}` : exercise.title}
                        </CardTitle>
                        {exercise.description && (
                          <CardDescription className="mt-2 line-clamp-2">
                            {exercise.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className={`h-4 w-4 text-yellow-500 ${isKidsMode ? 'icon' : ''}`} />
                        <span className="text-sm font-medium">{exercise.level}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.level)} ${isKidsMode ? 'badge' : ''}`}>
                          {isKidsMode ? `${getDifficultyLabel(exercise.level)} 🌟` : getDifficultyLabel(exercise.level)}
                        </span>
                        {exercise.font_style && (
                          <span className="text-xs text-muted-foreground">
                            {isKidsMode ? '✏️ ' : 'Font: '}
                            {exercise.font_style.replace('_', ' ').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <Link href={`/exercise/${exercise.id}`}>
                        <Button className={`group-hover:bg-primary/90 transition-colors ${isKidsMode ? 'button big-button' : ''}`}>
                          <Play className="h-4 w-4 mr-2" />
                          {isKidsMode ? 'Play!' : 'Start Exercise'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}