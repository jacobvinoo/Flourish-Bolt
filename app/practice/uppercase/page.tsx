// app/practice/uppercase/page.tsx
export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/database.types';
import UppercasePracticeClient from './UppercasePracticeClient';

/**
 * Server component for the uppercase practice page.
 * It ensures the user is authenticated, fetches their profile,
 * and passes the data to the client component for rendering.
 */
export default async function UppercasePracticePage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // If no user is found, redirect them to the login page.
  if (!user) {
    redirect('/login');
  }

  // Fetch the user's profile from the database.
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Fetch the user's submissions for uppercase letters
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .like('worksheet_id', 'letter-%')
    .order('created_at', { ascending: false });

  // Render the client component with the user and profile data.
  return <UppercasePracticeClient user={user} profile={profile} initialSubmissions={submissions || []} />;
}