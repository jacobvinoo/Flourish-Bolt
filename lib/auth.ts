import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './database.types';

// Server-side auth client
export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies });
};

// Client-side auth client
export const createClientClient = () => {
  return createClientComponentClient<Database>();
};