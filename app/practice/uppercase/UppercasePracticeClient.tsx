// app/practice/uppercase/UppercasePracticeClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import PageLayout from '@/components/PageLayout';
import { Database, Profile } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Star,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Define the structure for the props passed to this component
interface PracticePageClientProps {
  user: User;
  profile: Profile | null;
}

// Define the structure for a single worksheet category
interface WorksheetCategory {
  id: string;
  title: string;
  friendlyTitle: string;
  description: string;
  kidsDescription: string;
  level: number;
  worksheetUrl: string;
  skills: string[];
  estimatedTime: string;
  color: string;
  emoji: string;
  linkTo: string;
}

// This array defines the categories for uppercase letters practice
const uppercaseCategories: WorksheetCategory[] = [
  {
    id: 'straight-lines',
    title: 'Worksheet 2.1: Straight Line Letters',
    friendlyTitle: 'Straight Line Letters!',
    description: 'Practice uppercase letters made with straight lines: E, F, H, I, L, T.',
    kidsDescription: 'Let\'s draw letters with straight lines like E, F, H, I, L, and T!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-straight-lines.html',
    skills: ['Straight lines', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '15-20 minutes',
    color: 'from-blue-400 to-blue-600',
    emoji: 'E',
    linkTo: '/practice/uppercase-straight-lines'
  },
  {
    id: 'curve-line',
    title: 'Worksheet 2.2: Curve & Line Letters',
    friendlyTitle: 'Curve & Line Letters!',
    description: 'Master uppercase letters with curves and lines: B, D, P, R.',
    kidsDescription: 'Let\'s make letters with curves and lines like B, D, P, and R!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-curve-line.html',
    skills: ['Curved lines', 'Straight lines', 'Letter formation'],
    estimatedTime: '15-20 minutes',
    color: 'from-purple-400 to-purple-600',
    emoji: 'B',
    linkTo: '/practice/uppercase-curve-line'
  },
  {
    id: 'full-curves',
    title: 'Worksheet 2.3: Full Curve Letters',
    friendlyTitle: 'Curvy Letters!',
    description: 'Learn to write uppercase letters with full curves: C, G, O, Q, S.',
    kidsDescription: 'Let\'s draw curvy letters like C, G, O, Q, and S!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-full-curves.html',
    skills: ['Curved lines', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '15-20 minutes',
    color: 'from-rose-400 to-rose-600',
    emoji: 'C',
    linkTo: '/practice/uppercase-full-curves'
  },
  {
    id: 'diagonal-lines',
    title: 'Worksheet 2.4: Diagonal Line Letters',
    friendlyTitle: 'Slanted Line Letters!',
    description: 'Practice uppercase letters with diagonal lines: A, K, M, N, V, W, X, Y, Z.',
    kidsDescription: 'Let\'s make letters with slanted lines like A, K, M, N, V, W, X, Y, and Z!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-diagonal-lines.html',
    skills: ['Diagonal lines', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '15-20 minutes',
    color: 'from-amber-400 to-amber-600',
    emoji: 'A',
    linkTo: '/practice/uppercase-diagonal-lines'
  },
  {
    id: 'mixed-formation',
    title: 'Worksheet 2.5: Mixed Formation Letters',
    friendlyTitle: 'Special Letters!',
    description: 'Master special uppercase letters with unique shapes: J, U.',
    kidsDescription: 'Let\'s learn special letters like J and U!',
    level: 2,
    worksheetUrl: '/worksheets/uppercase-mixed-formation.html',
    skills: ['Mixed techniques', 'Letter formation', 'Uppercase letters'],
    estimatedTime: '10-15 minutes',
    color: 'from-cyan-400 to-cyan-600',
    emoji: 'J',
    linkTo: '/practice/uppercase-mixed-formation'
  }
];

export default function UppercasePracticeClient({ user, profile }: PracticePageClientProps) {
  const [localProfile, setLocalProfile] = useState(profile);
  const router = useRouter();

  // Effect to keep local profile state in sync with props from the server component
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const isKidsMode = localProfile?.display_mode === 'kids';

  return (
    <PageLayout
      isKidsMode={isKidsMode}
      headerVariant="authenticated"
      headerProps={{
        showUserControls: true,
        profile: localProfile,
        currentStreak: localProfile?.current_streak ?? 0,
        xp: localProfile?.xp ?? 0
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className={`text-3xl font-bold ${isKidsMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-900'}`}>
            Uppercase Letter Practice
          </h2>
          <p className={`mt-2 text-lg ${isKidsMode ? 'text-blue-700' : 'text-gray-600'}`}>
            Let's master writing all the uppercase letters, from 'A' to 'Z'!
          </p>
        </div>

        {isKidsMode && (
          <div className="border-0 shadow-xl mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white overflow-hidden rounded-2xl">
            <div className="pt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="h-6 w-6" /> Your Uppercase Adventure!
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">5 Worksheets</div>
                  <div className="text-sm opacity-90">Pick one to start!</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uppercaseCategories.map((category) => (
            <Link 
              key={category.id}
              href={category.linkTo}
              className="block"
            >
              <div className={`border-0 shadow-xl overflow-hidden rounded-2xl transition-all duration-200 hover:scale-105 cursor-pointer ${
                isKidsMode 
                  ? `bg-gradient-to-br ${category.color} text-white` 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`text-4xl ${isKidsMode ? 'animate-bounce' : ''}`}>
                      {category.emoji}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${isKidsMode ? 'text-white' : 'text-gray-900'}`}>
                        {isKidsMode ? category.friendlyTitle : category.title}
                      </h3>
                    </div>
                  </div>
                  <p className={`text-sm mb-4 ${isKidsMode ? 'text-white/90' : 'text-gray-600'}`}>
                    {isKidsMode ? category.kidsDescription : category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isKidsMode 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {category.estimatedTime}
                    </div>
                    <Button 
                      size="sm" 
                      variant={isKidsMode ? "default" : "outline"}
                      className={isKidsMode ? "bg-white/20 hover:bg-white/30 text-white" : ""}
                    >
                      Start Practice <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 border-0 shadow-xl rounded-2xl bg-white/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            About Uppercase Letters
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700">
              Uppercase letters (also called capital letters) are important for starting sentences, writing names, and showing importance. 
              In this section, we've organized the uppercase alphabet into groups based on the types of strokes used to form them:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li><strong>Straight Line Letters:</strong> E, F, H, I, L, T - These letters use only straight lines.</li>
              <li><strong>Curve & Line Letters:</strong> B, D, P, R - These combine straight lines with curves.</li>
              <li><strong>Full Curve Letters:</strong> C, G, O, Q, S - These letters use primarily curved strokes.</li>
              <li><strong>Diagonal Line Letters:</strong> A, K, M, N, V, W, X, Y, Z - These use diagonal or slanted lines.</li>
              <li><strong>Special Formation Letters:</strong> J, U - These have unique formations that don't fit the other categories.</li>
            </ul>
            <p className="mt-4 text-gray-700">
              Choose any category to begin practicing. You can complete them in any order!
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}