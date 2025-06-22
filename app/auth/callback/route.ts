// app/auth/callback/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/database.types';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const plan = requestUrl.searchParams.get('plan') || 'free';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session) {
      try {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        // If profile doesn't exist or doesn't have a plan set, update it
        if (!existingProfile || !existingProfile.selected_plan || existingProfile.selected_plan === 'free') {
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata.full_name || session.user.user_metadata.name || null,
              selected_plan: plan,
              subscription_status: 'active',
              trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (upsertError) {
            console.error('Error updating profile:', upsertError);
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}