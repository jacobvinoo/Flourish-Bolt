'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types'; // adjust based on your project
import { Button } from '@/components/ui/button'; // optional

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`, // this route must handle Supabase redirect
      },
    });

    setLoading(false);

    if (error) {
      alert('Login error: ' + error.message);
    } else {
      alert('Check your email for the login link!');
    }
  };

  // Optional: If already logged in, redirect
  useEffect(() => {
  const redirectedFrom = searchParams.get('redirectedFrom');
  if (redirectedFrom) {
    document.cookie = `redirectedFrom=${redirectedFrom}; path=/; max-age=600`;
  }
}, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending magic link...' : 'Send Magic Link'}
        </Button>
      </form>
    </div>
  );
}
