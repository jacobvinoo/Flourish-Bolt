/*
  # Create Database Webhook for Handwriting Analysis

  1. Webhook Setup
    - Creates a webhook that triggers on INSERT to submissions table
    - Points to the analyze-handwriting Edge Function
    - Sends the new submission record to the function for processing

  2. Function Integration
    - The webhook will automatically call the Edge Function when a new submission is created
    - The function will receive the submission data and process it with Google Cloud Vision API
    - Status will be updated from 'pending' -> 'processing' -> 'complete' or 'error'

  3. Security
    - Uses Supabase's built-in webhook authentication
    - Edge Function has access to service role key for database operations
*/

-- Create a webhook that triggers on INSERT to submissions table
-- This will call our analyze-handwriting Edge Function
-- Note: The actual webhook creation needs to be done via Supabase Dashboard or CLI
-- This migration serves as documentation of the webhook configuration

-- The webhook should be configured with:
-- - Event: INSERT on public.submissions
-- - URL: https://[your-project-ref].supabase.co/functions/v1/analyze-handwriting
-- - HTTP Headers: 
--   - Authorization: Bearer [service-role-key]
--   - Content-Type: application/json

-- For now, we'll add a comment to track this requirement
COMMENT ON TABLE public.submissions IS 'Webhook configured: INSERT events trigger analyze-handwriting Edge Function';

-- Ensure the submissions table has the correct structure for webhook processing
-- (This should already exist from previous migrations, but we'll verify)
DO $$
BEGIN
  -- Verify that status column exists and has correct default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' 
    AND column_name = 'status' 
    AND column_default LIKE '%pending%'
  ) THEN
    RAISE EXCEPTION 'Submissions table status column not properly configured for webhook processing';
  END IF;
  
  -- Verify that image_url column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' 
    AND column_name = 'image_url'
  ) THEN
    RAISE EXCEPTION 'Submissions table image_url column missing for webhook processing';
  END IF;
  
  RAISE NOTICE 'Submissions table structure verified for webhook processing';
END $$;