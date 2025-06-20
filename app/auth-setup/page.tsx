'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/lib/database.types';
import { AlertCircle, CheckCircle, Loader2, Settings, Database as DatabaseIcon, User, Key, RefreshCw } from 'lucide-react';

export default function AuthSetupPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [workingCredentials, setWorkingCredentials] = useState<any>(null);
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    checkEnvironment();
  }, []);

  const addResult = (step: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setResults(prev => [...prev, {
      step,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const checkEnvironment = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setEnvStatus({
      hasUrl: !!url,
      hasKey: !!key,
      urlPreview: url ? url.substring(0, 30) + '...' : 'Missing',
      keyPreview: key ? key.substring(0, 30) + '...' : 'Missing'
    });

    if (!url || !key) {
      addResult('Environment Check', 'error', 'Missing Supabase environment variables');
    } else {
      addResult('Environment Check', 'success', 'Environment variables are set');
    }
  };

  const testConnection = async () => {
    setLoading(true);
    addResult('Connection Test', 'info', 'Testing Supabase connection...');

    try {
      // Test basic connection
      const { data, error } = await supabase.from('exercises').select('count').limit(1);
      
      if (error) {
        addResult('Connection Test', 'error', `Connection failed: ${error.message}`);
        return false;
      } else {
        addResult('Connection Test', 'success', 'Successfully connected to Supabase');
        return true;
      }
    } catch (err: any) {
      addResult('Connection Test', 'error', `Connection error: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createFreshUser = async () => {
    setLoading(true);
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const password = 'Test123!';

    addResult('User Creation', 'info', `Creating user: ${email}`);

    try {
      // Create user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `Test User ${timestamp}`,
          },
        },
      });

      if (signUpError) {
        addResult('User Creation', 'error', `Signup failed: ${signUpError.message}`);
        return null;
      }

      addResult('User Creation', 'success', `User created: ${email}`);

      // Wait a moment then test login
      await new Promise(resolve => setTimeout(resolve, 1000));

      addResult('Login Test', 'info', 'Testing login with new credentials...');

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        addResult('Login Test', 'error', `Login failed: ${signInError.message}`);
        return null;
      }

      addResult('Login Test', 'success', 'Login successful!');
      
      // Store working credentials
      const credentials = { email, password };
      setWorkingCredentials(credentials);

      // Sign out after test
      await supabase.auth.signOut();
      
      return credentials;
    } catch (err: any) {
      addResult('User Creation', 'error', `Unexpected error: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testExistingCredentials = async () => {
    setLoading(true);
    const testCreds = [
      { email: 'demo@example.com', password: 'Demo123!' },
      { email: 'student@demo.com', password: 'Student123!' },
      { email: 'test@handwriting.app', password: 'Test123!' }
    ];

    for (const cred of testCreds) {
      addResult('Existing Creds', 'info', `Testing ${cred.email}...`);
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cred.email,
          password: cred.password,
        });

        if (error) {
          addResult('Existing Creds', 'error', `${cred.email}: ${error.message}`);
        } else {
          addResult('Existing Creds', 'success', `${cred.email} works!`);
          setWorkingCredentials(cred);
          await supabase.auth.signOut();
          setLoading(false);
          return cred;
        }
      } catch (err: any) {
        addResult('Existing Creds', 'error', `${cred.email}: ${err.message}`);
      }
    }
    
    setLoading(false);
    return null;
  };

  const runFullDiagnostic = async () => {
    setResults([]);
    setWorkingCredentials(null);
    
    // Step 1: Check environment
    checkEnvironment();
    
    // Step 2: Test connection
    const connectionOk = await testConnection();
    if (!connectionOk) return;
    
    // Step 3: Test existing credentials
    const existingCreds = await testExistingCredentials();
    if (existingCreds) return;
    
    // Step 4: Create fresh user
    await createFreshUser();
  };

  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addResult('Final Login', 'error', `Login failed: ${error.message}`);
      } else {
        addResult('Final Login', 'success', 'Login successful! Redirecting...');
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      addResult('Final Login', 'error', `Login error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🔧 Authentication Setup & Diagnosis</h1>
          <p className="text-muted-foreground">
            Complete authentication troubleshooting and setup system
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Environment Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Environment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {envStatus && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Supabase URL:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      envStatus.hasUrl 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {envStatus.hasUrl ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground break-all">
                    {envStatus.urlPreview}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Anon Key:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      envStatus.hasKey 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {envStatus.hasKey ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground break-all">
                    {envStatus.keyPreview}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={runFullDiagnostic}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Diagnosis...
                  </>
                ) : (
                  <>
                    <DatabaseIcon className="h-4 w-4 mr-2" />
                    Run Full Diagnostic
                  </>
                )}
              </Button>

              <Button
                onClick={testConnection}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Test Connection
              </Button>

              <Button
                onClick={createFreshUser}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Create Fresh User
              </Button>

              <Button
                onClick={testExistingCredentials}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Test Existing Users
              </Button>
            </CardContent>
          </Card>

          {/* Working Credentials */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Working Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workingCredentials ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Found Working Credentials</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Email:</strong> {workingCredentials.email}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Password:</strong> {workingCredentials.password}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => loginWithCredentials(workingCredentials.email, workingCredentials.password)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Logging In...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Login Now
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No working credentials found yet</p>
                  <p className="text-xs">Run diagnostic to find or create them</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Log */}
        <Card className="border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Diagnostic Results</CardTitle>
            <CardDescription>
              Real-time results from authentication tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No diagnostic results yet. Click "Run Full Diagnostic" to begin.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : result.status === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {result.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                        {result.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                        {result.status === 'info' && <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                        <span className="font-medium text-sm">{result.step}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-muted-foreground">View Details</summary>
                        <pre className="text-xs mt-1 p-2 bg-background rounded overflow-auto">
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

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="outline" asChild>
              <a href="/simple-login">Simple Login</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/login">Regular Login</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/debug-auth">Debug Auth</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/">Home</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}