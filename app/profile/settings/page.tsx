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
import { Database, Tables } from '@/lib/database.types';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Palette, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Baby,
  Briefcase,
  Settings
} from 'lucide-react';
import Link from 'next/link';

type Profile = Tables<'profiles'>;
type UserRole = 'student' | 'parent' | 'therapist';
type DisplayMode = 'adult' | 'kids';

interface FormData {
  full_name: string;
  user_role: UserRole;
  display_mode: DisplayMode;
  avatar_url: string | null;
}

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Form state - separate from profile state for better control
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    user_role: 'student',
    display_mode: 'adult',
    avatar_url: null
  });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Debug logging function
  const addDebugInfo = (info: string) => {
    console.log('DEBUG:', info);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const applyTheme = useCallback((theme: 'adult' | 'kids' | null) => {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('adult-mode', 'kids-mode');
      if (theme) {
        document.body.classList.add(`${theme}-mode`);
      }
    }
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // Apply theme when display mode changes
  useEffect(() => {
    applyTheme(formData.display_mode);
  }, [formData.display_mode, applyTheme]);

  // Helper function to safely cast user role
  const getUserRole = (role: string | null | undefined): UserRole => {
    if (role === 'parent' || role === 'therapist') {
      return role;
    }
    return 'student';
  };

  // Helper function to safely cast display mode
  const getDisplayMode = (mode: string | null | undefined): DisplayMode => {
    if (mode === 'kids') {
      return 'kids';
    }
    return 'adult';
  };

  // Fetch or create profile
  const fetchOrCreateProfile = useCallback(async (user: User) => {
    try {
      addDebugInfo(`Starting profile fetch for user: ${user.id}`);
      
      // First try to fetch existing profile
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows gracefully

      addDebugInfo(`Profile fetch result: ${fetchError ? 'ERROR' : 'SUCCESS'}`);
      
      if (fetchError) {
        addDebugInfo(`Fetch error: ${fetchError.message}`);
        throw fetchError;
      }

      // If profile doesn't exist, create one
      if (!profileData) {
        addDebugInfo('No profile found, creating new profile');
        
        const newProfileData = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          user_role: 'student',
          display_mode: 'adult'
        };
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();
        
        if (createError) {
          addDebugInfo(`Create error: ${createError.message}`);
          throw createError;
        }
        
        addDebugInfo('New profile created successfully');
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || '',
          user_role: getUserRole(newProfile.user_role),
          display_mode: getDisplayMode(newProfile.display_mode),
          avatar_url: newProfile.avatar_url || null,
        });
      } else {
        addDebugInfo('Profile loaded successfully');
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          user_role: getUserRole(profileData.user_role),
          display_mode: getDisplayMode(profileData.display_mode),
          avatar_url: profileData.avatar_url || null,
        });
      }
    } catch (error: any) {
      addDebugInfo(`Profile operation failed: ${error.message}`);
      console.error("Error in fetchOrCreateProfile:", error);
      setMessage({ type: 'error', text: `Failed to load profile: ${error.message}` });
    }
  }, [supabase]);

  // Main effect to get user and profile
  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        addDebugInfo('Starting user authentication check');
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          addDebugInfo(`Auth error: ${authError.message}`);
          console.error('Auth error:', authError);
          setMessage({ type: 'error', text: `Authentication failed: ${authError.message}` });
          return;
        }
        
        if (!user) {
          addDebugInfo('No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        addDebugInfo(`User authenticated: ${user.email}`);
        setUser(user);
        await fetchOrCreateProfile(user);

      } catch (error: any) {
        addDebugInfo(`Unexpected error: ${error.message}`);
        console.error("An unexpected error occurred while loading the page:", error);
        setMessage({ type: 'error', text: `An unexpected error occurred: ${error.message}` });
      } finally {
        addDebugInfo('Loading complete');
        setLoading(false);
      }
    };
    
    getUserAndProfile();

    // Cleanup theme on unmount
    return () => applyTheme(null);
  }, [supabase, router, fetchOrCreateProfile, applyTheme]);

  // Save profile changes
  const handleSave = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'User not found. Please log in again.' });
      return;
    }

    addDebugInfo('Starting profile save');
    setMessage(null);
    setSaving(true);

    try {
      const updateData = {
        id: user.id,
        full_name: formData.full_name.trim(),
        user_role: formData.user_role,
        display_mode: formData.display_mode,
        avatar_url: formData.avatar_url,
        updated_at: new Date().toISOString()
      };

      addDebugInfo(`Saving profile data: ${JSON.stringify(updateData)}`);

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) {
        addDebugInfo(`Save error: ${error.message}`);
        console.error('Error saving profile:', error);
        throw error;
      }
      
      addDebugInfo('Profile saved successfully');
      setProfile(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
    } catch (error: any) {
      addDebugInfo(`Save failed: ${error.message}`);
      console.error('Error saving profile:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to update profile: ${error.message}. Please check your database connection and table schema.` 
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string | null) => {
    if (field === 'user_role' && value) {
      setFormData(prev => ({ ...prev, [field]: getUserRole(value) }));
    } else if (field === 'display_mode' && value) {
      setFormData(prev => ({ ...prev, [field]: getDisplayMode(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Handle display mode toggle
  const handleDisplayModeToggle = (checked: boolean) => {
    const newMode: DisplayMode = checked ? 'kids' : 'adult';
    setFormData(prev => ({
      ...prev,
      display_mode: newMode
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Loading profile settings...</p>
          {/* Debug information */}
          <div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs space-y-1">
            <div className="font-semibold mb-2">Debug Log:</div>
            {debugInfo.map((info, index) => (
              <div key={index} className="text-gray-600 dark:text-gray-400">{info}</div>
            ))}
          </div>
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

        {/* Debug Panel (only show if there are debug messages) */}
        {debugInfo.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800 dark:text-blue-200">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                {debugInfo.map((info, index) => (
                  <div key={index}>{info}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                    value={user?.email || ''}
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
                    value={formData.full_name}
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
            <Card className={`border-0 shadow-lg ${isKidsMode ? 'card' : ''}`}>
              <CardContent className="pt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving || loading}
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