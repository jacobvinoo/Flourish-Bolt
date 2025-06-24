import { PenTool, Globe, Zap, Crown, Users, BarChart3, Target, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-x-hidden">
      {/* Constrained Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Left side elements - constrained to left 10% of screen */}
        <div className="absolute top-20 left-8 w-12 h-12 animate-pulse">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
        </div>
        
        <div className="absolute top-80 left-4 w-10 h-10 bg-red-400 rounded-xl animate-bounce shadow-xl"></div>
        <div className="absolute bottom-40 left-6 w-8 h-8 bg-blue-400 rounded-full animate-pulse shadow-xl"></div>
        
        {/* Right side elements - constrained to right 10% of screen */}
        <div className="absolute top-32 right-8 w-10 h-10 bg-green-400 rounded-xl animate-bounce shadow-xl"></div>
        <div className="absolute top-80 right-4 w-12 h-12 animate-pulse">
          <svg viewBox="0 0 24 24" className="w-full h-full text-purple-500 drop-shadow-lg">
            <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-6 w-8 h-8 bg-pink-400 rounded-full animate-pulse shadow-xl"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
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
                <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container - Properly Constrained */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
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
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center">
                <Button variant="link" className="text-gray-600 hover:text-gray-800">
                  👑 View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful Features for Better Handwriting
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to improve handwriting skills with advanced AI analysis
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    Advanced machine learning algorithms analyze handwriting with precision and provide detailed feedback
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    Monitor improvement over time with detailed analytics and personalized recommendations
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Interactive Worksheets</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    Engaging practice worksheets with instant feedback and gamified learning experiences
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-600">
                Start with our free tier or unlock advanced features with our premium plans
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic Plan */}
              <Card className="border-2 border-gray-200 relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Basic</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mt-4">Free</div>
                  <CardDescription className="mt-2">Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      5 analyses per month
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Basic feedback
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Standard worksheets
                    </li>
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="border-2 border-green-500 relative shadow-lg scale-105">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-4 py-1">Most Popular</Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mt-4">
                    $9.99<span className="text-lg text-gray-600">/month</span>
                  </div>
                  <CardDescription className="mt-2">Best for regular practice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Unlimited analyses
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Detailed feedback
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Premium worksheets
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Progress tracking
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>

              {/* Educator Plan */}
              <Card className="border-2 border-gray-200 relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Educator</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mt-4">
                    $19.99<span className="text-lg text-gray-600">/month</span>
                  </div>
                  <CardDescription className="mt-2">For teachers and schools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Classroom management
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Student progress reports
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Bulk upload tools
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Improve Your Handwriting?
            </h2>
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
      </main>

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