'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/database.types';
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle, PenTool, Crown, Check } from 'lucide-react';
import Link from 'next/link';

// Add animations styles
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(-5px) rotate(-1deg); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(2deg); }
  }
  
  @keyframes float-delay {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-8px) rotate(-1deg); }
    66% { transform: translateY(-12px) rotate(1deg); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes twinkle-delay {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
  .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
  .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
  .animate-twinkle-delay { animation: twinkle-delay 4s ease-in-out infinite; }
  .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-spin-reverse { animation: spin-reverse 25s linear infinite; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    features: ['7-day free trial', '5 analyses included', 'Basic feedback', 'Progress tracking'],
    popular: false,
    trial: true
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    features: ['10 analyses per month', 'Basic feedback', 'Progress tracking', 'Standard worksheets'],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    features: ['Unlimited analyses', 'Advanced AI feedback', 'Custom exercises', 'Multiple students', 'Detailed reports'],
    popular: true
  },
  {
    id: 'educator',
    name: 'Educator',
    price: 49.99,
    features: ['Everything in Pro', 'Classroom management', 'Bulk student accounts', 'Educational reports', 'Priority support'],
    popular: false
  }
];

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Plan selection, 2: Account creation
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  // Updated handleSignUp function for your signup page

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  // Validate passwords match
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  // Validate password strength
  const passwordError = validatePassword(password);
  if (passwordError) {
    setError(passwordError);
    setLoading(false);
    return;
  }

  try {
    // Step 1: Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          selected_plan: selectedPlan,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Step 2: If user is created and confirmed, update their profile
      if (data.user.email_confirmed_at) {
        // User is immediately confirmed
        // Update the profile with the selected plan
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            selected_plan: selectedPlan,
            subscription_status: 'active',
            trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // User needs to confirm email
        setSuccess(`Account created successfully! Please check your email for a confirmation link. Your ${plans.find(p => p.id === selectedPlan)?.name} plan will be activated after confirmation.`);
      }
    }
  } catch (err) {
    setError('An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?plan=${selectedPlan}`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-all duration-500 relative overflow-hidden bg-gray-50">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left Wavy Edge */}
        <div className="absolute left-0 top-0 h-full w-80 opacity-70">
          <svg viewBox="0 0 200 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="leftWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            <path 
              d="M0,0 L0,800 L120,800 Q160,720 120,640 Q80,560 120,480 Q160,400 120,320 Q80,240 120,160 Q160,80 120,0 Z" 
              fill="url(#leftWave)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values="0,0; 0,-8; 0,0; 0,4; 0,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Right Wavy Edge */}
        <div className="absolute right-0 top-0 h-full w-80 opacity-70">
          <svg viewBox="0 0 200 800" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rightWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path 
              d="M200,0 L200,800 L80,800 Q40,720 80,640 Q120,560 80,480 Q40,400 80,320 Q120,240 80,160 Q40,80 80,0 Z" 
              fill="url(#rightWave)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values="0,0; 0,6; 0,0; 0,-4; 0,0"
                dur="7s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Floating Educational Elements - Moved to Far Edges Only */}
        {/* Far Left Edge */}
        <div className="absolute top-16 left-8 w-20 h-20 animate-float z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 drop-shadow-lg">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
        </div>

        <div className="absolute top-1/4 left-4 w-16 h-16 animate-float-delay z-10">
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            S
          </div>
        </div>

        <div className="absolute top-1/2 left-8 w-12 h-12 bg-cyan-500 rounded-full animate-float flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">G</div>

        <div className="absolute top-3/4 left-4 w-14 h-14 animate-bounce-slow z-10">
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            P
          </div>
        </div>

        <div className="absolute bottom-20 left-8 w-14 h-14 animate-twinkle z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500 drop-shadow-lg">
            <path fill="currentColor" d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z" />
          </svg>
        </div>

        <div className="absolute bottom-1/3 left-12 w-12 h-12 bg-violet-500 rounded-full animate-twinkle flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">U</div>

        <div className="absolute bottom-8 left-4 w-8 h-8 bg-pink-500 rounded-full animate-twinkle shadow-xl z-10"></div>

        {/* Far Right Edge */}
        <div className="absolute top-20 right-8 w-12 h-12 animate-twinkle z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-500 drop-shadow-lg">
            <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>

        <div className="absolute top-1/4 right-4 w-16 h-16 animate-float z-10">
          <div className="w-full h-full bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
            I
          </div>
        </div>

        <div className="absolute top-1/3 right-8 w-14 h-14 animate-twinkle z-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            N
          </div>
        </div>

        <div className="absolute top-2/3 right-4 w-16 h-16 animate-float-slow z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-purple-500 drop-shadow-lg">
            <path fill="currentColor" d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,21.1 22.25,21.81C22.35,21.86 22.4,21.91 22.5,21.91C22.75,21.91 23,21.66 23,21.41V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,19.81V6.5C10.55,5.4 8.45,5 6.5,5Z" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 right-8 w-12 h-12 bg-violet-500 rounded-full animate-twinkle flex items-center justify-center text-white font-bold text-xl shadow-xl z-10">O</div>

        <div className="absolute bottom-20 right-4 w-8 h-8 bg-lime-500 rounded-full animate-bounce-slow shadow-xl z-10"></div>

        <div className="absolute bottom-8 right-8 w-10 h-10 bg-orange-500 transform rotate-45 animate-float-delay shadow-xl z-10"></div>

        {/* Top Corners Only */}
        <div className="absolute top-8 left-1/4 w-14 h-14 animate-float-delay z-10">
          <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
            T
          </div>
        </div>

        <div className="absolute top-12 right-1/4 w-12 h-12 animate-bounce-slow z-10">
          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            R
          </div>
        </div>

        {/* Bottom Corners Only */}
        <div className="absolute bottom-12 left-1/4 w-10 h-10 animate-twinkle z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-pink-400 drop-shadow-lg">
            <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>

        <div className="absolute bottom-16 right-1/4 w-8 h-8 animate-float z-10">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-400 drop-shadow-lg">
            <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>

        {/* Very edge tiny elements */}
        <div className="absolute top-1/2 left-0 w-6 h-6 bg-blue-400 rounded-full animate-twinkle shadow-xl z-10 ml-2"></div>
        <div className="absolute top-1/2 right-0 w-6 h-6 bg-green-400 rounded-full animate-float shadow-xl z-10 mr-2"></div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-600">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Flourish
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 relative z-10" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-full max-w-4xl">
          {step === 1 ? (
            /* Plan Selection Step */
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Choose Your Plan
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Select the perfect plan to start your handwriting journey
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-lg bg-white/95 backdrop-blur-sm ${
                      selectedPlan === plan.id 
                        ? 'border-green-500 ring-2 ring-green-500 ring-offset-2' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${plan.popular ? 'scale-105' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      {plan.popular && (
                        <Badge className="mb-2 bg-green-600">Most Popular</Badge>
                      )}
                      {plan.trial && (
                        <Badge className="mb-2 bg-blue-600">Free Trial</Badge>
                      )}
                      <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Free' : `${plan.price}`}
                        {plan.price > 0 && <span className="text-sm text-gray-500">/month</span>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Continue with {plans.find(p => p.id === selectedPlan)?.name} Plan
              </Button>
            </div>
          ) : (
            /* Account Creation Step */
            <div className="max-w-md mx-auto">
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-lg text-gray-600">
                  Start your handwriting journey with the {plans.find(p => p.id === selectedPlan)?.name} plan
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                  <Crown className="h-4 w-4 text-green-600" />
                  <span className="text-green-800 font-medium">{plans.find(p => p.id === selectedPlan)?.name} Plan Selected</span>
                </div>
              </div>

              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">Sign Up</CardTitle>
                  <CardDescription className="text-gray-600">
                    Create your account to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  )}

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        disabled={loading}
                        className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                        className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                          disabled={loading}
                          className="border-gray-200 focus:border-green-400 focus:ring-green-400 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          required
                          disabled={loading}
                          className="border-gray-200 focus:border-green-400 focus:ring-green-400 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={loading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-200" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        `Create Account & Start ${plans.find(p => p.id === selectedPlan)?.name} Plan`
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium py-3"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    Continue with Google
                  </Button>

                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      ← Change Plan
                    </button>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link 
                          href="/login" 
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-sm mb-2 text-green-900">Plan Summary:</h4>
                    <div className="text-xs space-y-1 text-green-800">
                      <p><strong>{plans.find(p => p.id === selectedPlan)?.name} Plan</strong> 
                        {selectedPlan === 'free' ? ' - Free Trial' : ` - ${plans.find(p => p.id === selectedPlan)?.price}/month`}
                      </p>
                      {selectedPlan === 'free' ? (
                        <>
                          <p>✓ 7 days completely free</p>
                          <p>✓ No credit card required</p>
                          <p>✓ Upgrade anytime</p>
                        </>
                      ) : (
                        <>
                          <p>✓ 7-day free trial included</p>
                          <p>✓ Cancel anytime</p>
                          <p>✓ No setup fees</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}