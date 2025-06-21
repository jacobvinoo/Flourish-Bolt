'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Palette, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  Baby,
  Briefcase,
  Eye,
  Settings
} from 'lucide-react';
import Link from 'next/link';

type Profile = Tables<'profiles'>;

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>({
    full_name: '',
    user_role: 'student',
    display_mode: 'adult'
  });
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Callback to apply theme class to the body
  const applyTheme = useCallback((theme: 'adult' | 'kids' | null) => {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('adult-mode', 'kids-mode');
      if (theme) {
        document.body.classList.add(`${theme}-mode`);
      }
    }
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // Effect to apply theme when formData changes
  useEffect(() => {
    applyTheme(formData.display_mode as 'adult' | 'kids');
  }, [formData.display_mode, applyTheme]);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406 is "Not Acceptable", happens when no row is found
        throw error;
      }

      if (data) {
        console.log('Profile loaded:', data);
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          user_role: data.user_role || 'student',
          display_mode: data.display_mode || 'adult',
        });
      } else {
         // This block can be used to create a profile if one doesn't exist
        console.log('No profile found for user, using default form data.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const getUserAndProfile = async () => {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error or no user, redirecting to login.');
        router.push('/login');
        return;
      }
      
      console.log('User found:', user.id);
      setUser(user);
      await fetchProfile(user.id);
    };
    
    getUserAndProfile();

    // Cleanup theme class on component unmount
    return () => {
      applyTheme(null);
    };
  }, [supabase.auth, router, fetchProfile, applyTheme]);

  const handleSave = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'No user found' });
      return;
    }

    setMessage(null);
    setSaving(true);

    try {
      console.log('Saving profile data:', formData);
      
      const updateData: TablesUpdate<'profiles'> = {
        id: user.id,
        full_name: formData.full_name,
        user_role: formData.user_role as 'student' | 'parent' | 'therapist',
        // [FIX] Corrected 'kid' to 'kids'
        display_mode: formData.display_mode as 'adult' | 'kids',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData) // Using upsert is safer: it updates if exists, inserts if not.
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      console.log('Profile updated successfully:', data);
      setProfile(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // The useEffect for formData.display_mode will handle applying the theme
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDisplayModeToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      // [FIX] Corrected 'kid' to 'kids'
      display_mode: checked ? 'kids' : 'adult'
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Unable to load user data. Redirecting to login.</p>
        </div>
      </div>
    );
  }

  const isKidsMode = formData.display_mode === 'kids';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${!isKidsMode ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:to-purple-900/50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className={`hover:bg-primary/10 transition-colors ${isKidsMode ? 'button' : ''}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className={`text-3xl font-bold text-foreground ${isKidsMode ? 'wiggle' : ''}`}>
              {isKidsMode ? 'My Awesome Settings! ✨' : 'Profile Settings'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isKidsMode ? 'Make your profile super cool!' : 'Customize your profile and display preferences'}
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          } ${isKidsMode ? 'bounce-in' : ''}`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                message.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className={`bg-muted ${isKidsMode ? 'form-input' : ''}`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed from this page
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className={isKidsMode ? 'form-input' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_role">User Role</Label>
                  <select
                    id="user_role"
                    value={formData.user_role}
                    onChange={(e) => handleInputChange('user_role', e.target.value)}
                    className={`w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${isKidsMode ? 'form-input' : ''}`}
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="therapist">Therapist</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Display Mode Settings */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Display Mode
                </CardTitle>
                <CardDescription>
                  Choose between Adult Mode and Kids Mode for a personalized experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                      {isKidsMode ? (
                        <Baby className="h-6 w-6 text-purple-600" />
                      ) : (
                        <Briefcase className="h-6 w-6 text-slate-600" />
                      )}
                      <div>
                        <h3 className="font-semibold">
                          {isKidsMode ? 'Kids Mode' : 'Adult Mode'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isKidsMode
                            ? 'Fun, colorful interface with playful animations!'
                            : 'Professional, clean interface for focused work.'
                          }
                        </p>
                      </div>
                  </div>
                  <Switch
                    checked={isKidsMode}
                    onCheckedChange={handleDisplayModeToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Button */}
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card' : ''}`}>
              <CardContent className="pt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className={`w-full h-12 text-lg font-semibold ${isKidsMode ? 'button big-button' : ''}`}
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Changes will be applied across the app.
                </p>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className={`border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 ${isKidsMode ? 'card' : ''}`}>
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    <strong>Display Mode:</strong> Toggling this changes the look and feel of the entire app.
                  </p>
                  <p>
                    <strong>Kids Mode</strong> uses bright colors, fun fonts, and playful animations.
                  </p>
                   <p>
                    <strong>Adult Mode</strong> has a professional, clean design for a more focused experience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}