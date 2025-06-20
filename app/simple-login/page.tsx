'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/lib/database.types';
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff, Settings } from 'lucide-react';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else if (data.user) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const createAndTestUser = async () => {
    setLoading(true);
    setMessage({ type: 'info', text: 'Creating test user...' });

    try {
      // Create a unique test user
      const timestamp = Date.now();
      const testEmail = `test${timestamp}@example.com`;
      const testPassword = 'Test123!';

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: `Test User ${timestamp}`,
          },
        },
      });

      if (signUpError) {
        setMessage({ type: 'error', text: `Failed to create user: ${signUpError.message}` });
        return;
      }

      setMessage({ type: 'info', text: 'User created! Testing login...' });

      // Wait a moment then test login
      setTimeout(async () => {
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });

          if (signInError) {
            setMessage({ type: 'error', text: `Login test failed: ${signInError.message}` });
          } else {
            setMessage({ 
              type: 'success', 
              text: `✅ SUCCESS! User created and login works!\n\nCredentials:\nEmail: ${testEmail}\nPassword: ${testPassword}\n\nYou can now use these to log in!` 
            });
            setEmail(testEmail);
            setPassword(testPassword);
            
            // Sign out the test session
            await supabase.auth.signOut();
          }
        } catch (err) {
          setMessage({ type: 'error', text: 'Login test failed with unexpected error' });
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create test user' });
      setLoading(false);
    }
  };

  const quickTestCredentials = [
    { email: 'demo@example.com', password: 'Demo123!' },
    { email: 'student@demo.com', password: 'Student123!' },
    { email: 'test@handwriting.app', password: 'Test123!' }
  ];

  const testQuickCredential = async (testEmail: string, testPassword: string) => {
    setLoading(true);
    setMessage({ type: 'info', text: `Testing ${testEmail}...` });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setMessage({ type: 'error', text: `${testEmail} failed: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: `✅ ${testEmail} works! You can use these credentials.` });
        setEmail(testEmail);
        setPassword(testPassword);
        await supabase.auth.signOut();
      }
    } catch (err) {
      setMessage({ type: 'error', text: `${testEmail} test failed` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">🔐 Simple Login</CardTitle>
            <CardDescription>
              Straightforward login that actually works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg flex items-start gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : message.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}>
                {message.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />}
                {message.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />}
                {message.type === 'info' && <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin mt-0.5" />}
                <p className={`text-sm whitespace-pre-line ${
                  message.type === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : message.type === 'error'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-blue-800 dark:text-blue-200'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
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

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Don't have working credentials? Try these options:
                </p>
              </div>

              <Button
                onClick={createAndTestUser}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating & Testing...
                  </>
                ) : (
                  '🚀 Create Fresh Test User'
                )}
              </Button>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Or test existing credentials:</p>
                {quickTestCredentials.map((cred, index) => (
                  <Button
                    key={index}
                    onClick={() => testQuickCredential(cred.email, cred.password)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Test {cred.email}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <Button variant="outline" size="sm" asChild>
                <a href="/auth-setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Diagnosis
                </a>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Having issues? This page creates working credentials and tests them immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}