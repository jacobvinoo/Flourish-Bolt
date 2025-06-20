'use client';

import { useEffect, useState } from 'react';
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
  const [formData, setFormData] = useState({
    full_name: '',
    user_role: 'student',
    display_mode: 'adult'
  });
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          setMessage({ type: 'error', text: 'Authentication error. Please try logging in again.' });
          setTimeout(() => router.push('/login'), 2000);
          return;
        }
        
        if (!user) {
          console.log('No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('User found:', user.id);
        setUser(user);
        await fetchProfile(user.id);
      } catch (err) {
        console.error('Error getting user:', err);
        setMessage({ type: 'error', text: 'Failed to load user data' });
      }
    };

    getUser();
  }, [supabase.auth, router]);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile');
          await createDefaultProfile(userId);
        } else {
          setMessage({ type: 'error', text: 'Failed to load profile data' });
        }
      } else {
        console.log('Profile loaded:', data);
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          user_role: data.user_role || 'student',
          display_mode: data.display_mode || 'adult'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      const defaultProfile: TablesInsert<'profiles'> = {
        id: userId,
        full_name: user?.user_metadata?.full_name || '',
        user_role: 'student',
        display_mode: 'adult',
        updated_at: new Date().toISOString()
      };

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        setMessage({ type: 'error', text: 'Failed to create profile' });
      } else {
        console.log('Profile created:', newProfile);
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || '',
          user_role: newProfile.user_role || 'student',
          display_mode: newProfile.display_mode || 'adult'
        });
        setMessage({ type: 'success', text: 'Profile created successfully!' });
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
      setMessage({ type: 'error', text: 'Failed to create default profile' });
    }
  };

  const handleSave = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'No user found' });
      return;
    }

    // Clear any existing messages
    setMessage(null);
    setSaving(true);

    try {
      console.log('Saving profile data:', formData);
      
      const updateData: TablesUpdate<'profiles'> = {
        full_name: formData.full_name,
        user_role: formData.user_role as 'student' | 'parent' | 'therapist',
        display_mode: formData.display_mode as 'adult' | 'kid',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found during update, creating new profile');
          const insertData: TablesInsert<'profiles'> = {
            id: user.id,
            ...updateData
          };
          
          const { data: newData, error: insertError } = await supabase
            .from('profiles')
            .insert(insertData)
            .select()
            .single();
            
          if (insertError) {
            throw new Error(`Failed to create profile: ${insertError.message}`);
          }
          
          setProfile(newData);
          setMessage({ type: 'success', text: 'Profile created and updated successfully!' });
        } else {
          throw new Error(error.message);
        }
      } else {
        console.log('Profile updated successfully:', data);
        setProfile(data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }

      // Apply theme change immediately if display mode changed
      if (profile?.display_mode !== formData.display_mode) {
        applyThemeChange(formData.display_mode as 'adult' | 'kid');
      }

    } catch (error: any) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const applyThemeChange = (newDisplayMode: 'adult' | 'kid') => {
    console.log('Applying theme change to:', newDisplayMode);
    
    // Remove existing theme classes
    document.body.classList.remove('adult-mode', 'kids-mode');
    
    // Add new theme class
    document.body.classList.add(`${newDisplayMode === 'adult' ? 'adult' : 'kids'}-mode`);
    
    // Remove existing theme stylesheets
    const existingAdultCSS = document.getElementById('adult-theme-css');
    const existingKidsCSS = document.getElementById('kids-theme-css');
    
    if (existingAdultCSS) existingAdultCSS.remove();
    if (existingKidsCSS) existingKidsCSS.remove();

    // Create and append the appropriate stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.id = newDisplayMode === 'adult' ? 'adult-theme-css' : 'kids-theme-css';
    link.href = newDisplayMode === 'adult' ? '/globals-adult.css' : '/globals-kids.css';
    
    link.onload = () => {
      console.log(`${newDisplayMode} theme CSS loaded successfully`);
      setMessage({ 
        type: 'success', 
        text: `Theme changed to ${newDisplayMode === 'kid' ? 'Kids' : 'Adult'} mode! 🎉` 
      });
    };
    
    link.onerror = () => {
      console.error(`Failed to load ${newDisplayMode} theme CSS`);
      setMessage({ type: 'error', text: 'Failed to apply theme changes' });
    };
    
    document.head.appendChild(link);

    // Trigger storage event for other tabs
    localStorage.setItem('display_mode_changed', Date.now().toString());
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear any error messages when user starts typing
    if (message?.type === 'error') {
      setMessage(null);
    }
  };

  const handleDisplayModeToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      display_mode: checked ? 'kid' : 'adult'
    }));
    
    // Clear any error messages when user changes settings
    if (message?.type === 'error') {
      setMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
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
          <p className="text-muted-foreground">Unable to load user data. Please try logging in again.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Customize your profile and display preferences
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessage(null)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-lg">
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
                    className="bg-muted"
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_role">User Role</Label>
                  <select
                    id="user_role"
                    value={formData.user_role}
                    onChange={(e) => handleInputChange('user_role', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="therapist">Therapist</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Your role determines available features and permissions
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Display Mode Settings */}
            <Card className="border-0 shadow-lg">
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
                    <div className="flex items-center gap-2">
                      {formData.display_mode === 'adult' ? (
                        <Briefcase className="h-6 w-6 text-slate-600" />
                      ) : (
                        <Baby className="h-6 w-6 text-purple-600" />
                      )}
                      <div>
                        <h3 className="font-semibold">
                          {formData.display_mode === 'adult' ? 'Adult Mode' : 'Kids Mode'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formData.display_mode === 'adult' 
                            ? 'Professional, clean interface with sophisticated styling'
                            : 'Fun, colorful interface with playful animations and kid-friendly design'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.display_mode === 'kid'}
                    onCheckedChange={handleDisplayModeToggle}
                  />
                </div>

                {/* Mode Preview */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.display_mode === 'adult' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-muted/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-5 w-5 text-slate-600" />
                      <h4 className="font-semibold">Adult Mode</h4>
                      {formData.display_mode === 'adult' && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Clean, professional design</li>
                      <li>• Subtle animations</li>
                      <li>• Business-focused typography</li>
                      <li>• Sophisticated color palette</li>
                    </ul>
                  </div>

                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.display_mode === 'kid' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-muted/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Baby className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold">Kids Mode</h4>
                      {formData.display_mode === 'kid' && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Bright, colorful design</li>
                      <li>• Fun animations & effects</li>
                      <li>• Kid-friendly fonts</li>
                      <li>• Playful interactions</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Theme Changes Apply Instantly
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        When you save your settings, the new theme will be applied immediately without needing to reload the page!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Settings Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Current Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">
                      {formData.full_name || 'Not set'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Role</span>
                    <Badge variant="secondary" className="capitalize">
                      {formData.user_role}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Display Mode</span>
                    <Badge 
                      variant={formData.display_mode === 'kid' ? 'default' : 'outline'}
                      className="capitalize"
                    >
                      {formData.display_mode === 'kid' ? (
                        <>
                          <Baby className="h-3 w-3 mr-1" />
                          Kids Mode
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-3 w-3 mr-1" />
                          Adult Mode
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                    <span className="text-sm font-medium">
                      {profile?.updated_at 
                        ? new Date(profile.updated_at).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Changes will be applied immediately after saving
                </p>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    <strong>Display Mode:</strong> Kids Mode features bright colors, fun fonts, and playful animations. Adult Mode has a professional, clean design.
                  </p>
                  <p>
                    <strong>User Role:</strong> Your role affects which features are available to you in the application.
                  </p>
                  <p>
                    <strong>Theme Changes:</strong> The new theme will be applied instantly when you save your settings!
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