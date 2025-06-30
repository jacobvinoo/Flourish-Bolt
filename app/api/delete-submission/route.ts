import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { submissionId, imagePath } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  // 1. Get the current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!submissionId || !imagePath) {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  try {
    // 2. Security Check: Verify the submission belongs to the authenticated user
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('id, user_id')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      return new NextResponse('Submission not found', { status: 404 });
    }

    if (submission.user_id !== user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 3. Perform Deletion from Database and Storage concurrently
    const [dbResult, storageResult] = await Promise.all([
      supabase.from('submissions').delete().eq('id', submissionId),
      supabase.storage.from('submissions').remove([imagePath]),
    ]);

    if (dbResult.error) {
      throw new Error(`Database delete failed: ${dbResult.error.message}`);
    }
    if (storageResult.error) {
      // Note: If storage fails but DB succeeds, you may have an orphaned file.
      // For this implementation, we'll still report an error.
      throw new Error(`Storage delete failed: ${storageResult.error.message}`);
    }

    // 4. Return Success Response
    return NextResponse.json({ message: 'Submission deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting submission:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}