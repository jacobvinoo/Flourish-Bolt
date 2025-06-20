/*
  # Create Sample Users with Realistic Email Addresses

  1. New Users
    - Creates sample users with realistic email addresses that pass validation
    - Uses proper password hashing with bcrypt
    - Sets email_confirmed_at to bypass email confirmation
    - Includes proper metadata for profile creation

  2. User Details
    - demo.user@handwritingapp.com / DemoUser123!
    - test.student@handwritingapp.com / Student123!
    - Both users will have profiles automatically created via trigger

  3. Security
    - Uses proper bcrypt password hashing
    - Sets confirmed status to allow immediate login
    - Includes all required auth metadata
*/

-- Delete any existing sample users first to avoid conflicts
DELETE FROM auth.users WHERE email IN ('demo@handwriting.app', 'student@example.com', 'demo.user@handwritingapp.com', 'test.student@handwritingapp.com');

-- Insert realistic sample users
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
  'demo.user@handwritingapp.com',
  crypt('DemoUser123!', gen_salt('bf')),
  NOW(),
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
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Student"}',
  false,
  'authenticated',
  'authenticated'
);