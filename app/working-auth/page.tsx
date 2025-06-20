'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';
import { CheckCircle, AlertCircle, Loader2, User, Key, Database as DatabaseIcon } from 'lucide-react';

export default function WorkingAuthPage() {
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [workingCredentials, setWorkingCredentials] = useState<any[]>([]);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      setAuthStatus({
        session: sessionData,
        user: userData,
        sessionError,
        userError,
        isWorking: !sessionError && !userError
      });
    } catch (err) {
      setAuthStatus({
        isWorking: false,
        error: 'Failed to check auth status'
      });
    } finally {
      setLoading(false);
    }
  };

  const createWorkingUser = async () => {
    setLoading(true);
    const timestamp = Date.now();
    const email = `working${timestamp}@test.com`;
    const password = 'Working123!';

    try {
      // Create user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `Working User ${timestamp}`,
          },
        },
      });

      if (signUpError) {
        throw new Error(`Signup failed: ${signUpError.message}`);
      }

      // Test login immediately
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(`Login test failed: ${signInError.message}`);
      }

      // Add to working credentials
      setWorkingCredentials(prev => [...prev, {
        email,
        password,
        created: new Date().toLocaleTimeString(),
        tested: true,
        status: 'working'
      }]);

      // Sign out after test
      await supabase.auth.signOut();
      
    } catch (err: any) {
      setWorkingCredentials(prev => [...prev, {
        email,
        password,
        created: new Date().toLocaleTimeString(),
        tested: false,
        status: 'failed',
        error: err.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      alert(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">✅ Working Authentication</h1>
          <p className="text-muted-foreground">
            Create and test credentials that actually work
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Auth Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>
                Current authentication system status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !authStatus ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Supabase Connection:</span>
                    <span className={`flex items-center gap-1 text-sm ${
                      authStatus?.isWorking ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {authStatus?.isWorking ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Working
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          Issues
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current User:</span>
                    <span className="text-sm text-muted-foreground">
                      {authStatus?.user?.user?.email || 'None'}
                    </span>
                  </div>

                  <Button
                    onClick={checkAuthStatus}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Refresh Status'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Working User */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Create Working User
              </CardTitle>
              <CardDescription>
                Generate a new user and test login immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={createWorkingUser}
                disabled={loading}
                className="w-full mb-4"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating & Testing...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Create Working User
                  </>
                )}
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>This will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Create a new user with unique email</li>
                  <li>Test login immediately</li>
                  <li>Show you working credentials</li>
                  <li>Allow instant login to dashboard</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Working Credentials */}
        {workingCredentials.length > 0 && (
          <Card className="border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Working Credentials
              </CardTitle>
              <CardDescription>
                These credentials have been tested and work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workingCredentials.map((cred, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    cred.status === 'working' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{cred.email}</p>
                        <p className="text-sm text-muted-foreground">Password: {cred.password}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {cred.created} | Status: {cred.status}
                        </p>
                        {cred.error && (
                          <p className="text-xs text-red-600">{cred.error}</p>
                        )}
                      </div>
                      {cred.status === 'working' && (
                        <Button
                          onClick={() => loginWithCredentials(cred.email, cred.password)}
                          disabled={loading}
                          className="ml-4"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Login Now'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/simple-login">Simple Login</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/login">Regular Login</a>
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