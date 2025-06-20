'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/database.types';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Play, 
  Star,
  Printer,
  Eye,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface WorksheetTemplate {
  id: string;
  title: string;
  description: string;
  level: number;
  type: 'horizontal-lines' | 'vertical-lines' | 'circles' | 'letters';
  category: string;
  estimatedTime: string;
  skills: string[];
}

const worksheetTemplates: WorksheetTemplate[] = [
  {
    id: 'horizontal-lines',
    title: 'Horizontal Lines',
    description: 'Practice drawing straight horizontal lines from left to right. Perfect for developing basic motor control.',
    level: 1,
    type: 'horizontal-lines',
    category: 'Basic Strokes',
    estimatedTime: '10-15 minutes',
    skills: ['Motor Control', 'Line Direction', 'Pencil Grip']
  },
  {
    id: 'vertical-lines',
    title: 'Vertical Lines',
    description: 'Master vertical line formation from top to bottom. Essential foundation for letter writing.',
    level: 1,
    type: 'vertical-lines',
    category: 'Basic Strokes',
    estimatedTime: '10-15 minutes',
    skills: ['Motor Control', 'Line Direction', 'Hand Stability']
  },
  {
    id: 'circles',
    title: 'Circle Practice',
    description: 'Learn to draw smooth, round circles. Important for letters like O, Q, and curved elements.',
    level: 2,
    type: 'circles',
    category: 'Shapes',
    estimatedTime: '15-20 minutes',
    skills: ['Circular Motion', 'Shape Recognition', 'Smooth Curves']
  },
  {
    id: 'letters',
    title: 'Letter Formation',
    description: 'Practice basic letter shapes with proper starting points and stroke direction.',
    level: 3,
    type: 'letters',
    category: 'Letters',
    estimatedTime: '20-25 minutes',
    skills: ['Letter Recognition', 'Stroke Order', 'Letter Formation']
  }
];

export default function WorksheetsPage() {
  const [user, setUser] = useState<User | null>(null);
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

  const categories = ['All', ...Array.from(new Set(worksheetTemplates.map(w => w.category)))];
  
  const filteredWorksheets = selectedCategory === 'All' 
    ? worksheetTemplates 
    : worksheetTemplates.filter(w => w.category === selectedCategory);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Practice Worksheets</h1>
            <p className="text-muted-foreground mt-1">
              Interactive worksheets to improve your handwriting skills
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Worksheets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredWorksheets.map((worksheet) => (
            <Card key={worksheet.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      <FileText className="h-5 w-5 inline-block mr-2" />
                      {worksheet.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {worksheet.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 text-yellow-500" />
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
                    {worksheet.category}
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
                  <Link href={`/worksheet/${worksheet.type}`} className="flex-1">
                    <Button className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/worksheet/${worksheet.type}`}>
                    <Button variant="outline" size="icon">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>How to Use Worksheets</CardTitle>
            <CardDescription>
              Get the most out of your handwriting practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-semibold">Choose & Preview</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select a worksheet that matches your skill level and preview it online before printing.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-semibold">Print & Practice</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Print the worksheet on standard paper and practice with a pencil or pen that feels comfortable.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-semibold">Upload & Analyze</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Take a photo of your completed worksheet and upload it to get AI-powered feedback and analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}