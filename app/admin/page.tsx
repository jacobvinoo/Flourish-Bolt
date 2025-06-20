'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/lib/database.types';
import { AlertCircle, CheckCircle, Loader2, UserPlus, Users, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('Demo123!');
  const [fullName, setFullName] = useState('Demo User');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const createUser = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: `User ${email} created successfully!` });
        setEmail('');
        setPassword('');
        setFullName('');
        await fetchUsers();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (testEmail: string, testPassword: string) => {
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setMessage({ type: 'error', text: `Login failed: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: `Login successful for ${testEmail}!` });
        // Sign out immediately after test
        await supabase.auth.signOut();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Login test failed' });
    } finally {
      setLoading(false);
    }
  };

  const createDemoUsers = async () => {
    setLoading(true);
    setMessage(null);

    const demoUsers = [
      { email: 'demo@example.com', password: 'Demo123!', fullName: 'Demo User' },
      { email: 'student@demo.com', password: 'Student123!', fullName: 'Student User' },
      { email: 'test@handwriting.app', password: 'Test123!', fullName: 'Test User' }
    ];

    let successCount = 0;
    let errors = [];

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
          errors.push(`${user.email}: ${error.message}`);
        } else {
          successCount++;
        }
      } catch (err) {
        errors.push(`${user.email}: Unexpected error`);
      }
    }

    if (successCount > 0) {
      setMessage({ 
        type: 'success', 
        text: `Created ${successCount} demo users successfully!${errors.length > 0 ? ` Errors: ${errors.join(', ')}` : ''}` 
      });
    } else {
      setMessage({ type: 'error', text: `Failed to create users: ${errors.join(', ')}` });
    }

    await fetchUsers();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Create and manage demo users for testing authentication
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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create User */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create New User
              </CardTitle>
              <CardDescription>
                Add a new user for testing authentication
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
                  placeholder="user@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password123!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                />
              </div>

              <Button
                onClick={createUser}
                disabled={loading || !email || !password}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>

              <Button
                onClick={createDemoUsers}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Demo Users...
                  </>
                ) : (
                  'Create All Demo Users'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Users */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Existing Users ({users.length})
              </CardTitle>
              <CardDescription>
                Users currently in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                  <p className="text-sm">Create some demo users to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.full_name || 'No name'}</p>
                        <p className="text-sm text-muted-foreground">{user.id}</p>
                        <p className="text-xs text-muted-foreground">Role: {user.user_role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Login */}
        <Card className="border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Test Login Credentials</CardTitle>
            <CardDescription>
              Test these credentials to verify they work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Demo User</h4>
                <p className="text-sm text-muted-foreground">demo@example.com</p>
                <p className="text-sm text-muted-foreground">Demo123!</p>
                <Button
                  onClick={() => testLogin('demo@example.com', 'Demo123!')}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Test Login
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Student User</h4>
                <p className="text-sm text-muted-foreground">student@demo.com</p>
                <p className="text-sm text-muted-foreground">Student123!</p>
                <Button
                  onClick={() => testLogin('student@demo.com', 'Student123!')}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Test Login
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Test User</h4>
                <p className="text-sm text-muted-foreground">test@handwriting.app</p>
                <p className="text-sm text-muted-foreground">Test123!</p>
                <Button
                  onClick={() => testLogin('test@handwriting.app', 'Test123!')}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Test Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/login">Go to Login</a>
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