'use client';

import { PenTool, Globe, Zap, Crown, Users, BarChart3, Target, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Add animation styles
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

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-x-hidden">
      {/* Full Page Wave Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Left wave */}
        <svg className="absolute left-0 top-0 h-full w-64" viewBox="0 0 200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="leftWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L0,800 L120,800 Q160,720 120,640 Q80,560 120,480 Q160,400 120,320 Q80,240 120,160 Q160,80 120,0 Z"
            fill="url(#leftWave)"
          >
            <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0,0; 0,-8; 0,0; 0,6; 0,0" dur="8s" repeatCount="indefinite" />
          </path>
        </svg>

        {/* Right wave */}
        <svg className="absolute right-0 top-0 h-full w-64" viewBox="0 0 200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rightWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>
          <path
            d="M200,0 L200,800 L80,800 Q40,720 80,640 Q120,560 80,480 Q40,400 80,320 Q120,240 80,160 Q40,80 80,0 Z"
            fill="url(#rightWave)"
          >
            <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0,0; 0,6; 0,0; 0,-4; 0,0" dur="7s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>

      {/* Animated floating elements */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-20 left-8 w-12 h-12 animate-float">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
        </div>
        <div className="absolute top-64 left-2 w-12 h-12 animate-float-delay">
          <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">A</div>
        </div>
        <div className="absolute top-96 left-6 w-14 h-14 animate-bounce-slow">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">G</div>
        </div>
        <div className="absolute bottom-32 left-8 w-10 h-10 animate-twinkle-delay">
          <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400 drop-shadow-lg">
            <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-600">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Flourish</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto" style={{ maxWidth: 'calc(100vw - 32rem)' }}>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 rounded-full">
              <PenTool className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">Flourish</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered handwriting analysis and improvement platform for students, parents, and educators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">Get Started Free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">Sign In</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Better Handwriting</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
              Everything you need to improve handwriting skills with advanced AI analysis
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Advanced machine learning algorithms analyze handwriting with precision and provide detailed feedback
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Monitor improvement over time with detailed analytics and personalized recommendations
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Interactive Worksheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Engaging practice worksheets with instant feedback and gamified learning experiences
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-green-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Handwriting?</h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of students, parents, and educators who trust Flourish
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  Start Free Today
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-600 mr-3">
                  <PenTool className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-bold">Flourish</h3>
              </div>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Empowering better handwriting through AI-powered analysis and personalized learning experiences.
              </p>
              <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
                © 2024 Flourish. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

        {/* Hero, Features, Pricing, CTA, and Footer sections should be reinserted below here */}
      </main>
    </div>
  );
}
