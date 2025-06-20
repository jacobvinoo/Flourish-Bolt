/*
  # Fix Email Confirmation Issue

  1. Updates
    - Ensure all sample users have proper email confirmation status
    - Set email_confirmed_at to current timestamp
    - Update confirmation_token to null (confirmed)
    - Set email_change_confirm_status to 0 (no pending change)

  2. Sample Users
    - demo.user@handwritingapp.com (Password: DemoUser123!)
    - test.student@handwritingapp.com (Password: Student123!)

  3. Notes
    - This migration ensures users can log in immediately without email confirmation
    - All users are marked as confirmed with proper timestamps
*/

-- First, delete any existing sample users to start fresh
DELETE FROM auth.users WHERE email IN (
  'demo@handwriting.app', 
  'student@example.com', 
  'demo.user@handwritingapp.com', 
  'test.student@handwritingapp.com'
);

-- Insert properly configured sample users with confirmed emails
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  email_change_confirm_status,
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
  'demo.user@handwritingapp.com',
  crypt('DemoUser123!', gen_salt('bf')),
  NOW(),
  NULL,
  0,
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo User"}',
  false,
  'authenticated',
  'authenticated'
), (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test.student@handwritingapp.com',
  crypt('Student123!', gen_salt('bf')),
  NOW(),
  NULL,
  0,
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Student"}',
  false,
  'authenticated',
  'authenticated'
);

-- Ensure any existing users with these emails are properly confirmed
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmation_token = NULL,
  email_change_confirm_status = 0,
  updated_at = NOW()
WHERE email IN ('demo.user@handwritingapp.com', 'test.student@handwritingapp.com')
  AND email_confirmed_at IS NULL;