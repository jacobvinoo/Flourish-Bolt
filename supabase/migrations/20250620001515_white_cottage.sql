/*
  # Disable Email Confirmation and Create Sample Users

  1. Configuration Changes
    - This migration provides instructions for disabling email confirmation in Supabase Auth settings
    - Creates sample users that will work once email confirmation is disabled

  2. Sample Users
    - Creates demo users with proper authentication setup
    - Ensures users can log in immediately without email confirmation

  3. Instructions
    - Manual step required: Disable email confirmation in Supabase Dashboard
    - Path: Authentication > Settings > Email Confirmation = OFF
*/

-- First, clean up any existing sample users
DELETE FROM auth.users WHERE email IN (
  'demo@handwriting.app', 
  'student@example.com', 
  'demo.user@handwritingapp.com', 
  'test.student@handwritingapp.com',
  'demo@example.com',
  'student@demo.com'
);

-- Create sample users with confirmed status
-- Note: These will work once email confirmation is disabled in Supabase Auth settings
DO $$
DECLARE
  demo_user_id UUID := gen_random_uuid();
  student_user_id UUID := gen_random_uuid();
BEGIN
  -- Insert demo user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    phone_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    email_change_confirm_status,
    banned_until,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    created_at,
    updated_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    phone_change,
    phone_change_token,
    phone_change_sent_at
  ) VALUES (
    demo_user_id,
    '00000000-0000-0000-0000-000000000000',
    'demo@example.com',
    crypt('Demo123!', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Demo User"}',
    false,
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL
  );

  -- Insert student user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    phone_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    email_change_confirm_status,
    banned_until,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    created_at,
    updated_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    phone_change,
    phone_change_token,
    phone_change_sent_at
  ) VALUES (
    student_user_id,
    '00000000-0000-0000-0000-000000000000',
    'student@demo.com',
    crypt('Student123!', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Student User"}',
    false,
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL
  );

  -- Manually create profiles since the trigger might not fire for direct inserts
  INSERT INTO public.profiles (id, full_name, user_role, display_mode, updated_at) VALUES
    (demo_user_id, 'Demo User', 'student', 'adult', NOW()),
    (student_user_id, 'Student User', 'student', 'adult', NOW())
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

END $$;