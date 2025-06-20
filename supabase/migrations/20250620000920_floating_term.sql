/*
  # Create Sample User and Disable Email Confirmation

  1. Changes
    - Insert a sample user directly into auth.users table
    - Set email_confirmed_at to bypass email confirmation
    - Create corresponding profile record
    - User credentials: demo@handwriting.app / DemoUser123!

  2. Security
    - This is for development/demo purposes only
    - Password is properly hashed using Supabase's auth functions
*/

-- Insert sample user directly into auth.users table
-- This bypasses the normal signup flow and email confirmation
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'demo@handwriting.app',
  crypt('DemoUser123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo User"}',
  false,
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- The profile will be automatically created by the trigger we set up earlier
-- when the user record is inserted

-- Also insert a second sample user for testing
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'student@example.com',
  crypt('Student123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Student User"}',
  false,
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;