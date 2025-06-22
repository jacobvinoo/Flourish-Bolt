// hooks/use-profile-sync.ts
'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export function useProfileSync() {
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkAndCreateProfile = async (userId: string, email: string, metadata: any) => {
      try {
        // Check if profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        // If profile doesn't exist or is missing plan info, create/update it
        if (error || !profile?.selected_plan) {
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              email: email,
              full_name: metadata?.full_name || metadata?.name || null,
              selected_plan: metadata?.selected_plan || 'free',
              subscription_status: 'active',
              trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (upsertError) {
            console.error('Error creating/updating profile:', upsertError);
          }
        }
      } catch (error) {
        console.error('Error in profile sync:', error);
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await checkAndCreateProfile(
          session.user.id, 
          session.user.email!, 
          session.user.user_metadata
        );
      }
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAndCreateProfile(
          session.user.id, 
          session.user.email!, 
          session.user.user_metadata
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
}