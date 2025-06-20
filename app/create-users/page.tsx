'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';
import { AlertCircle, CheckCircle, Loader2, UserPlus, Copy } from 'lucide-react';

export default function CreateUsersPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClientComponentClient<Database>();

  const demoUsers = [
    { email: 'demo@example.com', password: 'Demo123!', fullName: 'Demo User' },
    { email: 'student@demo.com', password: 'Student123!', fullName: 'Student User' },
    { email: 'test@handwriting.app', password: 'Test123!', fullName: 'Test User' },
    { email: 'admin@demo.com', password: 'Admin123!', fullName: 'Admin User' }
  ];

  const createAllUsers = async () => {
    setLoading(true);
    setMessage(null);
    setResults([]);

    let successCount = 0;
    let newResults = [];

    for (const user of demoUsers) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: user.fullName,
            },
          },
        });

        if (error) {
          newResults.push({
            email: user.email,
            status: 'error',
            message: error.message
          });
        } else {
          newResults.push({
            email: user.email,
            password: user.password,
            status: 'success',
            message: 'Created successfully'
          });
          successCount++;
        }
      } catch (err) {
        newResults.push({
          email: user.email,
          status: 'error',
          message: 'Unexpected error'
        });
      }
    }

    setResults(newResults);
    
    if (successCount > 0) {
      setMessage({ 
        type: 'success', 
        text: `Successfully created ${successCount} out of ${demoUsers.length} users!` 
      });
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Failed to create any users. They might already exist.' 
      });
    }

    setLoading(false);
  };

  const testLogin = async (email: string, password: string) => {
    setLoading(true);
    setMessage(null);

    try {
      // First sign out any existing session
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: `Login failed for ${email}: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: `✅ Login successful for ${email}! You can now use these credentials.` });
        // Sign out immediately after test
        await supabase.auth.signOut();
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Login test failed for ${email}` });
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    setMessage({ type: 'success', text: `Copied credentials for ${email}` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🚀 Create Demo Users</h1>
          <p className="text-muted-foreground">
            One-click solution to create all demo users for testing
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <p className={`text-sm ${
              message.type === 'success' 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create All Demo Users
            </CardTitle>
            <CardDescription>
              This will create 4 demo users with different roles for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={createAllUsers}
              disabled={loading}
              className="w-full mb-4"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Users...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create All Demo Users
                </>
              )}
            </Button>

            <div className="text-sm text-muted-foreground">
              <p><strong>Users to be created:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {demoUsers.map((user) => (
                  <li key={user.email}>
                    {user.email} - {user.fullName}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Results & Test Credentials</CardTitle>
              <CardDescription>
                Use these credentials to test login functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{result.email}</p>
                        {result.password && (
                          <p className="text-sm text-muted-foreground">Password: {result.password}</p>
                        )}
                        <p className={`text-sm ${
                          result.status === 'success' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {result.message}
                        </p>
                      </div>
                      {result.status === 'success' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyCredentials(result.email, result.password)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => testLogin(result.email, result.password)}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Test Login'
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/login">Go to Login</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/reset-auth">Reset Auth</a>
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