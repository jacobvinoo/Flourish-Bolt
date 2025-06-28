// app/practice/page.tsx
export const dynamic = 'force-dynamic';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import PracticePageClient from './PracticePageClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/database.types'; 

export default async function PracticePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: submissions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('submissions').select('*').eq('user_id', user.id)
  ]);

  return <PracticePageClient user={user} profile={profile} initialSubmissions={submissions || []} />;
}
