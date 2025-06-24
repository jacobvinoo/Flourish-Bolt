// Replacing local background and floating elements with shared components
'use client';

import { PenTool, Target, TrendingUp, BookOpen, Sparkles, FileText, Brush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import AnimatedBackground from '@/components/AnimatedBackground';
import AppHeader from '@/components/AppHeader';
import FloatingElements from '@/components/FloatingElements';

const animationStyles = `
  @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-10px) rotate(1deg); } 66% { transform: translateY(-5px) rotate(-1deg); } }
  @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } }
  @keyframes float-delay { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-8px) rotate(-1deg); } 66% { transform: translateY(-12px) rotate(1deg); } }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
  .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

export default function Home() {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white overflow-x-hidden relative">
      {/* Shared Animated Background */}
      <AnimatedBackground variant="full" showWaves={true} showPatterns={true} />

      {/* Shared Floating Elements */}
      <FloatingElements />

      {/* Main content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
              <PenTool className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">Flourish</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered handwriting improvement for students, parents, and educators
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">Get Started Free</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="text-lg text-gray-600 mt-2">Everything you need to improve handwriting with AI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-blue-600 w-6 h-6" />
                </div>
                <CardTitle>AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Analyze handwriting with advanced ML and get detailed feedback
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-green-600 w-6 h-6" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Monitor improvement and receive personalized practice suggestions
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-purple-600 w-6 h-6" />
                </div>
                <CardTitle>Interactive Worksheets</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Practice with engaging, gamified worksheets and real-time feedback
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 mt-2">Start free or unlock premium features</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="border">
              <CardHeader className="text-center">
                <CardTitle>Basic</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mt-2">Free</div>
                <CardDescription className="mt-1">Perfect to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li>✔ 5 analyses per month</li>
                  <li>✔ Basic feedback</li>
                  <li>✔ Standard worksheets</li>
                </ul>
                <Button className="mt-4 w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border border-green-500 shadow-lg scale-105 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-3 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mt-2">$9.99<span className="text-sm text-gray-600">/mo</span></div>
                <CardDescription className="mt-1">For regular practice</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li>✔ Unlimited analyses</li>
                  <li>✔ Detailed feedback</li>
                  <li>✔ Premium worksheets</li>
                  <li>✔ Progress tracking</li>
                </ul>
                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">Start Trial</Button>
              </CardContent>
            </Card>

            {/* Educator Plan */}
            <Card className="border">
              <CardHeader className="text-center">
                <CardTitle>Educator</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mt-2">$19.99<span className="text-sm text-gray-600">/mo</span></div>
                <CardDescription className="mt-1">Best for classrooms</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li>✔ Classroom tools</li>
                  <li>✔ Student progress reports</li>
                  <li>✔ Bulk uploads</li>
                  <li>✔ Priority support</li>
                </ul>
                <Button className="mt-4 w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-green-600 text-white text-center rounded-xl mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Flourish?</h2>
          <p className="text-lg mb-6">Join thousands improving their handwriting with AI</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">Start Free</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">Sign In</Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 py-12 border-t text-center text-sm text-gray-500">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-green-600 text-white p-2 rounded-lg mr-2">
              <PenTool className="h-4 w-4" />
            </div>
            <span className="font-bold text-gray-900">Flourish</span>
          </div>
          <p>© 2024 Flourish. All rights reserved.</p>
        </footer>
      </div>
          </div>
    </>
  );
}
