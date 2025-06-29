'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/database.types';
import { revenueCat, PurchasesOffering, PurchasesPackage } from '@/lib/revenuecat';
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  Users, 
  BarChart3, 
  Shield, 
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  package?: PurchasesPackage;
}

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revenueCatReady, setRevenueCatReady] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Default pricing tiers (fallback when RevenueCat is not available)
  const defaultTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for individual students getting started',
      price: '$9.99',
      period: 'month',
      features: [
        '10 handwriting analyses per month',
        'Basic feedback and scoring',
        'Progress tracking',
        'Standard exercises library',
        'Email support'
      ],
      icon: <Star className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for serious learners and parents',
      price: '$19.99',
      period: 'month',
      features: [
        'Unlimited handwriting analyses',
        'Advanced AI feedback with detailed insights',
        'Custom exercise creation',
        'Progress reports and analytics',
        'Priority support',
        'Multiple student profiles',
        'Export capabilities'
      ],
      popular: true,
      icon: <Crown className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'therapist',
      name: 'Therapist',
      description: 'Professional tools for occupational therapists',
      price: '$49.99',
      period: 'month',
      features: [
        'Everything in Pro',
        'Unlimited student accounts',
        'Professional assessment tools',
        'Detailed clinical reports',
        'HIPAA compliance',
        'White-label options',
        'API access',
        'Dedicated account manager'
      ],
      icon: <Users className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(defaultTiers);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        await revenueCat.initialize(user?.id);
        if (revenueCat.isInitialized()) {
          setRevenueCatReady(true);
          await fetchOfferings();
        } else {
          console.log('RevenueCat not initialized, using default pricing');
          setRevenueCatReady(false);
        }
      } catch (error: any) {
        console.error('RevenueCat initialization failed:', error);
        setError('Unable to load subscription options. Using default pricing.');
        setRevenueCatReady(false);
      }
    };

    if (user) {
      initializeRevenueCat();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOfferings = async () => {
    try {
      const currentOffer = await revenueCat.getCurrentOffering();
      const allOfferings = await revenueCat.getOfferings();
      
      setCurrentOffering(currentOffer);
      setOfferings(allOfferings);

      // Map RevenueCat packages to our pricing tiers
      if (currentOffer && currentOffer.availablePackages.length > 0) {
        const mappedTiers = currentOffer.availablePackages.map((pkg, index) => {
          const defaultTier = defaultTiers[index] || defaultTiers[0];
          return {
            ...defaultTier,
            id: pkg.identifier,
            price: pkg.product.priceString,
            period: pkg.packageType.includes('MONTHLY') ? 'month' : 
                   pkg.packageType.includes('ANNUAL') ? 'year' : 'month',
            package: pkg
          };
        });
        setPricingTiers(mappedTiers);
      }
    } catch (error: any) {
      console.error('Failed to fetch offerings:', error);
      setError('Failed to load subscription options');
    }
  };

  const handlePurchase = async (tier: PricingTier) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!tier.package) {
      setError('Subscription not available. Please contact support.');
      return;
    }

    setPurchaseLoading(tier.id);
    setError(null);

    try {
      const purchaseResult = await revenueCat.purchasePackage(tier.package);
      
      // Handle successful purchase
      console.log('Purchase successful:', purchaseResult);
      
      // You might want to update the user's subscription status in your database here
      // and redirect to a success page
      router.push('/dashboard?subscription=success');
      
    } catch (error: any) {
      console.error('Purchase failed:', error);
      setError(error.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleRestorePurchases = async () => {
    if (!revenueCatReady) return;

    setLoading(true);
    try {
      await revenueCat.restorePurchases();
      // Refresh offerings after restore
      await fetchOfferings();
    } catch (error: any) {
      console.error('Failed to restore purchases:', error);
      setError('Failed to restore purchases');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if button should be disabled
  const isButtonDisabled = (tier: PricingTier): boolean => {
    return !user || 
           purchaseLoading === tier.id || 
           (!revenueCatReady && !!tier.package);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pricing options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="h-12 w-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Unlock the full potential of AI-powered handwriting analysis. Choose the plan that fits your needs and start improving today.
          </p>
          
          {error && (
            <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 max-w-md mx-auto">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-amber-800 dark:text-amber-200 text-sm">{error}</p>
            </div>
          )}

          {!user && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <Link href="/login" className="font-medium hover:underline">Sign in</Link> to subscribe and unlock premium features
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              30-day money-back guarantee
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Cancel anytime
            </Badge>
            {!revenueCatReady && (
              <Badge variant="outline" className="px-4 py-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                Demo pricing shown
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                tier.popular 
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white`}>
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {tier.description}
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">/{tier.period}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePurchase(tier)}
                  disabled={isButtonDisabled(tier)}
                  className={`w-full h-12 text-lg font-semibold ${
                    tier.popular
                      ? `bg-gradient-to-r ${tier.color} hover:opacity-90 shadow-lg hover:shadow-xl`
                      : ''
                  } transition-all duration-300`}
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  {purchaseLoading === tier.id ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : !user ? (
                    <>
                      Sign In to Subscribe
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : !revenueCatReady ? (
                    <>
                      Contact Sales
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Subscribe to {tier.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                {tier.popular && (
                  <p className="text-center text-xs text-muted-foreground">
                    {revenueCatReady ? 'Start your free trial today' : 'Contact us for pricing'}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Actions */}
        {user && revenueCatReady && (
          <div className="text-center mb-12">
            <Button
              onClick={handleRestorePurchases}
              variant="outline"
              disabled={loading}
              className="mr-4"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore Purchases
                </>
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        )}

        {/* Features Comparison */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Feature Comparison</CardTitle>
            <CardDescription>
              See what's included in each plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Features</th>
                    <th className="text-center py-4 px-4">Basic</th>
                    <th className="text-center py-4 px-4">Pro</th>
                    <th className="text-center py-4 px-4">Therapist</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-4 px-4 font-medium">Monthly Analyses</td>
                    <td className="text-center py-4 px-4">10</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">AI Feedback</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Progress Tracking</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Custom Exercises</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Multiple Students</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4">5</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Clinical Reports</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">API Access</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, all plans come with a 7-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and Apple Pay for your convenience.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">How does the money-back guarantee work?</h3>
              <p className="text-muted-foreground text-sm">
                If you're not satisfied within 30 days, we'll refund your payment in full, no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Need Help Choosing?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our team is here to help you find the perfect plan for your needs. Get in touch for personalized recommendations.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/demo">Schedule Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}