// app/practice/lowercase/page.tsx
export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/database.types';
import LowercasePracticeClient from './LowercasePracticeClient';
import { lowercaseWorkbookSteps } from './worksheetData';

/**
 * Server component for the lowercase practice page.
 * It ensures the user is authenticated, fetches their profile,
 * and passes the data to the client component for rendering.
 */
export default async function LowercasePracticePage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // If no user is found, redirect them to the login page.
  if (!user) {
    redirect('/login');
  }

  // Create an array of all worksheetIDs for the query
  const worksheetIds = lowercaseWorkbookSteps.map(step => step.id);
  
  // Fetch the user's profile from the database.
  const [{ data: profile }, {data: submissions }] = await Promise.all([supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle(),
    supabase.from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .in('worksheet_id', worksheetIds)
    ]);

  // Render the client component with the user and profile data.
  return (
    <LowercasePracticeClient 
      user={user} 
      profile={profile}
      initialSubmissions={submissions || []}
      />
    );
}

