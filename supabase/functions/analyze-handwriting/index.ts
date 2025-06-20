import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubmissionRecord {
  id: number
  user_id: string
  exercise_id: number
  image_url: string
  status: string
  submitted_at: string
}

interface SubscriptionRecord {
  user_id: string
  rc_customer_id: string | null
  active_entitlement: string | null
  analyses_remaining: number | null
  period_ends_at: string | null
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: SubmissionRecord
  schema: string
  old_record?: SubmissionRecord
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the webhook payload
    const payload: WebhookPayload = await req.json()
    
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2))

    // Only process INSERT events on submissions table
    if (payload.type !== 'INSERT' || payload.table !== 'submissions') {
      console.log('Ignoring non-INSERT event or non-submissions table')
      return new Response('Event ignored', { 
        status: 200, 
        headers: corsHeaders 
      })
    }

    const submission = payload.record
    console.log('Processing submission:', {
      id: submission.id,
      user_id: submission.user_id,
      exercise_id: submission.exercise_id,
      image_url: submission.image_url,
      status: submission.status
    })

    // Update submission status to 'processing'
    console.log('Updating submission status to processing...')
    const { error: updateError } = await supabaseClient
      .from('submissions')
      .update({ status: 'processing' })
      .eq('id', submission.id)

    if (updateError) {
      console.error('Error updating submission status:', updateError)
      throw new Error(`Failed to update submission status: ${updateError.message}`)
    }

    // ENTITLEMENT CHECK: Fetch user's subscription data
    console.log('Checking user subscription entitlement...')
    const { data: subscriptionData, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', submission.user_id)
      .single()

    if (subscriptionError) {
      console.error('Error fetching subscription data:', subscriptionError)
      
      // If no subscription record exists, create a default one with 0 analyses
      if (subscriptionError.code === 'PGRST116') { // No rows returned
        console.log('No subscription record found, creating default subscription...')
        const { error: insertError } = await supabaseClient
          .from('subscriptions')
          .insert({
            user_id: submission.user_id,
            active_entitlement: null,
            analyses_remaining: 0
          })

        if (insertError) {
          console.error('Error creating default subscription:', insertError)
        }

        // Update submission status to error and return
        await supabaseClient
          .from('submissions')
          .update({ status: 'error_subscription_inactive' })
          .eq('id', submission.id)

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No active subscription found',
            submissionId: submission.id
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      } else {
        throw new Error(`Failed to fetch subscription data: ${subscriptionError.message}`)
      }
    }

    const subscription: SubscriptionRecord = subscriptionData
    console.log('User subscription data:', {
      user_id: subscription.user_id,
      active_entitlement: subscription.active_entitlement,
      analyses_remaining: subscription.analyses_remaining,
      period_ends_at: subscription.period_ends_at
    })

    // Check if user has an active entitlement
    if (!subscription.active_entitlement) {
      console.log('User has no active entitlement')
      
      // Update submission status to error_subscription_inactive
      await supabaseClient
        .from('submissions')
        .update({ status: 'error_subscription_inactive' })
        .eq('id', submission.id)

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No active subscription entitlement',
          submissionId: submission.id
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Check if user has analyses remaining (null means unlimited for some plans)
    if (subscription.analyses_remaining !== null && subscription.analyses_remaining <= 0) {
      console.log('User has no analyses remaining:', subscription.analyses_remaining)
      
      // Update submission status to error_subscription_inactive
      await supabaseClient
        .from('submissions')
        .update({ status: 'error_subscription_inactive' })
        .eq('id', submission.id)

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No analyses remaining in current billing period',
          submissionId: submission.id,
          analyses_remaining: subscription.analyses_remaining
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Check if subscription period has ended
    if (subscription.period_ends_at) {
      const periodEndDate = new Date(subscription.period_ends_at)
      const now = new Date()
      
      if (now > periodEndDate) {
        console.log('User subscription period has ended:', subscription.period_ends_at)
        
        // Update submission status to error_subscription_inactive
        await supabaseClient
          .from('submissions')
          .update({ status: 'error_subscription_inactive' })
          .eq('id', submission.id)

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Subscription period has ended',
            submissionId: submission.id,
            period_ends_at: subscription.period_ends_at
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }
    }

    console.log('✅ Entitlement check passed - proceeding with analysis')

    // Log the image URL as requested
    console.log('Image URL to analyze:', submission.image_url)

    // Get Google Cloud Vision API key from environment
    const visionApiKey = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY')
    if (!visionApiKey) {
      throw new Error('Google Cloud Vision API key not configured')
    }

    // Prepare Google Cloud Vision API request
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`
    
    const visionRequest = {
      requests: [
        {
          image: {
            source: {
              imageUri: submission.image_url
            }
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',
              maxResults: 1
            }
          ]
        }
      ]
    }

    console.log('Calling Google Cloud Vision API...')
    console.log('Vision API request:', JSON.stringify(visionRequest, null, 2))

    // Call Google Cloud Vision API
    const visionResponse = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visionRequest)
    })

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text()
      console.error('Vision API error response:', errorText)
      throw new Error(`Vision API request failed: ${visionResponse.status} ${errorText}`)
    }

    const visionResult = await visionResponse.json()
    
    // Log the full JSON response as requested
    console.log('Google Cloud Vision API full response:', JSON.stringify(visionResult, null, 2))

    // Check if the API returned any errors
    if (visionResult.responses && visionResult.responses[0] && visionResult.responses[0].error) {
      const apiError = visionResult.responses[0].error
      console.error('Vision API returned error:', apiError)
      throw new Error(`Vision API error: ${apiError.message}`)
    }

    // Extract text detection results
    const textAnnotations = visionResult.responses?.[0]?.textAnnotations || []
    const fullTextAnnotation = visionResult.responses?.[0]?.fullTextAnnotation || null

    console.log('Text detection results:')
    console.log('- Text annotations count:', textAnnotations.length)
    console.log('- Full text annotation available:', !!fullTextAnnotation)

    if (textAnnotations.length > 0) {
      console.log('Detected text preview:', textAnnotations[0].description?.substring(0, 100) + '...')
    }

    // SUCCESSFUL ANALYSIS - Decrement analyses_remaining count
    if (subscription.analyses_remaining !== null && subscription.analyses_remaining > 0) {
      console.log('Decrementing analyses_remaining count...')
      const newCount = subscription.analyses_remaining - 1
      
      const { error: decrementError } = await supabaseClient
        .from('subscriptions')
        .update({ analyses_remaining: newCount })
        .eq('user_id', submission.user_id)

      if (decrementError) {
        console.error('Error decrementing analyses count:', decrementError)
        // Don't fail the entire operation, just log the error
      } else {
        console.log(`✅ Analyses remaining decremented from ${subscription.analyses_remaining} to ${newCount}`)
      }
    } else {
      console.log('User has unlimited analyses (analyses_remaining is null)')
    }

    // Update submission status to 'complete'
    console.log('Updating submission status to complete...')
    const { error: completeError } = await supabaseClient
      .from('submissions')
      .update({ status: 'complete' })
      .eq('id', submission.id)

    if (completeError) {
      console.error('Error updating submission to complete:', completeError)
      throw new Error(`Failed to update submission to complete: ${completeError.message}`)
    }

    console.log('✅ Successfully processed submission:', submission.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Handwriting analysis completed',
        submissionId: submission.id,
        textDetected: textAnnotations.length > 0,
        analyses_remaining: subscription.analyses_remaining !== null ? 
          Math.max(0, subscription.analyses_remaining - 1) : null
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in analyze-handwriting function:', error)

    // Try to update submission status to 'error' if we have the submission ID
    try {
      const requestClone = req.clone()
      const payload: WebhookPayload = await requestClone.json()
      if (payload.record?.id) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        await supabaseClient
          .from('submissions')
          .update({ status: 'error' })
          .eq('id', payload.record.id)
        
        console.log('Updated submission status to error for ID:', payload.record.id)
      }
    } catch (updateError) {
      console.error('Failed to update submission status to error:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})