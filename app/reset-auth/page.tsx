'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Users } from 'lucide-react';

export default function ResetAuthPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClientComponentClient<Database>();

  const signOutAll = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await supabase.auth.signOut();
      setMessage({ type: 'success', text: 'Signed out successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error signing out' });
    } finally {
      setLoading(false);
    }
  };

  const clearSession = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Clear any stored session data
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      setMessage({ type: 'success', text: 'Session cleared successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error clearing session' });
    } finally {
      setLoading(false);
    }
  };

  const createFreshDemoUser = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // First sign out any existing session
      await supabase.auth.signOut();
      
      // Create a new demo user with timestamp to ensure uniqueness
      const timestamp = Date.now();
      const email = `demo${timestamp}@example.com`;
      const password = 'Demo123!';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `Demo User ${timestamp}`,
          },
        },
      });

      if (error) {
        setMessage({ type: 'error', text: `Failed to create user: ${error.message}` });
      } else {
        setMessage({ 
          type: 'success', 
          text: `Created fresh demo user: ${email} with password: ${password}` 
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Unexpected error creating user' });
    } finally {
      setLoading(false);
    }
  };

  const testBasicAuth = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Test the most basic auth functionality
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setMessage({ type: 'error', text: `Session error: ${sessionError.message}` });
        return;
      }

      const { data: userdata, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setMessage({ type: 'error', text: `User error: ${userError.message}` });
        return;
      }

      setMessage({ 
        type: 'success', 
        text: `Auth system working. Current user: ${userdata.user ? userdata.user.email : 'None'}` 
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Auth system test failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reset Authentication</h1>
          <p className="text-muted-foreground">
            Tools to reset and fix authentication issues
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

        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Reset Session
              </CardTitle>
              <CardDescription>
                Clear all authentication data and start fresh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={signOutAll}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  'Sign Out'
                )}
              </Button>

              <Button
                onClick={clearSession}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Clearing Session...
                  </>
                ) : (
                  'Clear All Session Data'
                )}
              </Button>

              <Button
                onClick={testBasicAuth}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Auth System'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Create Fresh Demo User
              </CardTitle>
              <CardDescription>
                Create a brand new demo user with unique credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={createFreshDemoUser}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  'Create Fresh Demo User'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Troubleshooting Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>1. Clear Session:</strong> Remove all stored authentication data</p>
                <p><strong>2. Test Auth System:</strong> Verify Supabase connection is working</p>
                <p><strong>3. Create Fresh User:</strong> Generate new demo credentials</p>
                <p><strong>4. Try Login:</strong> Use the new credentials to log in</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <a href="/login">Go to Login</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin">User Management</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/debug-auth">Debug Auth</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}