'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import PageLayout from '@/components/PageLayout';
import { Database, Profile } from '@/lib/database.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, CheckCircle, Star, Filter, Search, Zap, PenTool, AlignLeft, Circle, ArrowUpRight, Shapes, CassetteTape as LetterCase, Hash } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: number;
  totalLessons: number;
  completedLessons: number;
  icon: React.ReactNode;
  color: string;
  href: string;
  category: string;
  tags: string[];
}

export default function LearningPathsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setProfile(profileData);
      }
      setLoading(false);
    };

    getUser();
  }, [supabase.auth, router]);

  // Define learning paths
  const learningPaths: LearningPath[] = [
    // Basic Strokes Category
    {
      id: 'basic-strokes',
      title: 'Basic Strokes',
      description: 'Master fundamental writing movements',
      level: 1,
      totalLessons: 7,
      completedLessons: 5,
      icon: <PenTool className="h-5 w-5" />,
      color: 'from-blue-400 to-blue-600',
      href: '/practice',
      category: 'Fundamentals',
      tags: ['beginner', 'strokes', 'basics']
    },
    {
      id: 'vertical-lines',
      title: 'Vertical Lines',
      description: 'Practice drawing straight lines from top to bottom',
      level: 1,
      totalLessons: 4,
      completedLessons: 4,
      icon: <AlignLeft className="h-5 w-5" />,
      color: 'from-blue-400 to-blue-600',
      href: '/practice',
      category: 'Fundamentals',
      tags: ['beginner', 'lines', 'vertical']
    },
    {
      id: 'horizontal-lines',
      title: 'Horizontal Lines',
      description: 'Master drawing straight lines from left to right',
      level: 1,
      totalLessons: 4,
      completedLessons: 3,
      icon: <AlignLeft className="h-5 w-5 rotate-90" />,
      color: 'from-blue-400 to-blue-600',
      href: '/practice',
      category: 'Fundamentals',
      tags: ['beginner', 'lines', 'horizontal']
    },
    {
      id: 'circles',
      title: 'Circles & Curves',
      description: 'Learn to draw perfect circles and smooth curves',
      level: 1,
      totalLessons: 5,
      completedLessons: 2,
      icon: <Circle className="h-5 w-5" />,
      color: 'from-blue-400 to-blue-600',
      href: '/practice',
      category: 'Fundamentals',
      tags: ['beginner', 'circles', 'curves']
    },
    {
      id: 'diagonal-lines',
      title: 'Diagonal Lines',
      description: 'Practice drawing lines at various angles',
      level: 1,
      totalLessons: 4,
      completedLessons: 1,
      icon: <ArrowUpRight className="h-5 w-5" />,
      color: 'from-blue-400 to-blue-600',
      href: '/practice',
      category: 'Fundamentals',
      tags: ['beginner', 'lines', 'diagonal']
    },
    {
      id: 'basic-shapes',
      title: 'Basic Shapes',
      description: 'Create squares, triangles, and other basic shapes',
      level: 2,
      totalLessons: 6,
      completedLessons: 0,
      icon: <Shapes className="h-5 w-5" />,
      color: 'from-blue-400 to-blue-600',
      href: '/practice',
      category: 'Fundamentals',
      tags: ['beginner', 'shapes', 'geometry']
    },

    // Lowercase Letters Category
    {
      id: 'lowercase-letters',
      title: 'Lowercase Letters',
      description: 'Learn proper lowercase letter formation',
      level: 3,
      totalLessons: 26,
      completedLessons: 8,
      icon: <LetterCase className="h-5 w-5" />,
      color: 'from-green-400 to-green-600',
      href: '/practice/lowercase',
      category: 'Letters',
      tags: ['intermediate', 'lowercase', 'alphabet']
    },
    {
      id: 'magic-c-letters',
      title: 'Magic C Letters',
      description: 'Master the c, a, d, g, o, and q letters',
      level: 3,
      totalLessons: 6,
      completedLessons: 3,
      icon: <LetterCase className="h-5 w-5" />,
      color: 'from-green-400 to-green-600',
      href: '/practice/lowercase-magic-c',
      category: 'Letters',
      tags: ['intermediate', 'lowercase', 'c-family']
    },
    {
      id: 'down-up-letters',
      title: 'Down & Up Letters',
      description: 'Practice h, m, n, r, b, and p letters',
      level: 3,
      totalLessons: 6,
      completedLessons: 2,
      icon: <LetterCase className="h-5 w-5" />,
      color: 'from-green-400 to-green-600',
      href: '/practice/lowercase-down-up',
      category: 'Letters',
      tags: ['intermediate', 'lowercase', 'strokes']
    },

    // Uppercase Letters Category
    {
      id: 'uppercase-letters',
      title: 'Uppercase Letters',
      description: 'Perfect your capital letter formation',
      level: 4,
      totalLessons: 26,
      completedLessons: 5,
      icon: <LetterCase className="h-5 w-5 font-bold" />,
      color: 'from-purple-400 to-purple-600',
      href: '/practice/uppercase',
      category: 'Letters',
      tags: ['intermediate', 'uppercase', 'alphabet']
    },
    {
      id: 'uppercase-straight-lines',
      title: 'Straight Line Letters',
      description: 'Master E, F, H, I, L, and T letters',
      level: 4,
      totalLessons: 6,
      completedLessons: 4,
      icon: <LetterCase className="h-5 w-5 font-bold" />,
      color: 'from-purple-400 to-purple-600',
      href: '/practice/uppercase-straight-lines',
      category: 'Letters',
      tags: ['intermediate', 'uppercase', 'straight']
    },
    {
      id: 'uppercase-curve-line',
      title: 'Curve & Line Letters',
      description: 'Practice B, D, P, and R letters',
      level: 4,
      totalLessons: 4,
      completedLessons: 2,
      icon: <LetterCase className="h-5 w-5 font-bold" />,
      color: 'from-purple-400 to-purple-600',
      href: '/practice/uppercase-curve-line',
      category: 'Letters',
      tags: ['intermediate', 'uppercase', 'curves']
    },
    {
      id: 'uppercase-full-curves',
      title: 'Full Curve Letters',
      description: 'Learn C, G, O, Q, and S letters',
      level: 4,
      totalLessons: 5,
      completedLessons: 1,
      icon: <LetterCase className="h-5 w-5 font-bold" />,
      color: 'from-purple-400 to-purple-600',
      href: '/practice/uppercase-full-curves',
      category: 'Letters',
      tags: ['intermediate', 'uppercase', 'curves']
    },
    {
      id: 'uppercase-diagonal-lines',
      title: 'Diagonal Line Letters',
      description: 'Master A, K, M, N, V, W, X, Y, and Z letters',
      level: 4,
      totalLessons: 9,
      completedLessons: 0,
      icon: <LetterCase className="h-5 w-5 font-bold" />,
      color: 'from-purple-400 to-purple-600',
      href: '/practice/uppercase-diagonal-lines',
      category: 'Letters',
      tags: ['intermediate', 'uppercase', 'diagonal']
    },
    {
      id: 'uppercase-mixed-formation',
      title: 'Mixed Formation Letters',
      description: 'Practice special J and U letters',
      level: 4,
      totalLessons: 2,
      completedLessons: 0,
      icon: <LetterCase className="h-5 w-5 font-bold" />,
      color: 'from-purple-400 to-purple-600',
      href: '/practice/uppercase-mixed-formation',
      category: 'Letters',
      tags: ['intermediate', 'uppercase', 'mixed']
    },

    // Numbers Category
    {
      id: 'numbers-0-5',
      title: 'Numbers 0-5',
      description: 'Learn to write numbers 0 through 5',
      level: 3,
      totalLessons: 6,
      completedLessons: 3,
      icon: <Hash className="h-5 w-5" />,
      color: 'from-amber-400 to-amber-600',
      href: '/practice/numbers-0-5',
      category: 'Numbers',
      tags: ['intermediate', 'numbers', 'basic']
    },
    {
      id: 'numbers-6-9',
      title: 'Numbers 6-9',
      description: 'Master writing numbers 6 through 9',
      level: 3,
      totalLessons: 4,
      completedLessons: 1,
      icon: <Hash className="h-5 w-5" />,
      color: 'from-amber-400 to-amber-600',
      href: '/practice/numbers-6-9',
      category: 'Numbers',
      tags: ['intermediate', 'numbers', 'advanced']
    }
  ];

  // Get unique categories
  const categories = Array.from(new Set(learningPaths.map(path => path.category)));

  // Filter learning paths based on search and category
  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = searchQuery === '' || 
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || path.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group learning paths by category
  const pathsByCategory = filteredPaths.reduce((acc, path) => {
    if (!acc[path.category]) {
      acc[path.category] = [];
    }
    acc[path.category].push(path);
    return acc;
  }, {} as Record<string, LearningPath[]>);

  const isKidsMode = profile?.display_mode === 'kids';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout
      isKidsMode={isKidsMode}
      headerVariant="authenticated"
      headerProps={{
        showUserControls: true,
        profile: profile,
        currentStreak: profile?.current_streak ?? 0,
        xp: profile?.xp ?? 0
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-900'} mb-4`}>
            {isKidsMode ? '🚀 Learning Adventures!' : 'Learning Paths'}
          </h1>
          <p className={`text-xl ${isKidsMode ? 'text-purple-700' : 'text-gray-600'} max-w-3xl mx-auto`}>
            {isKidsMode 
              ? 'Choose your next exciting handwriting adventure! Each path helps you learn new skills.' 
              : 'Explore structured learning paths to improve your handwriting skills step by step.'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search learning paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                className={isKidsMode && selectedCategory === null ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={isKidsMode && selectedCategory === category ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Paths by Category */}
        <div className="space-y-16">
          {Object.entries(pathsByCategory).map(([category, paths]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${isKidsMode ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  {category === 'Fundamentals' ? (
                    <PenTool className={`h-5 w-5 ${isKidsMode ? 'text-purple-600' : 'text-gray-600'}`} />
                  ) : category === 'Letters' ? (
                    <LetterCase className={`h-5 w-5 ${isKidsMode ? 'text-purple-600' : 'text-gray-600'}`} />
                  ) : (
                    <Hash className={`h-5 w-5 ${isKidsMode ? 'text-purple-600' : 'text-gray-600'}`} />
                  )}
                </div>
                <h2 className={`text-2xl font-bold ${isKidsMode ? 'text-purple-800' : 'text-gray-900'}`}>
                  {category}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map((path) => (
                  <Link href={path.href} key={path.id}>
                    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${isKidsMode ? 'hover:scale-[1.02]' : 'hover:scale-[1.01]'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center text-white`}>
                            {path.icon}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Level {path.level}
                          </Badge>
                        </div>
                        <CardTitle className={`text-xl ${isKidsMode ? 'text-purple-900' : 'text-gray-900'}`}>
                          {path.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {path.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm text-gray-600">{path.completedLessons}/{path.totalLessons} lessons</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${isKidsMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-primary'}`}
                                style={{ width: `${(path.completedLessons / path.totalLessons) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {path.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Continue Button */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1">
                              {path.completedLessons > 0 ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-xs text-gray-600">{path.completedLessons} completed</span>
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 text-amber-500" />
                                  <span className="text-xs text-gray-600">Start learning</span>
                                </>
                              )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {Object.keys(pathsByCategory).length === 0 && (
          <div className="text-center py-16 px-6 bg-gray-50 rounded-2xl border">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No learning paths found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Button onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}