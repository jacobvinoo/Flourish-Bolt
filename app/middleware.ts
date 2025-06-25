import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client using the request and response
  const supabase = createMiddlewareClient({ req, res });

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session and accessing protected route, redirect to /login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname); // optional: preserve intent
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware only to /dashboard and subroutes
};
