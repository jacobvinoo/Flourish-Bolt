'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/lib/database.types';
import { AlertCircle, Loader2, Eye, EyeOff, PenTool, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('Demo123!');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('Login page: Auth check result:', { user: !!user, error });
        
        if (error) {
          console.log('Login page: Auth error, staying on login page:', error.message);
          return;
        }
        
        if (user) {
          console.log('Login page: User already authenticated, redirecting to dashboard');
          window.location.href = '/dashboard';
        } else {
          console.log('Login page: No user found, staying on login page');
        }
      } catch (err) {
        console.log('Login page: Error checking auth, staying on login page:', err);
      }
    };
    checkAuth();
  }, [supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Login: Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log('Login: Sign in result:', { user: !!data.user, error });

      if (error) {
        console.log('Login: Sign in error:', error.message);
        setError(error.message);
      } else if (data.user) {
        console.log('Login: Sign in successful, redirecting to dashboard');
        setSuccess(true);
        // Use window.location.href for reliable redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (err: any) {
      console.log('Login: Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Login: Signing out current user...');
      await supabase.auth.signOut();
      setError(null);
      setSuccess(false);
      // Refresh the page to clear any cached state
      window.location.reload();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <PageLayout
      headerVariant="landing"
      backgroundVariant="full"
      containerWidth="max-w-4xl"
      showBackgroundElements={true}
      showFloatingElements={true}
      floatingElementsProps={{
        variant: 'minimal',
        density: 'low',
        showOnMobile: false
      }}
    >
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <PenTool className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Sign in to continue your handwriting journey
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Lock className="h-5 w-5" />
                Sign In
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
              
              {/* Debug Info - Show if user is already authenticated */}
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-xs"
                >
                  🔄 Clear Session & Retry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Sparkles className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-green-700">Login successful! Redirecting...</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : success ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Success!
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Demo Credentials
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Demo User:</p>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <div className="text-xs text-gray-700">
                          <div>demo@example.com</div>
                          <div className="text-gray-500">Demo123!</div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fillDemoCredentials('demo@example.com', 'Demo123!')}
                          className="text-xs px-2 py-1 h-7"
                          disabled={loading}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Student User:</p>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <div className="text-xs text-gray-700">
                          <div>student@demo.com</div>
                          <div className="text-gray-500">Student123!</div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fillDemoCredentials('student@demo.com', 'Student123!')}
                          className="text-xs px-2 py-1 h-7"
                          disabled={loading}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      href="/signup" 
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <div className="flex gap-4 justify-center text-sm">
              <Link 
                href="/working-auth" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Test Auth
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/simple-login" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Simple Login
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}