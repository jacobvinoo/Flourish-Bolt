'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/lib/database.types';
import { AlertCircle, CheckCircle, Loader2, Database as DatabaseIcon, User, Settings } from 'lucide-react';

export default function DebugAuthPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('Demo123!');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [envCheck, setEnvCheck] = useState<any>(null);
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    // Check environment variables
    const checkEnv = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setEnvCheck({
        url: supabaseUrl ? 'Set' : 'Missing',
        key: supabaseKey ? 'Set' : 'Missing',
        urlValue: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'Not found',
        keyValue: supabaseKey ? supabaseKey.substring(0, 30) + '...' : 'Not found'
      });
    };

    checkEnv();
  }, []);

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testConnection = async () => {
    setLoading(true);
    addResult('Connection Test', 'info', 'Testing Supabase connection...');

    try {
      const { data, error } = await supabase.from('exercises').select('count').limit(1);
      
      if (error) {
        addResult('Connection Test', 'error', `Connection failed: ${error.message}`, error);
      } else {
        addResult('Connection Test', 'success', 'Successfully connected to Supabase database');
      }
    } catch (err) {
      addResult('Connection Test', 'error', `Connection error: ${err}`, err);
    } finally {
      setLoading(false);
    }
  };

  const testUserExists = async () => {
    setLoading(true);
    addResult('User Check', 'info', `Checking if user ${email} exists...`);

    try {
      // Try to get user info (this will work even if not authenticated)
      const { data, error } = await supabase.auth.getUser();
      addResult('Current User', 'info', 'Current auth state', data);

      // Try to sign in to see what happens
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        addResult('User Check', 'error', `Sign in failed: ${signInError.message}`, signInError);
      } else {
        addResult('User Check', 'success', 'User exists and credentials are correct', signInData);
      }
    } catch (err) {
      addResult('User Check', 'error', `Error checking user: ${err}`, err);
    } finally {
      setLoading(false);
    }
  };

  const testSession = async () => {
    setLoading(true);
    addResult('Session Test', 'info', 'Checking current session...');

    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult('Session Test', 'error', `Session error: ${error.message}`, error);
      } else {
        addResult('Session Test', 'success', 'Session retrieved', data);
      }
    } catch (err) {
      addResult('Session Test', 'error', `Session check error: ${err}`, err);
    } finally {
      setLoading(false);
    }
  };

  const testRLS = async () => {
    setLoading(true);
    addResult('RLS Test', 'info', 'Testing Row Level Security policies...');

    try {
      // Test exercises table (should be accessible to everyone)
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .limit(1);

      if (exercisesError) {
        addResult('RLS Test', 'error', `Exercises query failed: ${exercisesError.message}`, exercisesError);
      } else {
        addResult('RLS Test', 'success', `Exercises accessible: ${exercisesData?.length || 0} records`);
      }

      // Test profiles table (should require authentication)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (profilesError) {
        addResult('RLS Test', 'info', `Profiles query failed (expected if not authenticated): ${profilesError.message}`);
      } else {
        addResult('RLS Test', 'success', `Profiles accessible: ${profilesData?.length || 0} records`);
      }
    } catch (err) {
      addResult('RLS Test', 'error', `RLS test error: ${err}`, err);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    clearResults();
    await testConnection();
    await testSession();
    await testUserExists();
    await testRLS();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Authentication Debug Center</h1>
          <p className="text-muted-foreground">
            Comprehensive testing tool to diagnose authentication issues
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Environment Check */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Environment Variables
              </CardTitle>
              <CardDescription>
                Check if Supabase configuration is properly set
              </CardDescription>
            </CardHeader>
            <CardContent>
              {envCheck && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SUPABASE_URL:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      envCheck.url === 'Set' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {envCheck.url}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {envCheck.urlValue}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SUPABASE_ANON_KEY:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      envCheck.key === 'Set' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {envCheck.key}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {envCheck.keyValue}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Test Authentication
              </CardTitle>
              <CardDescription>
                Run tests with specific user credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to test"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-password">Password</Label>
                <Input
                  id="test-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to test"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={testConnection}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseIcon className="h-4 w-4" />}
                  Connection
                </Button>
                
                <Button
                  onClick={testSession}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Session'}
                </Button>
                
                <Button
                  onClick={testUserExists}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'User Check'}
                </Button>
                
                <Button
                  onClick={testRLS}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'RLS Test'}
                </Button>
              </div>

              <Button
                onClick={runAllTests}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run All Tests'
                )}
              </Button>

              <Button
                onClick={clearResults}
                variant="outline"
                className="w-full"
              >
                Clear Results
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Detailed results from authentication tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No test results yet. Run some tests to see results here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {result.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {result.status === 'info' && <AlertCircle className="h-4 w-4 text-blue-500" />}
                        <span className="font-medium">{result.test}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                    {result.data && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Having issues? Try these quick actions:
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/login">Back to Login</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/test-auth">Simple Auth Test</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}