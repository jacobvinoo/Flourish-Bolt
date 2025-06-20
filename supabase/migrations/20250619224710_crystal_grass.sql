/*
  # Setup Row Level Security Policies

  1. Security Policies
    - `profiles` table: Users can view and update only their own profile
    - `submissions` table: Users can create and view only their own submissions
    - `exercises` table: All authenticated users have read access
    - `analysis_results` table: Users can view results linked to their own submissions
    - `subscriptions` table: Backend service access only (no public policies)

  2. Policy Details
    - All policies use auth.uid() to ensure users can only access their own data
    - Exercise policies allow public read access for all authenticated users
    - Analysis results use EXISTS subquery to verify ownership through submissions
    - Subscription data remains restricted to service_role access

  3. Security Features
    - Comprehensive CRUD policies where appropriate
    - Proper ownership verification
    - Service-role bypass for backend operations
*/

-- Drop existing policies if they exist to ensure clean setup
DROP POLICY IF EXISTS "Anyone can view exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can view own analysis results" ON public.analysis_results;

-- Exercises table policies - All authenticated users can read exercises
CREATE POLICY "Authenticated users can view exercises"
  ON public.exercises
  FOR SELECT
  TO authenticated
  USING (true);

-- Profiles table policies - Users can manage their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Submissions table policies - Users can create and view their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
  ON public.submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON public.submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analysis results table policies - Users can view results for their own submissions
CREATE POLICY "Users can view own analysis results"
  ON public.analysis_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions
      WHERE submissions.id = analysis_results.submission_id
      AND submissions.user_id = auth.uid()
    )
  );

-- Note: No policies for subscriptions table - backend services access with service_role key
-- This ensures subscription data is only accessible through server-side operations