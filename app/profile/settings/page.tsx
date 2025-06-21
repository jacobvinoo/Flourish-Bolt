'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Palette, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Baby,
  Briefcase,
  Settings
} from 'lucide-react';
import { Database, Tables } from '@/lib/database.types';

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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    user_role: 'student',
    display_mode: 'adult',
    avatar_url: null
  });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
        await fetchProfile(user.id);
      } catch (error: any) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          user_role: getUserRole(data.user_role),
          display_mode: getDisplayMode(data.display_mode),
          avatar_url: data.avatar_url
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

  // Save profile changes
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          user_role: formData.user_role,
          display_mode: formData.display_mode,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <Loader2 className="h-16 w-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isKidsMode = formData.display_mode === 'kids';

  return (
    <div className={`min-h-screen ${
      isKidsMode 
        ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50' 
        : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
              isKidsMode 
                ? 'text-purple-700 hover:bg-purple-100 border border-purple-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <ArrowLeft className="h-4 w-4" />
              {isKidsMode ? '🏠 Back Home' : 'Back to Dashboard'}
            </button>
          </Link>
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${
              isKidsMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'text-gray-900'
            }`}>
              {isKidsMode ? '⚙️ My Settings!' : 'Profile Settings'}
            </h1>
            <p className={`mt-1 ${
              isKidsMode ? 'text-purple-700' : 'text-gray-600'
            }`}>
              {isKidsMode 
                ? 'Make your account just the way you like it! ✨' 
                : 'Customize your profile and display preferences'
              }
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
            message.type === 'success' 
              ? isKidsMode 
                ? 'bg-green-100 border-green-300' 
                : 'bg-green-50 border-green-200'
              : isKidsMode 
                ? 'bg-red-100 border-red-300' 
                : 'bg-red-50 border-red-200'
          }`}>
            {message.type === 'success' ? (
              <div className={`p-2 rounded-xl ${
                isKidsMode ? 'bg-green-500' : 'bg-green-500'
              }`}>
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div className={`p-2 rounded-xl ${
                isKidsMode ? 'bg-red-500' : 'bg-red-500'
              }`}>
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                message.type === 'success' 
                  ? isKidsMode ? 'text-green-800' : 'text-green-800'
                  : isKidsMode ? 'text-red-800' : 'text-red-800'
              }`}>
                {isKidsMode && message.type === 'success' ? '🎉 ' : ''}
                {message.text}
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-2xl border p-6 ${
              isKidsMode 
                ? 'bg-white border-purple-200 shadow-lg' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${
                  isKidsMode ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${
                    isKidsMode ? 'text-purple-800' : 'text-gray-900'
                  }`}>
                    {isKidsMode ? '👤 About Me!' : 'Basic Information'}
                  </h2>
                  <p className={`text-sm ${
                    isKidsMode ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {isKidsMode 
                      ? 'Tell us about yourself!' 
                      : 'Update your personal information and account details'
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    isKidsMode ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {isKidsMode ? '📧 Email Address' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className={`w-full px-3 py-2 border rounded-xl ${
                      isKidsMode 
                        ? 'bg-purple-50 border-purple-200 text-purple-600' 
                        : 'bg-gray-100 border-gray-200 text-gray-500'
                    }`}
                  />
                  <p className={`text-xs ${
                    isKidsMode ? 'text-purple-500' : 'text-gray-500'
                  }`}>
                    {isKidsMode 
                      ? 'Your email address is safe with us! 🔒' 
                      : 'Email address cannot be changed from this page'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    isKidsMode ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {isKidsMode ? '🏷️ My Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder={isKidsMode ? 'What should we call you?' : 'Enter your full name'}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      isKidsMode 
                        ? 'border-purple-200 focus:ring-purple-500' 
                        : 'border-gray-200 focus:ring-green-500'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    isKidsMode ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {isKidsMode ? '👥 I am a...' : 'User Role'}
                  </label>
                  <select
                    value={formData.user_role}
                    onChange={(e) => handleInputChange('user_role', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      isKidsMode 
                        ? 'border-purple-200 focus:ring-purple-500' 
                        : 'border-gray-200 focus:ring-green-500'
                    }`}
                  >
                    <option value="student">{isKidsMode ? '🎓 Student (that\'s me!)' : 'Student'}</option>
                    <option value="parent">{isKidsMode ? '👨‍👩‍👧‍👦 Parent/Guardian' : 'Parent'}</option>
                    <option value="therapist">{isKidsMode ? '👩‍⚕️ Therapist/Teacher' : 'Therapist'}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border p-6 ${
              isKidsMode 
                ? 'bg-white border-pink-200 shadow-lg' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${
                  isKidsMode ? 'bg-pink-500' : 'bg-purple-500'
                }`}>
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${
                    isKidsMode ? 'text-pink-800' : 'text-gray-900'
                  }`}>
                    {isKidsMode ? '🎨 Fun Mode!' : 'Display Mode'}
                  </h2>
                  <p className={`text-sm ${
                    isKidsMode ? 'text-pink-600' : 'text-gray-600'
                  }`}>
                    {isKidsMode 
                      ? 'Choose how colorful and fun you want the app to be!' 
                      : 'Choose between Adult Mode and Kids Mode for a personalized experience'
                    }
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-4 border rounded-xl ${
                isKidsMode ? 'border-pink-200' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    isKidsMode ? 'bg-gradient-to-br from-pink-400 to-purple-500' : 'bg-gray-500'
                  }`}>
                    {isKidsMode ? (
                      <Baby className="h-6 w-6 text-white" />
                    ) : (
                      <Briefcase className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold ${
                      isKidsMode ? 'text-pink-800' : 'text-gray-900'
                    }`}>
                      {isKidsMode ? '🌈 Kids Mode - So Fun!' : 'Adult Mode'}
                    </h3>
                    <p className={`text-sm ${
                      isKidsMode ? 'text-pink-600' : 'text-gray-600'
                    }`}>
                      {isKidsMode
                        ? 'Bright colors, fun animations, and lots of encouragement! 🎉'
                        : 'Professional, clean interface for focused work.'
                      }
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isKidsMode}
                    onChange={(e) => handleDisplayModeToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-12 h-6 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                    isKidsMode 
                      ? 'bg-pink-500 peer-focus:ring-pink-500' 
                      : 'bg-gray-200 peer-focus:ring-green-500 peer-checked:bg-green-500'
                  } peer-focus:outline-none peer-focus:ring-2`}></div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className={`rounded-2xl border p-6 ${
              isKidsMode 
                ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-200' 
                : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className={`w-full px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-lg ${
                  isKidsMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isKidsMode ? '💾 Saving...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {isKidsMode ? '💾 Save My Settings!' : 'Save Settings'}
                  </>
                )}
              </button>
              
              <p className={`text-xs text-center mt-3 ${
                isKidsMode ? 'text-green-700' : 'text-gray-500'
              }`}>
                {isKidsMode 
                  ? 'Your changes will make the whole app more fun! 🎉' 
                  : 'Changes will be applied across the app.'
                }
              </p>
            </div>

            <div className={`border rounded-2xl p-6 ${
              isKidsMode 
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-xl ${
                  isKidsMode ? 'bg-yellow-400' : 'bg-yellow-500'
                }`}>
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <h3 className={`font-bold ${
                  isKidsMode ? 'text-yellow-800' : 'text-yellow-800'
                }`}>
                  {isKidsMode ? '❓ Need Help?' : 'Need Help?'}
                </h3>
              </div>
              <div className={`space-y-3 text-sm ${
                isKidsMode ? 'text-yellow-700' : 'text-yellow-700'
              }`}>
                <p>
                  <strong>{isKidsMode ? '🎨 Fun Mode:' : 'Display Mode:'}</strong>{' '}
                  {isKidsMode 
                    ? 'This switch changes how colorful and playful everything looks!'
                    : 'Toggling this changes the look and feel of the entire app.'
                  }
                </p>
                <p>
                  <strong>{isKidsMode ? '🌈 Kids Mode' : 'Kids Mode'}</strong>{' '}
                  {isKidsMode 
                    ? 'has bright colors, fun pictures, and encouraging messages!'
                    : 'uses bright colors, fun fonts, and playful animations.'
                  }
                </p>
                <p>
                  <strong>{isKidsMode ? '💼 Adult Mode' : 'Adult Mode'}</strong>{' '}
                  {isKidsMode 
                    ? 'looks more grown-up and professional.'
                    : 'has a professional, clean design for a more focused experience.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}