'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/lib/database.types';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function TestAuthPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('Demo123!');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient<Database>();

  const testSignIn = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        console.error('Sign in error:', error);
      } else {
        setResult(data);
        console.log('Sign in success:', data);
      }
    } catch (err) {
      setError('Unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testSession = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testUser = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        setError(error.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
      } else {
        setResult({ message: 'Signed out successfully' });
      }
    } catch (err) {
      setError('Unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Auth Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Test Supabase authentication functions to diagnose login issues
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Test Authentication</CardTitle>
              <CardDescription>
                Test different auth functions with sample credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={testSignIn}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Sign In'}
                </Button>
                
                <Button
                  onClick={testSession}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Session'}
                </Button>
                
                <Button
                  onClick={testUser}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test User'}
                </Button>
                
                <Button
                  onClick={signOut}
                  disabled={loading}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign Out'}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Sample Credentials:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Email:</strong> demo@example.com</p>
                  <p><strong>Password:</strong> Demo123!</p>
                  <p className="text-muted-foreground">or</p>
                  <p><strong>Email:</strong> student@demo.com</p>
                  <p><strong>Password:</strong> Student123!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {error ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : result ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : null}
                Results
              </CardTitle>
              <CardDescription>
                Authentication test results will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-2">Error</h4>
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              {result && !loading && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Success</h4>
                  <pre className="text-xs bg-background rounded p-2 overflow-auto max-h-64">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
              
              {!result && !error && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No results yet. Click a test button to begin.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Troubleshooting Guide */}
        <Card className="border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
            <CardDescription>
              Common issues and solutions for Supabase authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">1. Email Confirmation Required</h4>
                <p className="text-sm text-muted-foreground">
                  If you see "Email not confirmed", disable email confirmation in Supabase Dashboard → Authentication → Settings
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">2. Invalid Email Format</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure the email follows a valid format (e.g., user@domain.com)
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">3. User Not Found</h4>
                <p className="text-sm text-muted-foreground">
                  Check if the user exists in Supabase Dashboard → Authentication → Users
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">4. Environment Variables</h4>
                <p className="text-sm text-muted-foreground">
                  Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}