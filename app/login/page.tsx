'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/lib/database.types';
import { AlertCircle, Loader2, Eye, EyeOff, PenTool } from 'lucide-react';
import Link from 'next/link';

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

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('Demo123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-all duration-500 relative overflow-hidden bg-gray-50">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left Wavy Edge */}
        <div className="absolute left-0 top-0 h-full w-80 opacity-70">
          <svg viewBox="0 0 200 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="leftWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            <path 
              d="M0,0 L0,800 L120,800 Q160,720 120,640 Q80,560 120,480 Q160,400 120,320 Q80,240 120,160 Q160,80 120,0 Z" 
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

        {/* Right Wavy Edge */}
        <div className="absolute right-0 top-0 h-full w-80 opacity-70">
          <svg viewBox="0 0 200 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rightWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path 
              d="M200,0 L200,800 L80,800 Q40,720 80,640 Q120,560 80,480 Q40,400 80,320 Q120,240 80,160 Q40,80 80,0 Z" 
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

        {/* Wavy Background Patterns */}
        <div className="absolute -top-32 -left-32 w-96 h-96 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            <path d="M20,100 Q100,20 180,100 Q100,180 20,100" fill="url(#gradient1)" opacity="0.3" />
          </svg>
        </div>

        <div className="absolute -bottom-32 -right-32 w-80 h-80 opacity-15">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-reverse">
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#gradient2)" opacity="0.4" />
          </svg>
        </div>

        {/* Floating Educational Elements */}
        {/* Pencil */}
        <div className="absolute top-20 left-20 w-20 h-20 animate-float z-10 opacity-40">
          <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500 drop-shadow-lg">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
        </div>

        {/* Letter A */}
        <div className="absolute top-64 left-12 w-16 h-16 animate-float-delay z-10 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            A
          </div>
        </div>

        {/* Handwriting lines */}
        <div className="absolute top-40 left-8 w-24 h-12 animate-float-slow z-10 opacity-25">
          <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-lg">
            <path d="M5,20 Q15,10 25,20 Q35,30 25,35 M25,20 Q35,15 45,25 Q40,35 30,35 M45,20 Q55,10 65,20 Q75,30 65,35 M65,20 Q75,10 85,20 Q95,30 85,35 M85,20 Q95,10 105,20 Q115,30 105,35" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Document icon */}
        <div className="absolute top-32 right-20 w-12 h-12 animate-twinkle z-10 opacity-30">
          <svg viewBox="0 0 24 24" className="w-full h-full text-green-500 drop-shadow-lg">
            <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>

        {/* Letter F */}
        <div className="absolute top-56 right-16 w-16 h-16 animate-float z-10 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            F
          </div>
        </div>

        {/* Grid/practice lines */}
        <div className="absolute bottom-32 left-16 w-14 h-14 animate-twinkle z-10 opacity-25">
          <svg viewBox="0 0 24 24" className="w-full h-full text-gray-600">
            <path fill="currentColor" d="M9,5V9H15V5M9,11V15H15V11M9,17V21H15V17M5,5V9H7V5M5,11V15H7V11M5,17V21H7V17M17,5V9H19V5M17,11V15H19V11M17,17V21H19V17Z" />
          </svg>
        </div>

        {/* Book */}
        <div className="absolute bottom-56 right-14 w-16 h-16 animate-float-slow z-10 opacity-30">
          <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500 drop-shadow-lg">
            <path fill="currentColor" d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,21.1 22.25,21.81C22.35,21.86 22.4,21.91 22.5,21.91C22.75,21.91 23,21.66 23,21.41V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,19.81V6.5C10.55,5.4 8.45,5 6.5,5Z" />
          </svg>
        </div>

        {/* Additional scattered elements */}
        <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-blue-400 rounded-full animate-float opacity-20 flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">L</div>
        <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-green-400 transform rotate-45 animate-float-delay opacity-20 shadow-xl z-10"></div>
        <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-gray-400 rounded-full animate-twinkle opacity-20 flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">O</div>
        
        {/* Practice lines */}
        <div className="absolute top-20 right-36 w-32 h-8 animate-float-slow opacity-15 z-10">
          <svg viewBox="0 0 150 20" className="w-full h-full drop-shadow-lg">
            <path d="M5,10 Q25,5 45,10 Q65,15 85,10 Q105,5 125,10 Q145,15 150,10" stroke="#6366f1" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div className="absolute bottom-40 left-32 w-32 h-8 animate-float-delay opacity-15 z-10">
          <svg viewBox="0 0 150 20" className="w-full h-full drop-shadow-lg">
            <path d="M5,15 Q25,10 45,15 Q65,20 85,15 Q105,10 125,15 Q145,20 150,15" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Additional letters */}
        <div className="absolute top-1/3 right-12 w-14 h-14 animate-twinkle z-10 opacity-25">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            G
          </div>
        </div>

        <div className="absolute bottom-1/4 left-20 w-14 h-14 animate-bounce-slow z-10 opacity-25">
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            I
          </div>
        </div>

        {/* Wavy lines overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 1200 600" className="absolute inset-0">
            <defs>
              <pattern id="wave" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q50,0 100,50 T200,50" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-600">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Flourish
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/signup">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 relative z-10" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-lg text-gray-600">
              Continue your handwriting journey
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="border-gray-200 focus:border-green-400 focus:ring-green-400 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium py-3"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-sm mb-2 text-gray-900">Demo Credentials:</h4>
                <div className="text-xs space-y-1 text-gray-600">
                  <p><strong>Email:</strong> demo@example.com</p>
                  <p><strong>Password:</strong> Demo123!</p>
                  <p className="text-gray-500">or</p>
                  <p><strong>Email:</strong> student@demo.com</p>
                  <p><strong>Password:</strong> Student123!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}url(#gradient2)" opacity="0.4" />
          </svg>
        </div>

        {/* Floating Educational Elements */}
        {/* Pencil */}
        <div className="absolute top-20 left-20 w-20 h-20 animate-float z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
        </div>

        {/* Letter A */}
        <div className="absolute top-64 left-12 w-16 h-16 animate-float-delay z-10">
          <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            A
          </div>
        </div>

        {/* Welcome text */}
        <div className="absolute top-40 left-8 w-24 h-12 animate-float-slow z-10">
          <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-lg">
            <path d="M5,20 Q15,10 25,20 Q35,30 25,35 M25,20 Q35,15 45,25 Q40,35 30,35 M45,20 Q55,10 65,20 Q75,30 65,35 M65,20 Q75,10 85,20 Q95,30 85,35 M85,20 Q95,10 105,20 Q115,30 105,35" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Stars */}
        <div className="absolute top-32 right-20 w-12 h-12 animate-twinkle z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-pink-400 drop-shadow-lg">
            <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>

        {/* Letter F */}
        <div className="absolute top-56 right-16 w-16 h-16 animate-float z-10">
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            F
          </div>
        </div>

        {/* Number 1 */}
        <div className="absolute bottom-32 left-16 w-14 h-14 animate-twinkle z-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            1
          </div>
        </div>

        {/* Book */}
        <div className="absolute bottom-56 right-14 w-16 h-16 animate-float-slow z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-green-500 drop-shadow-lg">
            <path fill="currentColor" d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,21.1 22.25,21.81C22.35,21.86 22.4,21.91 22.5,21.91C22.75,21.91 23,21.66 23,21.41V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,19.81V6.5C10.55,5.4 8.45,5 6.5,5Z" />
          </svg>
        </div>

        {/* Additional scattered letters and elements */}
        <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-pink-400 rounded-full animate-float opacity-80 flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">L</div>
        <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-blue-400 transform rotate-45 animate-float-delay opacity-80 shadow-xl z-10"></div>
        <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-yellow-400 rounded-full animate-twinkle opacity-80 flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">O</div>
        
        {/* Cursive practice lines */}
        <div className="absolute top-20 right-36 w-32 h-8 animate-float-slow opacity-60 z-10">
          <svg viewBox="0 0 150 20" className="w-full h-full drop-shadow-lg">
            <path d="M5,10 Q25,5 45,10 Q65,15 85,10 Q105,5 125,10 Q145,15 150,10" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div className="absolute bottom-40 left-32 w-32 h-8 animate-float-delay opacity-60 z-10">
          <svg viewBox="0 0 150 20" className="w-full h-full drop-shadow-lg">
            <path d="M5,15 Q25,10 45,15 Q65,20 85,15 Q105,10 125,15 Q145,20 150,15" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Additional letters */}
        <div className="absolute top-1/3 right-12 w-14 h-14 animate-twinkle z-10">
          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            G
          </div>
        </div>

        <div className="absolute bottom-1/4 left-20 w-14 h-14 animate-bounce-slow z-10">
          <div className="w-full h-full bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            I
          </div>
        </div>

        {/* Number 2 */}
        <div className="absolute top-2/3 right-20 w-12 h-12 animate-bounce-slow z-10">
          <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            2
          </div>
        </div>

        {/* Wavy lines overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 1200 600" className="absolute inset-0">
            <defs>
              <pattern id="wave" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q50,0 100,50 T200,50" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                ✨ Flourish
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/signup">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 relative z-10" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              🌟 Welcome Back!
            </h2>
            <p className="text-lg text-purple-700">
              Ready to continue your handwriting journey? ✨
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-purple-800">Sign In</CardTitle>
              <CardDescription className="text-purple-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-purple-600 hover:text-purple-800"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      🔮 Signing in...
                    </>
                  ) : (
                    '🚀 Sign In'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-purple-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-purple-600 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-medium py-3"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="text-center">
                <p className="text-sm text-purple-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-pink-600 hover:text-pink-700 font-bold"
                  >
                    🌟 Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="font-bold text-sm mb-2 text-purple-800">🎮 Demo Credentials:</h4>
                <div className="text-xs space-y-1 text-purple-700">
                  <p><strong>Email:</strong> demo@example.com</p>
                  <p><strong>Password:</strong> Demo123!</p>
                  <p className="text-purple-600">or</p>
                  <p><strong>Email:</strong> student@demo.com</p>
                  <p><strong>Password:</strong> Student123!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}