export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/database.types';
import ProgressReportClient from './ProgressReportClient';

/**
 * Server component for the progress report page.
 * It ensures the user is authenticated, fetches their profile and submissions,
 * and passes the data to the client component for rendering.
 */
export default async function ProgressReportPage() {
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

  // Fetch the user's submissions for analysis
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Render the client component with the user, profile, and submissions data.
  return <ProgressReportClient user={user} profile={profile} initialSubmissions={submissions || []} />;
}