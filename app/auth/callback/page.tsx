'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await supabase.auth.getSession(); // ensures session is loaded
      router.push('/dashboard'); // or redirect to redirectedFrom if stored in cookie or state
    })();
  }, [router, supabase]);

  return <p className="text-center mt-10">Logging in...</p>;
}
