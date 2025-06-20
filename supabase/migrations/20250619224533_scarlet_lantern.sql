/*
  # Initial Database Schema for Handwriting Analysis Application

  1. New Tables
    - `profiles` - User profile information linked to auth.users
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text)
      - `user_role` (text, default 'student') - 'student', 'parent', 'therapist'
      - `display_mode` (text, default 'adult') - 'adult', 'kid'
      - `updated_at` (timestamptz)
    
    - `subscriptions` - RevenueCat subscription status mirror
      - `user_id` (uuid, primary key, references auth.users)
      - `rc_customer_id` (text)
      - `active_entitlement` (text) - e.g., 'basic', 'pro', 'therapist'
      - `analyses_remaining` (int, default 0)
      - `period_ends_at` (timestamptz)
    
    - `exercises` - Exercise library with worksheets
      - `id` (bigint, auto-generated primary key)
      - `title` (text, required)
      - `description` (text)
      - `level` (int, required) - difficulty level 1-10
      - `font_style` (text) - e.g., 'zaner_bloser', 'dnealian', 'hwt'
      - `worksheet_pdf_url` (text, required) - Supabase Storage path
      - `created_at` (timestamptz)
    
    - `submissions` - User worksheet submissions
      - `id` (bigint, auto-generated primary key)
      - `user_id` (uuid, references auth.users)
      - `exercise_id` (bigint, references exercises)
      - `submitted_at` (timestamptz)
      - `image_url` (text, required) - Supabase Storage path
      - `status` (text, default 'pending') - 'pending', 'processing', 'complete', 'error'
    
    - `analysis_results` - AI analysis results
      - `id` (bigint, auto-generated primary key)
      - `submission_id` (bigint, references submissions)
      - `overall_score` (float)
      - `formation_score` (float)
      - `spacing_score` (float)
      - `consistency_score` (float)
      - `alignment_score` (float)
      - `feedback_json` (jsonb) - detailed AI feedback and coordinates
      - `created_at` (timestamptz)

  2. Functions & Triggers
    - `handle_new_user()` - automatically creates profile on user signup
    - `on_auth_user_created` - trigger to execute profile creation

  3. Security
    - Enable RLS on all tables
    - Users can view all exercises
    - Users can manage their own profiles, submissions, and view their analysis results
    - Backend services access subscription data with service_role key

  4. Extensions
    - Enable uuid-ossp extension for UUID generation
*/

-- Enable the uuid-ossp extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Table for public user profiles
-- This table is linked to the private auth.users table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  -- 'student', 'parent', 'therapist'
  user_role TEXT NOT NULL DEFAULT 'student',
  -- 'adult', 'kid'
  display_mode TEXT NOT NULL DEFAULT 'adult',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Table to mirror subscription status from RevenueCat for easy backend access
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rc_customer_id TEXT,
  -- e.g., 'basic', 'pro', 'therapist'
  active_entitlement TEXT,
  -- The number of analyses remaining in the current billing period
  analyses_remaining INT DEFAULT 0,
  period_ends_at TIMESTAMPTZ
);

-- Table for the exercise library
CREATE TABLE IF NOT EXISTS public.exercises (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT,
  -- Level of difficulty, e.g., 1 for basic strokes, 10 for paragraphs
  level INT NOT NULL,
  -- e.g., 'zaner_bloser', 'dnealian', 'hwt'
  font_style TEXT,
  -- Path to a template PDF in Supabase Storage
  worksheet_pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for user-submitted worksheets
CREATE TABLE IF NOT EXISTS public.submissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES public.exercises(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  -- Path to the uploaded image in Supabase Storage
  image_url TEXT NOT NULL,
  -- 'pending', 'processing', 'complete', 'error'
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Table to store the results of the AI analysis
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  submission_id BIGINT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  overall_score FLOAT,
  formation_score FLOAT,
  spacing_score FLOAT,
  consistency_score FLOAT,
  alignment_score FLOAT,
  -- Stores detailed feedback, coordinates of errors, etc. from the AI
  feedback_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Users can view all exercises
CREATE POLICY "Anyone can view exercises"
  ON public.exercises
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 2. Users can insert/select/update/delete their own profile
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

-- 3. Users can insert/select their own submissions
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

-- 4. Users can select analysis_results linked to their own submissions
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

-- 5. Backend services will access subscription data with service_role key
-- (No public policies for subscriptions - service_role bypasses RLS)