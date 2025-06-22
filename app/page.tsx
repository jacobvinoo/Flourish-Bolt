import { PenTool, Globe, Zap, Crown, Users, BarChart3, Target, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function Home() {
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

        {/* Floating Educational Elements - Scattered */}
        {/* Pencil */}
        <div className="absolute top-20 left-20 w-20 h-20 animate-float z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
        </div>

        {/* Letter A */}
        <div className="absolute top-64 left-12 w-16 h-16 animate-float-delay z-10">
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            A
          </div>
        </div>

        {/* Document icon */}
        <div className="absolute top-32 right-20 w-12 h-12 animate-twinkle z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-500 drop-shadow-lg">
            <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>

        {/* Letter F */}
        <div className="absolute top-56 right-16 w-16 h-16 animate-float z-10">
          <div className="w-full h-full bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            F
          </div>
        </div>

        {/* Chart/Analytics icon */}
        <div className="absolute bottom-32 left-16 w-14 h-14 animate-twinkle z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500 drop-shadow-lg">
            <path fill="currentColor" d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z" />
          </svg>
        </div>

        {/* Book - moved to middle right */}
        <div className="absolute top-1/2 right-20 transform -translate-y-8 w-16 h-16 animate-float-slow z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-purple-500 drop-shadow-lg">
            <path fill="currentColor" d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,21.1 22.25,21.81C22.35,21.86 22.4,21.91 22.5,21.91C22.75,21.91 23,21.66 23,21.41V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,19.81V6.5C10.55,5.4 8.45,5 6.5,5Z" />
          </svg>
        </div>

        {/* Letter L */}
        <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-cyan-500 rounded-full animate-float flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">L</div>
        
        {/* Letter O */}
        <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-violet-500 rounded-full animate-twinkle flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">O</div>

        {/* Letter U */}
        <div className="absolute top-1/3 right-12 w-14 h-14 animate-twinkle z-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            U
          </div>
        </div>

        {/* Letter R */}
        <div className="absolute bottom-1/4 left-20 w-14 h-14 animate-bounce-slow z-10">
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            R
          </div>
        </div>

        {/* Star icons */}
        <div className="absolute top-80 left-40 w-10 h-10 animate-twinkle-delay z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-400 drop-shadow-lg">
            <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>

        <div className="absolute bottom-80 right-40 w-8 h-8 animate-twinkle z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-pink-400 drop-shadow-lg">
            <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>

        {/* Number elements */}
        <div className="absolute top-1/2 left-8 w-12 h-12 animate-bounce-slow z-10">
          <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            1
          </div>
        </div>

        <div className="absolute bottom-60 right-8 w-12 h-12 animate-float z-10">
          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            2
          </div>
        </div>

        {/* Geometric shapes - positioned to the sides */}
        {/* Orange square - moved to left side */}
        <div className="absolute top-2/3 left-24 w-10 h-10 bg-orange-500 transform rotate-45 animate-float-delay shadow-xl z-10"></div>
        
        {/* Purple circle - moved to left side */}
        <div className="absolute top-1/2 left-32 w-12 h-12 bg-violet-500 rounded-full animate-twinkle flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">O</div>
        
        {/* Additional side shapes */}
        <div className="absolute top-1/4 left-8 w-8 h-8 bg-pink-500 rounded-full animate-twinkle shadow-xl z-10"></div>
        <div className="absolute bottom-1/3 left-12 w-12 h-12 bg-blue-500 transform rotate-12 animate-float shadow-xl z-10"></div>
        
        <div className="absolute top-1/3 right-8 w-8 h-8 bg-lime-500 rounded-full animate-bounce-slow shadow-xl z-10"></div>
        <div className="absolute bottom-1/4 right-12 w-10 h-10 bg-purple-500 transform rotate-45 animate-twinkle shadow-xl z-10"></div>
        <div className="absolute top-2/3 right-16 w-6 h-6 bg-yellow-500 rounded-full animate-float-delay shadow-xl z-10"></div>

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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
              <PenTool className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Flourish</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            AI-powered handwriting analysis and improvement platform for students, parents, and educators
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 border-gray-200 text-gray-700 hover:bg-gray-50">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Pricing CTA */}
          <div className="flex justify-center">
            <Link href="/pricing">
              <Badge variant="secondary" className="px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                <Crown className="h-4 w-4 mr-2" />
                View Pricing Plans
              </Badge>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-gray-900">AI-Powered Analysis</CardTitle>
              <CardDescription className="text-gray-600">
                Advanced machine learning algorithms analyze handwriting with precision and provide detailed feedback
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-gray-900">Progress Tracking</CardTitle>
              <CardDescription className="text-gray-600">
                Monitor improvement over time with detailed analytics and personalized recommendations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-gray-900">Interactive Worksheets</CardTitle>
              <CardDescription className="text-gray-600">
                Engaging practice worksheets with instant feedback and gamified learning experiences
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Preview */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start with our free tier or unlock advanced features with our premium plans
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-gray-900">Basic</CardTitle>
                <div className="text-3xl font-bold text-gray-900">$9.99<span className="text-sm text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 10 analyses per month</li>
                  <li>• Basic feedback</li>
                  <li>• Progress tracking</li>
                  <li>• Standard worksheets</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg ring-2 ring-green-500 ring-offset-2 ring-offset-gray-50 scale-105 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-green-600">Most Popular</Badge>
                <CardTitle className="text-xl text-gray-900">Pro</CardTitle>
                <div className="text-3xl font-bold text-gray-900">$19.99<span className="text-sm text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Unlimited analyses</li>
                  <li>• Advanced AI feedback</li>
                  <li>• Custom exercises</li>
                  <li>• Multiple students</li>
                  <li>• Detailed reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-gray-900">Educator</CardTitle>
                <div className="text-3xl font-bold text-gray-900">$49.99<span className="text-sm text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Everything in Pro</li>
                  <li>• Classroom management</li>
                  <li>• Bulk student accounts</li>
                  <li>• Educational reports</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                View All Plans & Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Getting Started Section */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Getting Started with Flourish</CardTitle>
            <CardDescription className="text-gray-600">
              Begin your handwriting improvement journey in just a few simple steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">1. Create Your Account</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Sign up for free and set up your profile. Choose between student, parent, or educator modes.
                </p>
                
                <h3 className="font-semibold mb-2 text-gray-900">2. Upload Handwriting Sample</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Take a photo of handwriting or complete one of our practice worksheets to get started.
                </p>
                
                <h3 className="font-semibold mb-2 text-gray-900">3. Get Instant Feedback</h3>
                <p className="text-sm text-gray-600">
                  Receive detailed AI analysis with personalized recommendations for improvement.
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="font-mono text-sm font-semibold mb-2 text-gray-900">Key Features</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ Real-time handwriting analysis</li>
                  <li>✓ Personalized practice worksheets</li>
                  <li>✓ Progress tracking and analytics</li>
                  <li>✓ Gamified learning experience</li>
                  <li>✓ Multi-user support</li>
                </ul>
                
                <h4 className="font-mono text-sm font-semibold mb-2 mt-4 text-gray-900">Perfect For</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Students improving handwriting</li>
                  <li>• Parents monitoring progress</li>
                  <li>• Educators and therapists</li>
                  <li>• Special needs support</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Link href="/signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  View Pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}