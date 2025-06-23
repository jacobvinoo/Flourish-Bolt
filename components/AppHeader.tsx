import React from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PenTool, ArrowLeft, Settings, User, Flame, Star } from 'lucide-react';

interface AppHeaderProps {
  variant?: 'landing' | 'authenticated' | 'minimal';
  isKidsMode?: boolean;
  showUserControls?: boolean;
  backLink?: string;
  backText?: string;
  profile?: any;
  currentStreak?: number;
  xp?: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  variant = 'landing',
  isKidsMode = false,
  showUserControls = false,
  backLink,
  backText,
  profile,
  currentStreak = 0,
  xp = 0
}) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const headerBgClass = isKidsMode 
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    : 'bg-white border-b border-gray-200';

  return (
    <header className={`${headerBgClass} relative z-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Back Button */}
          <div className="flex items-center gap-3">
            {backLink ? (
              <Link href={backLink}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${
                    isKidsMode 
                      ? 'text-white/90 hover:bg-white/10 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-all duration-200`}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backText || (isKidsMode ? '🏠 Back Home' : 'Back to Dashboard')}
                </Button>
              </Link>
            ) : (
              <>
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
                  {isKidsMode ? '✨ Flourish!' : 'Flourish'}
                </h1>
              </>
            )}
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center gap-4">
            {variant === 'landing' && (
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {variant === 'authenticated' && showUserControls && (
              <>
                {/* Streak Counter */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  isKidsMode 
                    ? 'bg-orange-400 text-white' 
                    : 'bg-orange-500 text-white'
                }`}>
                  <Flame className="h-4 w-4" />
                  <span className="font-bold text-sm">{currentStreak}</span>
                </div>
                
                {/* XP Counter */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  isKidsMode 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-orange-500 text-white'
                }`}>
                  <Star className="h-4 w-4" />
                  <span className="font-bold text-sm">{xp.toLocaleString()}</span>
                </div>

                {/* Settings */}
                <Link href="/profile/settings">
                  <button className={`p-2 rounded-lg transition-colors ${
                    isKidsMode 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                    <Settings className="h-4 w-4" />
                  </button>
                </Link>

                {/* Profile */}
                <Link href="/profile">
                  <button className={`p-2 rounded-lg transition-colors ${
                    isKidsMode 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                    <User className="h-4 w-4" />
                  </button>
                </Link>

                {/* Sign Out */}
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
              </>
            )}

            {variant === 'minimal' && (
              <Link href="/dashboard">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${
                    isKidsMode 
                      ? 'text-white/90 hover:bg-white/10 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-all duration-200`}
                >
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;