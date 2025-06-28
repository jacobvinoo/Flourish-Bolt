'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Profile } from '@/lib/database.types';
import { 
  FileText, 
  Download, 
  Play, 
  Star,
  Printer,
  Eye,
  BookOpen,
  Filter,
  Pencil,
  Shapes,
  AlignLeft,
  LayoutGrid,
  CircleDot,
  ArrowUpDown,
  LetterCase,
  Hash
} from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

interface WorksheetTemplate {
  id: string;
  title: string;
  description: string;
  level: number;
  type: string;
  category: string;
  estimatedTime: string;
  skills: string[];
  worksheetUrl: string;
  icon: React.ReactNode;
}

// Organized worksheets by category
const worksheetCategories = [
  {
    id: 'basic-strokes',
    name: 'Basic Strokes',
    description: 'Fundamental strokes for building handwriting skills',
    icon: <Pencil className="h-5 w-5" />
  },
  {
    id: 'shapes',
    name: 'Shapes',
    description: 'Practice basic shapes that form the foundation of letters',
    icon: <Shapes className="h-5 w-5" />
  },
  {
    id: 'lowercase-letters',
    name: 'Lowercase Letters',
    description: 'Master the formation of lowercase letters a-z',
    icon: <LetterCase className="h-5 w-5" />
  },
  {
    id: 'uppercase-letters',
    name: 'Uppercase Letters',
    description: 'Learn to write capital letters A-Z with proper form',
    icon: <LetterCase className="h-5 w-5 font-bold" />
  },
  {
    id: 'numbers',
    name: 'Numbers',
    description: 'Practice writing numbers with correct formation',
    icon: <Hash className="h-5 w-5" />
  }
];

const worksheetTemplates: WorksheetTemplate[] = [
  // Basic Strokes
  {
    id: 'horizontal-lines',
    title: 'Horizontal Lines',
    description: 'Practice drawing straight horizontal lines from left to right. Perfect for developing basic motor control.',
    level: 1,
    type: 'horizontal-lines',
    category: 'basic-strokes',
    worksheetUrl: '/worksheets/horizontal-lines.html',
    estimatedTime: '10-15 minutes',
    skills: ['Motor Control', 'Line Direction', 'Pencil Grip'],
    icon: <AlignLeft className="h-5 w-5" />
  },
  {
    id: 'vertical-lines',
    title: 'Vertical Lines',
    description: 'Master vertical line formation from top to bottom. Essential foundation for letter writing.',
    level: 1,
    type: 'vertical-lines',
    category: 'basic-strokes',
    worksheetUrl: '/worksheets/vertical-lines.html',
    estimatedTime: '10-15 minutes',
    skills: ['Motor Control', 'Line Direction', 'Hand Stability'],
    icon: <ArrowUpDown className="h-5 w-5" />
  },
  {
    id: 'diagonal-lines',
    title: 'Diagonal Lines',
    description: 'Practice drawing diagonal lines in different directions. Important for letters like A, K, M, N, V, W, X, Y, Z.',
    level: 1,
    type: 'diagonal-lines',
    category: 'basic-strokes',
    worksheetUrl: '/worksheets/diagonal-lines.html',
    estimatedTime: '15-20 minutes',
    skills: ['Diagonal Strokes', 'Angle Control', 'Hand-Eye Coordination'],
    icon: <ArrowUpDown className="h-5 w-5 rotate-45" />
  },
  {
    id: 'intersecting-lines',
    title: 'Intersecting Lines',
    description: 'Learn to create crosses and plus signs with precision. Builds skills for letters like t, f, and x.',
    level: 1,
    type: 'intersecting-lines',
    category: 'basic-strokes',
    worksheetUrl: '/worksheets/intersecting-lines.html',
    estimatedTime: '15-20 minutes',
    skills: ['Crossing Lines', 'Precision', 'Visual Planning'],
    icon: <LayoutGrid className="h-5 w-5" />
  },
  {
    id: 'continuous-curves',
    title: 'Continuous Curves',
    description: 'Develop fluid motion with wavy lines and loops. Essential preparation for cursive writing.',
    level: 1,
    type: 'continuous-curves',
    category: 'basic-strokes',
    worksheetUrl: '/worksheets/continuous-curves.html',
    estimatedTime: '15-20 minutes',
    skills: ['Fluid Motion', 'Rhythm', 'Hand Control'],
    icon: <Pencil className="h-5 w-5" />
  },
  
  // Shapes
  {
    id: 'circles',
    title: 'Circle Practice',
    description: 'Learn to draw smooth, round circles. Important for letters like o, a, d, and g.',
    level: 2,
    type: 'circles',
    category: 'shapes',
    worksheetUrl: '/worksheets/circles.html',
    estimatedTime: '15-20 minutes',
    skills: ['Circular Motion', 'Shape Recognition', 'Smooth Curves'],
    icon: <CircleDot className="h-5 w-5" />
  },
  {
    id: 'basic-shapes',
    title: 'Basic Shapes',
    description: 'Practice squares, triangles, and rectangles. These shapes help develop the skills needed for letter formation.',
    level: 2,
    type: 'basic-shapes',
    category: 'shapes',
    worksheetUrl: '/worksheets/basic-shapes.html',
    estimatedTime: '20-25 minutes',
    skills: ['Shape Drawing', 'Combining Lines', 'Geometric Forms'],
    icon: <Shapes className="h-5 w-5" />
  },
  
  // Lowercase Letters
  {
    id: 'letter-a',
    title: 'Lowercase a',
    description: 'Practice the round body and short tail of the letter "a".',
    level: 3,
    type: 'letter-a',
    category: 'lowercase-letters',
    worksheetUrl: '/worksheets/letter-a.html',
    estimatedTime: '10-15 minutes',
    skills: ['Round Shapes', 'Closing Shapes', 'Short Strokes'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'letter-b',
    title: 'Lowercase b',
    description: 'Master the tall back and round belly of the letter "b".',
    level: 3,
    type: 'letter-b',
    category: 'lowercase-letters',
    worksheetUrl: '/worksheets/letter-b.html',
    estimatedTime: '10-15 minutes',
    skills: ['Tall Strokes', 'Reversing Curves'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'letter-c',
    title: 'Lowercase c',
    description: 'Practice the open, curving shape of the letter "c".',
    level: 3,
    type: 'letter-c',
    category: 'lowercase-letters',
    worksheetUrl: '/worksheets/letter-c.html',
    estimatedTime: '10-15 minutes',
    skills: ['Open Curves', 'Counter-clockwise Motion'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'lowercase-magic-c',
    title: 'Magic C Letters',
    description: 'Learn the "Magic C" formation used in letters c, a, d, g, o, and q.',
    level: 3,
    type: 'lowercase-magic-c',
    category: 'lowercase-letters',
    worksheetUrl: '/worksheets/lowercase-magic-c.html',
    estimatedTime: '20-25 minutes',
    skills: ['C Formation', 'Letter Families', 'Consistent Curves'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'lowercase-down-up',
    title: 'Down and Up Letters',
    description: 'Practice the "down and up" formation used in letters h, m, n, r, b, and p.',
    level: 3,
    type: 'lowercase-down-up',
    category: 'lowercase-letters',
    worksheetUrl: '/worksheets/lowercase-down-up.html',
    estimatedTime: '20-25 minutes',
    skills: ['Vertical Strokes', 'Curved Connections', 'Consistent Height'],
    icon: <FileText className="h-5 w-5" />
  },
  
  // Uppercase Letters
  {
    id: 'uppercase-straight-lines',
    title: 'Straight Line Letters',
    description: 'Practice uppercase letters made with straight lines: E, F, H, I, L, and T.',
    level: 3,
    type: 'uppercase-straight-lines',
    category: 'uppercase-letters',
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    estimatedTime: '20-25 minutes',
    skills: ['Vertical Lines', 'Horizontal Lines', 'Letter Formation'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'uppercase-curve-line',
    title: 'Curve & Line Letters',
    description: 'Master uppercase letters with vertical lines and curves: B, D, P, and R.',
    level: 3,
    type: 'uppercase-curve-line',
    category: 'uppercase-letters',
    worksheetUrl: '/worksheets/uppercase-curve-line.html',
    estimatedTime: '20-25 minutes',
    skills: ['Vertical Lines', 'Curved Strokes', 'Letter Formation'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'uppercase-full-curves',
    title: 'Full Curve Letters',
    description: 'Practice uppercase letters made with curves: C, G, O, Q, and S.',
    level: 3,
    type: 'uppercase-full-curves',
    category: 'uppercase-letters',
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    estimatedTime: '20-25 minutes',
    skills: ['Curved Strokes', 'Open Shapes', 'Letter Formation'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'uppercase-diagonal-lines',
    title: 'Diagonal Line Letters',
    description: 'Learn uppercase letters with diagonal lines: A, K, M, N, V, W, X, Y, and Z.',
    level: 3,
    type: 'uppercase-diagonal-lines',
    category: 'uppercase-letters',
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    estimatedTime: '20-25 minutes',
    skills: ['Diagonal Lines', 'Crossing Lines', 'Letter Formation'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'uppercase-mixed-formation',
    title: 'Mixed Formation Letters',
    description: 'Practice special uppercase letters with unique shapes: J and U.',
    level: 3,
    type: 'uppercase-mixed-formation',
    category: 'uppercase-letters',
    worksheetUrl: '/worksheets/uppercase-mixed-formation.html',
    estimatedTime: '15-20 minutes',
    skills: ['Vertical Lines', 'Curved Strokes', 'Letter Formation'],
    icon: <FileText className="h-5 w-5" />
  },
  
  // Numbers
  {
    id: 'numbers-0-5',
    title: 'Numbers 0-5',
    description: 'Learn to write numbers 0, 1, 2, 3, 4, and 5 with proper formation.',
    level: 3,
    type: 'numbers-0-5',
    category: 'numbers',
    worksheetUrl: '/worksheets/numbers-0-5.html',
    estimatedTime: '20-25 minutes',
    skills: ['Number Formation', 'Counting', 'Precision'],
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'numbers-6-9',
    title: 'Numbers 6-9',
    description: 'Practice writing numbers 6, 7, 8, and 9 with correct technique.',
    level: 3,
    type: 'numbers-6-9',
    category: 'numbers',
    worksheetUrl: '/worksheets/numbers-6-9.html',
    estimatedTime: '20-25 minutes',
    skills: ['Number Formation', 'Complex Curves', 'Precision'],
    icon: <FileText className="h-5 w-5" />
  }
];

export default function WorksheetsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level <= 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (level <= 6) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Intermediate';
    if (level <= 6) return 'Advanced';
    return 'Expert';
  };

  const categories = ['All', ...worksheetCategories.map(c => c.name)];
  
  const filteredWorksheets = selectedCategory === 'All' 
    ? worksheetTemplates 
    : worksheetTemplates.filter(w => {
        const categoryObj = worksheetCategories.find(c => c.name === selectedCategory);
        return categoryObj ? w.category === categoryObj.id : false;
      });

  // Group worksheets by category for display
  const groupedWorksheets = filteredWorksheets.reduce((acc, worksheet) => {
    const category = worksheet.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(worksheet);
    return acc;
  }, {} as Record<string, WorksheetTemplate[]>);

  const isKidsMode = profile?.display_mode === 'kids';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading worksheets...</p>
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
            {isKidsMode ? '✏️ Fun Practice Worksheets!' : 'Practice Worksheets'}
          </h1>
          <p className={`text-xl ${isKidsMode ? 'text-purple-700' : 'text-gray-600'} max-w-3xl mx-auto`}>
            {isKidsMode 
              ? 'Print these super fun worksheets and practice your awesome handwriting skills!' 
              : 'Interactive worksheets to improve your handwriting skills. Print, practice, and upload for AI feedback.'}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-700">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
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

        {/* Worksheets by Category */}
        {selectedCategory === 'All' ? (
          // Display all worksheets grouped by category
          Object.entries(groupedWorksheets).map(([categoryId, worksheets]) => {
            const category = worksheetCategories.find(c => c.id === categoryId);
            if (!category) return null;
            
            return (
              <div key={categoryId} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${isKidsMode ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    {category.icon}
                  </div>
                  <h2 className={`text-2xl font-bold ${isKidsMode ? 'text-purple-800' : 'text-gray-900'}`}>
                    {category.name}
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {worksheets.map((worksheet) => (
                    <WorksheetCard 
                      key={worksheet.id} 
                      worksheet={worksheet} 
                      isKidsMode={isKidsMode} 
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Display filtered worksheets
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorksheets.map((worksheet) => (
              <WorksheetCard 
                key={worksheet.id} 
                worksheet={worksheet} 
                isKidsMode={isKidsMode} 
              />
            ))}
          </div>
        )}

        {/* Info Section */}
        <Card className={`border-0 shadow-lg mt-12 ${isKidsMode ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200' : ''}`}>
          <CardHeader>
            <CardTitle className={isKidsMode ? 'text-purple-800' : ''}>How to Use Worksheets</CardTitle>
            <CardDescription className={isKidsMode ? 'text-purple-600' : ''}>
              Get the most out of your handwriting practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${isKidsMode ? 'bg-purple-600' : 'bg-primary'} text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold`}>
                    1
                  </div>
                  <h4 className="font-semibold">Choose & Preview</h4>
                </div>
                <p className={`text-sm ${isKidsMode ? 'text-purple-700' : 'text-muted-foreground'}`}>
                  Select a worksheet that matches your skill level and preview it online before printing.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${isKidsMode ? 'bg-purple-600' : 'bg-primary'} text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold`}>
                    2
                  </div>
                  <h4 className="font-semibold">Print & Practice</h4>
                </div>
                <p className={`text-sm ${isKidsMode ? 'text-purple-700' : 'text-muted-foreground'}`}>
                  Print the worksheet on standard paper and practice with a pencil or pen that feels comfortable.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${isKidsMode ? 'bg-purple-600' : 'bg-primary'} text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold`}>
                    3
                  </div>
                  <h4 className="font-semibold">Upload & Analyze</h4>
                </div>
                <p className={`text-sm ${isKidsMode ? 'text-purple-700' : 'text-muted-foreground'}`}>
                  Take a photo of your completed worksheet and upload it to get AI-powered feedback and analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

// Worksheet Card Component
function WorksheetCard({ worksheet, isKidsMode }: { worksheet: WorksheetTemplate, isKidsMode: boolean }) {
  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level <= 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (level <= 6) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Intermediate';
    if (level <= 6) return 'Advanced';
    return 'Expert';
  };

  const openWorksheet = (worksheetUrl: string) => window.open(worksheetUrl, '_blank', 'noopener,noreferrer');

  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${isKidsMode ? 'bg-white border-2 border-purple-100 hover:border-purple-300 hover:scale-[1.02]' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`text-lg group-hover:text-primary transition-colors ${isKidsMode ? 'text-purple-700' : ''}`}>
              <div className="flex items-center gap-2">
                {worksheet.icon}
                {worksheet.title}
              </div>
            </CardTitle>
            <CardDescription className={`mt-2 line-clamp-2 ${isKidsMode ? 'text-purple-600' : ''}`}>
              {worksheet.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Star className={`h-4 w-4 ${isKidsMode ? 'text-purple-500' : 'text-yellow-500'}`} />
            <span className="text-sm font-medium">{worksheet.level}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={getDifficultyColor(worksheet.level)}>
            {getDifficultyLabel(worksheet.level)}
          </Badge>
          <Badge variant="secondary">
            {worksheetCategories.find(c => c.id === worksheet.category)?.name || worksheet.category}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{worksheet.estimatedTime}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {worksheet.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => openWorksheet(worksheet.worksheetUrl)} 
            className={`w-full ${isKidsMode ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={() => window.print()} 
            variant="outline" 
            size="icon"
            className={isKidsMode ? 'hover:bg-purple-100' : ''}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}