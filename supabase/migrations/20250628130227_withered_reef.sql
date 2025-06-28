/*
  # Add Subscription Type to Profiles Table

  1. Changes
    - Add subscription_type column to profiles table
    - Set default value to 'free'
    - Add subscription_type to existing profiles
    - Add subscription_status column if it doesn't exist
    - Add trial_end_date column if it doesn't exist

  2. Subscription Types
    - 'free': Basic free tier
    - 'basic': Paid basic tier
    - 'pro': Professional tier
    - 'educator': Educator/classroom tier

  3. Notes
    - This migration is safe to run multiple times
    - Uses IF NOT EXISTS to avoid errors on repeated runs
    - Updates existing profiles to have a default subscription type
*/

-- Add subscription_type column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_type'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_type TEXT NOT NULL DEFAULT 'free';
    
    -- Comment explaining the column
    COMMENT ON COLUMN public.profiles.subscription_type IS 'Subscription tier: free, basic, pro, educator';
  END IF;
  
  -- Ensure subscription_status column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
    
    -- Comment explaining the column
    COMMENT ON COLUMN public.profiles.subscription_status IS 'Status of subscription: active, inactive, trial, cancelled';
  END IF;
  
  -- Ensure trial_end_date column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'trial_end_date'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN trial_end_date TIMESTAMPTZ;
    
    -- Comment explaining the column
    COMMENT ON COLUMN public.profiles.trial_end_date IS 'Date when the trial period ends';
  END IF;
  
  -- Update existing profiles to have a subscription type based on selected_plan if it exists
  UPDATE public.profiles
  SET subscription_type = 
    CASE 
      WHEN selected_plan = 'pro' THEN 'pro'
      WHEN selected_plan = 'basic' THEN 'basic'
      WHEN selected_plan = 'educator' THEN 'educator'
      ELSE 'free'
    END
  WHERE subscription_type IS NULL OR subscription_type = '';
  
  -- Set subscription_status to 'active' for any profile with a trial_end_date in the future
  UPDATE public.profiles
  SET subscription_status = 'active'
  WHERE trial_end_date > NOW() AND (subscription_status IS NULL OR subscription_status = 'inactive');
  
  -- Set subscription_status to 'trial' for any profile with a trial_end_date in the future and subscription_type != 'free'
  UPDATE public.profiles
  SET subscription_status = 'trial'
  WHERE trial_end_date > NOW() AND subscription_type != 'free' AND subscription_status = 'active';
  
END $$;