'use client';

import { useEffect, useState, useCallback } from 'react';
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

type UserRole = 'student' | 'parent' | 'therapist';
type DisplayMode = 'adult' | 'kids';

interface FormData {
  full_name: string;
  user_role: UserRole;
  display_mode: DisplayMode;
  avatar_url: string | null;
}

export default function ProfileSettingsPage() {
  const [user] = useState({ email: 'alex.chen@example.com', id: '123' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    full_name: 'Alex Chen',
    user_role: 'student',
    display_mode: 'adult',
    avatar_url: null
  });

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
    setSaving(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }, 1500);
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

  const isKidsMode = formData.display_mode === 'kids';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Customize your profile and display preferences
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            {message.type === 'success' ? (
              <div className="p-2 rounded-xl bg-green-500">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-red-500">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                message.type === 'success' 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-blue-500">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600 text-sm">Update your personal information and account details</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
                  />
                  <p className="text-xs text-gray-500">
                    Email address cannot be changed from this page
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">User Role</label>
                  <select
                    value={formData.user_role}
                    onChange={(e) => handleInputChange('user_role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="therapist">Therapist</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-purple-500">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Display Mode</h2>
                  <p className="text-gray-600 text-sm">Choose between Adult Mode and Kids Mode for a personalized experience</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isKidsMode ? 'bg-pink-500' : 'bg-gray-500'}`}>
                    {isKidsMode ? (
                      <Baby className="h-6 w-6 text-white" />
                    ) : (
                      <Briefcase className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {isKidsMode ? 'Kids Mode' : 'Adult Mode'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isKidsMode
                        ? 'Fun, colorful interface with playful animations!'
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
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Settings
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Changes will be applied across the app.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-yellow-500">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-yellow-800">Need Help?</h3>
              </div>
              <div className="space-y-3 text-sm text-yellow-700">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}