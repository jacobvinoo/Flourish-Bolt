# Analyze Handwriting Edge Function

This Supabase Edge Function processes handwriting submissions using Google Cloud Vision API with subscription entitlement checking.

## Overview

The function is triggered by a database webhook when a new row is inserted into the `submissions` table. It performs the following steps:

1. **Receives webhook payload** with submission data
2. **Updates status** to 'processing'
3. **🔒 ENTITLEMENT CHECK** - Validates user subscription
4. **Calls Google Cloud Vision API** with DOCUMENT_TEXT_DETECTION
5. **Logs the full response** from Vision API
6. **Decrements analyses_remaining** count on success
7. **Updates status** to 'complete' or appropriate error status

## Entitlement Checking

### Subscription Validation Steps

1. **Fetch subscription data** from `subscriptions` table
2. **Check active entitlement** - must not be null
3. **Check analyses remaining** - must be > 0 (null = unlimited)
4. **Check period validity** - current date must be before `period_ends_at`

### Error Statuses

- `error_subscription_inactive` - No active subscription or analyses exhausted
- `error` - Technical error during processing

### Subscription Scenarios

| Scenario | Action |
|----------|--------|
| No subscription record | Create default with 0 analyses → `error_subscription_inactive` |
| `active_entitlement` is null | → `error_subscription_inactive` |
| `analyses_remaining` is 0 | → `error_subscription_inactive` |
| `period_ends_at` has passed | → `error_subscription_inactive` |
| `analyses_remaining` is null | Unlimited analyses (proceed) |
| Valid subscription | Proceed with analysis |

## Environment Variables Required

The following environment variables must be set in your Supabase project:

- `SUPABASE_URL` - Your Supabase project URL (automatically provided)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database operations (automatically provided)
- `GOOGLE_CLOUD_VISION_API_KEY` - Your Google Cloud Vision API key

## Google Cloud Vision API Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Vision API**
   - Navigate to APIs & Services > Library
   - Search for "Cloud Vision API"
   - Click "Enable"

3. **Create API Key**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

4. **Set Environment Variable**
   - In Supabase Dashboard, go to Settings > Edge Functions
   - Add environment variable: `GOOGLE_CLOUD_VISION_API_KEY` = your API key

## Webhook Configuration

The webhook should be configured in Supabase Dashboard:

1. **Go to Database > Webhooks**
2. **Create new webhook** with:
   - **Name**: `analyze-handwriting-trigger`
   - **Table**: `public.submissions`
   - **Events**: `INSERT`
   - **Type**: `HTTP Request`
   - **URL**: `https://[your-project-ref].supabase.co/functions/v1/analyze-handwriting`
   - **HTTP Headers**:
     - `Authorization: Bearer [your-service-role-key]`
     - `Content-Type: application/json`

## Function Flow

```
New Submission Created
        ↓
Database Webhook Triggered
        ↓
Edge Function Receives Payload
        ↓
Status Updated to 'processing'
        ↓
🔒 ENTITLEMENT CHECK
        ↓
┌─── No Active Subscription ───┐
│   Status → 'error_subscription_inactive'  │
│   Return Error Response      │
└─────────────────────────────┘
        ↓
✅ Subscription Valid
        ↓
Google Cloud Vision API Called
        ↓
Full JSON Response Logged
        ↓
📉 Decrement analyses_remaining
        ↓
Status Updated to 'complete'
```

## Subscription Management

### Analyses Remaining Logic

- **Unlimited Plans**: `analyses_remaining` = `null` (no decrement)
- **Limited Plans**: `analyses_remaining` = positive integer
- **Exhausted Plans**: `analyses_remaining` = 0 (blocks analysis)

### Decrementing Process

1. **Check if limited plan**: `analyses_remaining` is not null and > 0
2. **Calculate new count**: `current_count - 1`
3. **Update database**: Set new count in subscriptions table
4. **Log result**: Success or failure of decrement operation

### Error Handling

- **Decrement failures** are logged but don't fail the analysis
- **Missing subscription records** are created with default values
- **Invalid subscription states** result in `error_subscription_inactive`

## Testing

You can test the function by:

1. **Creating a submission** through the UI
2. **Checking the logs** in Supabase Dashboard > Edge Functions > Logs
3. **Verifying status updates** in the submissions table
4. **Monitoring subscription changes** in the subscriptions table

## Error Handling

The function includes comprehensive error handling:

- **Subscription validation failures** → `error_subscription_inactive`
- **API failures** are logged and status is set to 'error'
- **Database errors** are caught and logged
- **Invalid payloads** are handled gracefully
- **Missing environment variables** cause clear error messages

## Logs

The function logs:

- Webhook payload received
- Submission processing steps
- **Subscription entitlement check results**
- **Analyses remaining before/after decrement**
- Image URL being analyzed
- Full Google Cloud Vision API response
- Status updates
- Any errors encountered

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Handwriting analysis completed",
  "submissionId": 123,
  "textDetected": true,
  "analyses_remaining": 9
}
```

### Subscription Error Response
```json
{
  "success": false,
  "error": "No analyses remaining in current billing period",
  "submissionId": 123,
  "analyses_remaining": 0
}
```

## Future Enhancements

This implementation can be extended to:

- Parse and analyze the text detection results
- Calculate handwriting scores based on subscription tier
- Store detailed analysis in `analysis_results` table
- Generate personalized feedback based on entitlement level
- Implement retry logic for failed API calls
- Add usage analytics and reporting
- Support for different analysis types per subscription tier