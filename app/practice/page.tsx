// app/practice/page.tsx
export const dynamic = 'force-dynamic';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import PracticePageClient from './PracticePageClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PracticePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return <PracticePageClient user={user} profile={profile} />;
}
