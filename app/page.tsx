import { Database, Globe, Zap, Crown, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Handwriting Analysis</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            AI-powered handwriting analysis and improvement platform for students, parents, and therapists
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Pricing CTA */}
          <div className="flex justify-center">
            <Link href="/pricing">
              <Badge variant="secondary" className="px-4 py-2 hover:bg-secondary/80 transition-colors cursor-pointer">
                <Crown className="h-4 w-4 mr-2" />
                View Pricing Plans
              </Badge>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Advanced machine learning algorithms analyze handwriting with precision and provide detailed feedback
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor improvement over time with detailed analytics and personalized recommendations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Multi-User Support</CardTitle>
              <CardDescription>
                Perfect for students, parents, and therapists with role-based features and collaboration tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Preview */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start with our free tier or unlock advanced features with our premium plans
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Basic</CardTitle>
                <div className="text-3xl font-bold text-foreground">$9.99<span className="text-sm text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 10 analyses per month</li>
                  <li>• Basic feedback</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background scale-105">
              <CardHeader className="text-center">
                <Badge className="mb-2">Most Popular</Badge>
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="text-3xl font-bold text-foreground">$19.99<span className="text-sm text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Unlimited analyses</li>
                  <li>• Advanced AI feedback</li>
                  <li>• Custom exercises</li>
                  <li>• Multiple students</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Therapist</CardTitle>
                <div className="text-3xl font-bold text-foreground">$49.99<span className="text-sm text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Everything in Pro</li>
                  <li>• Clinical reports</li>
                  <li>• HIPAA compliance</li>
                  <li>• API access</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button size="lg" className="px-8">
                View All Plans & Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Getting Started Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to connect your Supabase project and start analyzing handwriting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">1. Set up Supabase</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Create a new project at supabase.com and get your project URL and anon key
                </p>
                
                <h3 className="font-semibold mb-2">2. Configure Environment</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy .env.local.example to .env.local and add your Supabase credentials
                </p>
                
                <h3 className="font-semibold mb-2">3. Start Analyzing</h3>
                <p className="text-sm text-muted-foreground">
                  Upload handwriting samples and get instant AI-powered feedback and improvement suggestions
                </p>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-mono text-sm font-semibold mb-2">Environment Variables</h4>
                <pre className="text-xs text-muted-foreground">
{`NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_REVENUECAT_API_KEY=your_rc_key`}
                </pre>
                
                <h4 className="font-mono text-sm font-semibold mb-2 mt-4">Quick Start</h4>
                <pre className="text-xs text-muted-foreground">
{`npm install
npm run dev`}
                </pre>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Link href="/signup">
                <Button>
                  Create Account
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline">
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