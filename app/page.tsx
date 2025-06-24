'use client';

import { PenTool, Target, TrendingUp, BookOpen, Sparkles, FileText, Brush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      {/* Floating Elements */}
      <div className="absolute left-8 top-40 animate-float-slow">
        <div className="bg-red-500 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">A</div>
      </div>
      <div className="absolute left-20 bottom-48 animate-float">
        <div className="bg-yellow-400 rounded-full w-6 h-6 shadow-md rotate-12">⭐</div>
      </div>
      <div className="absolute right-10 top-60 animate-float-delay">
        <div className="bg-green-500 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">F</div>
      </div>
      <div className="absolute right-24 bottom-24 animate-float">
        <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute left-10 top-2/3 animate-float-slow">
        <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute right-16 top-1/3 animate-float-delay">
        <div className="bg-pink-500 rounded-full w-9 h-9 flex items-center justify-center shadow-lg">
          <Brush className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Background Waves */}
      <div className="absolute inset-0 -z-10 flex">
        <div className="w-[25%] min-h-screen bg-gradient-to-b from-[#EBF3FF] to-[#CADDFE] rounded-r-[80px]" />
        <div className="w-[25%] min-h-screen bg-gradient-to-b from-[#D9F6E4] to-[#E1F5EE] rounded-l-[80px] ml-auto" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Flourish</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/login"><Button variant="ghost">Sign In</Button></Link>
          <Link href="/signup"><Button className="bg-green-600 hover:bg-green-700">Get Started</Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center bg-green-100 p-4 rounded-full mb-4">
            <PenTool className="text-green-700 w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Flourish</h2>
          <p className="text-lg text-gray-600 mb-6">AI-powered handwriting analysis and improvement platform for students, parents, and educators</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <Link href="/signup"><Button className="bg-green-600 hover:bg-green-700 px-6 py-2 text-lg">Get Started Free</Button></Link>
            <Link href="/login"><Button variant="outline" className="px-6 py-2 text-lg">Sign In</Button></Link>
          </div>
          <Button variant="link" className="text-gray-700 hover:text-gray-900">👑 View Pricing Plans</Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Powerful Features</h2>
          <p className="text-gray-600">Everything you need to improve handwriting with advanced AI</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                <Target className="text-blue-600 w-6 h-6" />
              </div>
              <CardTitle className="text-lg mt-4">AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-center text-gray-600">
                Analyze handwriting with precision using machine learning algorithms
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <TrendingUp className="text-green-600 w-6 h-6" />
              </div>
              <CardTitle className="text-lg mt-4">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-center text-gray-600">
                Monitor improvement with personalized reports and insights
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                <BookOpen className="text-purple-600 w-6 h-6" />
              </div>
              <CardTitle className="text-lg mt-4">Interactive Worksheets</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-center text-gray-600">
                Practice with gamified, feedback-driven worksheets
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
          <p className="text-gray-600">Start with our free tier or unlock advanced features with our premium plans</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Basic</CardTitle>
              <div className="text-4xl font-bold mt-2">Free</div>
              <CardDescription className="text-sm">Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>5 analyses/month</li>
                <li>Basic feedback</li>
                <li>Standard worksheets</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-600 relative shadow-lg scale-105">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-600 text-white px-4 py-1">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Pro</CardTitle>
              <div className="text-4xl font-bold mt-2">$9.99<span className="text-base text-gray-600">/mo</span></div>
              <CardDescription className="text-sm">Best for regular practice</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>Unlimited analyses</li>
                <li>Detailed feedback</li>
                <li>Premium worksheets</li>
                <li>Progress tracking</li>
              </ul>
              <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Start Free Trial</Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Educator</CardTitle>
              <div className="text-4xl font-bold mt-2">$19.99<span className="text-base text-gray-600">/mo</span></div>
              <CardDescription className="text-sm">For teachers and classrooms</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>Manage multiple students</li>
                <li>Detailed reports</li>
                <li>Bulk upload tools</li>
                <li>Priority support</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
