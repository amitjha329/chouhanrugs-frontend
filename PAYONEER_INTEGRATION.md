# Payoneer Hosted Payment Page Integration

## Overview
This document describes the complete implementation of Payoneer Hosted Payment Page integration for the e-commerce application using Next.js App Router and MongoDB.

## Architecture

### Database-Driven Configuration
All payment credentials are stored in MongoDB collection `paymentGateway` rather than environment variables for dynamic configuration.

**Collection Schema:**
```typescript
{
  _id: string
  partner: "PAYONEER"
  key_id: string        // Payoneer Merchant Code (API Username) for authentication
  key_secret: string    // Payoneer API Token for authentication
  webhook_secret: string // For webhook signature verification
  activation: boolean   // Enable/disable payment method
  updatedOn: number
}
```

**Important:** The `key_id` should contain your **Merchant Code** (API Username), NOT the Division/Store Code. The Division/Store Code goes in the request body's `division` field.

## Implementation Files

### 1. Server Actions (`src/backend/serverActions/payoneer.ts`)

#### Functions Implemented:

**`getPayoneerConfig()`**
- Fetches Payoneer configuration from database
- Returns active status and config
- Used to check if Payoneer is enabled

**`initiatePayoneerPayment(orderData)`**
- Fetches credentials from database (`key_id`, `key_secret`)
- Creates LIST session with Payoneer API
- **API Endpoint:** Configurable via `NEXT_PUBLIC_PAYONEER_ENV`
  - Sandbox: `https://api.sandbox.oscato.com/api/lists`
  - Production: `https://api.oscato.com/api/lists`
- **Authentication:** Basic Auth using `key_id:key_secret`
- **Request Payload:**
  ```json
  {
    "integration": "HOSTED",
    "division": "key_id",
    "transactionId": "ORDER_123",
    "payment": {
      "amount": 100.00,
      "currency": "USD"
    },
    "callback": {
      "returnUrl": "https://yoursite.com/payment/callback",
      "cancelUrl": "https://yoursite.com/checkout",
      "notificationUrl": "https://yoursite.com/api/payoneer/webhook"
    },
    "customer": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```
- Returns redirect URL for customer payment

**`verifyPayoneerSignature(body, signature, secret)`**
- Verifies webhook signature using HMAC SHA256
- Ensures webhook authenticity

**`updatePayoneerOrderStatus(orderId, transactionId, status)`**
- Updates order in database
- Sets payment status: `paid`, `failed`, or `pending`
- Records transaction ID and timestamps

### 2. Webhook Handler (`src/app/api/payoneer/webhook/route.ts`)

**Route:** `/api/payoneer/webhook`

**Documentation:** https://checkoutdocs.payoneer.com/docu/docs/create-notification-endpoints

**Webhook Payload Structure:**
```json
{
  "identification": {
    "longId": "8ac7a49f87e22e280187e2ca4e2c0595",
    "transactionId": "ORDER_1234567890_abc123",
    "shortId": "0595.9506.6897"
  },
  "status": {
    "code": "listed|charged|aborted|pending|preauthorized",
    "reason": "OK"
  },
  "interaction": {
    "code": "PROCEED|CHARGE|CHARGED|ABORT|PEND",
    "reason": "OK"
  },
  "payment": {
    "amount": 100.00,
    "currency": "USD",
    "reference": "Order ORDER_1234567890_abc123"
  },
  "customer": {
    "email": "customer@example.com"
  }
}
```

**Process Flow:**
1. Receives POST request from Payoneer
2. Extracts `X-Payoneer-Signature` header (case-insensitive)
3. Fetches `webhook_secret` from database
4. Verifies signature using HMAC SHA256 (raw body required)
5. Parses webhook payload and extracts:
   - `identification.transactionId` (your order ID)
   - `identification.longId` (Payoneer transaction ID)
   - `status.code` (payment status)
   - `interaction.code` (interaction type)
6. Determines payment status:
   - `listed` + `PROCEED` → Mark as pending (payment initiated)
   - `charged` / `CHARGE` / `CHARGED` → Mark as paid
   - `aborted` / `ABORT` / `failed` → Mark as failed
   - `pending` / `PEND` / `preauthorized` → Mark as pending
7. Updates order status in database
8. Returns 200 OK with `{ received: true, transactionId, status }`

**Security:**
- Validates signature before processing (returns 401 for invalid)
- Uses raw request body for signature verification
- Logs all webhook events with detailed information
- Handles missing fields gracefully

**Headers Sent by Payoneer:**
- `X-Payoneer-Signature`: HMAC SHA256 signature for verification
- `Content-Type`: application/json
- Standard HTTP headers

### 3. Payment Callback Page (`src/app/payment/callback/page.tsx`)

**Route:** `/payment/callback`

**Features:**
- Handles user return from Payoneer
- Parses URL parameters:
  - `status`: success/failed/cancelled
  - `orderId` or `transactionId`
  - `longId`: Payoneer transaction ID
  - `resultCode`: Payment result
- Shows appropriate UI:
  - ✅ Success: Green checkmark, auto-redirect to order page
  - ❌ Failed: Red error icon, retry option
  - ⚠️ Cancelled: Yellow warning, return to checkout
  - ⏳ Loading: Spinner while verifying
- Auto-redirects to order details after 3 seconds on success

### 4. Frontend Integration

#### Updated Files:

**`src/types/PaymentGatewayDataModel.ts`**
- Added `"PAYONEER"` to partner union type

**`src/backend/serverActions/getPaymentGatewayData.ts`**
- Added support for `"PAYONEER"` parameter

**`src/ui/Cart/Checkout/PayMethodItem.tsx`**
- Added Payoneer option with payment icon
- Displays when Payoneer is active in database

**`src/ui/Cart/Checkout/MainSection.tsx`**
- Imported `initiatePayoneerPayment` function
- Added Payoneer case in payment processing:
  ```typescript
  case "PAYONEER":
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const result = await initiatePayoneerPayment({
      orderId,
      amount: orderTotal,
      currency: userCurrency?.currency || 'USD',
      customerEmail: session?.user?.email,
      customerName: session?.user?.name
    })
    
    if (result.success && result.redirectUrl) {
      // Save order to database
      await saveOrderAfterPay(orderData)
      // Redirect to Payoneer
      window.location.href = result.redirectUrl
    }
  ```

## Environment Variables

### Development (`.env.development.local`):
```env
NEXT_PUBLIC_PAYONEER_ENV=sandbox
AUTH_URL=http://localhost:3000
```

### Production (`.env.production.local`):
```env
NEXT_PUBLIC_PAYONEER_ENV=production
AUTH_URL=https://chouhanrugs.com
```

## Database Setup

### Step 1: Add Payoneer Configuration
Insert document in `paymentGateway` collection:

```javascript
db.paymentGateway.insertOne({
  partner: "PAYONEER",
  key_id: "YOUR_MERCHANT_CODE",      // Your Payoneer API Username (Merchant Code)
  key_secret: "YOUR_API_TOKEN",      // Your Payoneer API Token (from Integration page)
  webhook_secret: "YOUR_WEBHOOK_SECRET", // Generate secure random string
  activation: true,
  updatedOn: Date.now()
})
```

**Important Authentication Details:**
- `key_id`: This is your **Merchant Code** (API Username), found in your Payoneer account Integration page
- `key_secret`: This is your **API Token**, generated in your Payoneer account
- The **Division/Store Code** is used in the request body's `division` field, NOT for authentication
- For the `division` field in requests, use your specific store/division code from Payoneer dashboard

### Step 2: Configure Webhook in Payoneer Dashboard
1. Login to Payoneer Dashboard
2. Navigate to Integration Settings
3. Set Notification URL: `https://yourdomain.com/api/payoneer/webhook`
4. Configure webhook secret (must match database)

## Payment Flow

### User Journey:
1. **Checkout Page**
   - User selects Payoneer as payment method
   - Enters shipping address
   - Clicks "Pay Now"

2. **Order Creation**
   - System generates unique order ID
   - Calls `initiatePayoneerPayment` server action
   - Saves order to database with `pending` status

3. **Payoneer Redirect**
   - User redirected to Payoneer hosted page
   - Enters payment details on Payoneer's secure form
   - Completes payment

4. **Webhook Processing** (Background)
   - Payoneer sends webhook to `/api/payoneer/webhook`
   - System verifies signature
   - Updates order status to `paid`

5. **User Return**
   - User redirected to `/payment/callback`
   - System displays payment status
   - Auto-redirects to order confirmation

### Error Handling:
- **Payment Failed:** User sees error message, can retry
- **Payment Cancelled:** User returned to checkout
- **Webhook Failure:** Logged for manual review
- **Invalid Signature:** Webhook rejected (security)

## Testing

### Sandbox Testing:
1. Set `NEXT_PUBLIC_PAYONEER_ENV=sandbox`
2. Use Payoneer test credentials
3. Use test cards from Payoneer documentation
4. Test webhook with Payoneer webhook simulator

### Test Scenarios:
- ✅ Successful payment
- ❌ Failed payment (insufficient funds)
- ⚠️ Cancelled payment
- 🔄 Webhook signature verification
- 🔄 Multiple currency support
- 🔄 Order status updates

## Security Considerations

### Implemented Security:
1. **Webhook Signature Verification:** HMAC SHA256
2. **Database-Driven Credentials:** No secrets in code
3. **HTTPS Only:** Production requires HTTPS
4. **Input Validation:** All parameters validated
5. **Error Logging:** Comprehensive error tracking

### Best Practices:
- Store webhook secret securely in database
- Rotate API tokens periodically
- Monitor webhook failures
- Log all payment transactions
- Use HTTPS in production

## Troubleshooting

### Common Issues:

**1. "Payoneer is not configured or inactive"**
- Check database for PAYONEER document
- Verify `activation: true`
- Confirm `key_id` and `key_secret` are set

**2. Webhook signature verification failed**
- Verify webhook_secret matches Payoneer dashboard
- Check raw body is used for signature calculation
- Ensure secret is stored correctly in database

**3. Payment redirect fails**
- Check `AUTH_URL` is correct
- Verify callback URLs are accessible
- Confirm `NEXT_PUBLIC_PAYONEER_ENV` is set

**4. Order status not updating**
- Check webhook endpoint is accessible from Payoneer
- Verify webhook secret in database
- Review webhook logs in application
- Check Payoneer dashboard for webhook delivery status

**5. 401 Authentication Error**
- **Most Common Cause:** Incorrect Content-Type header
  - Required: `application/vnd.optile.payment.enterprise-v1-extensible+json`
  - Do NOT use: `application/json`
- Verify `key_id` contains your **Merchant Code** (API Username), not Division/Store Code
- Ensure `key_secret` is the correct API Token from Payoneer dashboard
- Check credentials are for the correct environment (sandbox vs production)
- Verify no extra spaces in credentials stored in database
- Ensure Basic Auth header format: `Basic base64(merchant_code:api_token)`
- Check if API token has been regenerated in Payoneer dashboard

## API Reference

### Payoneer LIST API
**Endpoint:** `POST /api/lists`
- Sandbox: `https://api.sandbox.oscato.com/api/lists`
- Production: `https://api.oscato.com/api/lists`

**Authentication:** Basic Auth (merchant_code:api_token)

**Required Headers:**
```
Authorization: Basic [base64_encoded_credentials]
Content-Type: application/vnd.optile.payment.enterprise-v1-extensible+json
Accept: application/vnd.optile.payment.enterprise-v1-extensible+json
```

**⚠️ Important:** The Content-Type and Accept headers MUST use the versioned format above. Using `application/json` will result in 401 authentication errors.

**Response:**
```json
{
  "links": {
    "redirect": "https://hosted.payoneer.com/...",
    "self": "https://api.oscato.com/..."
  },
  "identification": {
    "longId": "transaction-id",
    "shortId": "short-id",
    "transactionId": "your-order-id"
  },
  "status": {
    "code": "created",
    "reason": "OK"
  }
}
```

### Webhook Events
**Documentation:** https://checkoutdocs.payoneer.com/docu/docs/create-notification-endpoints

**Status Codes:**
- `listed` - Payment session created, customer redirected to payment page
- `charged` - Payment successfully completed and captured
- `pending` - Payment authorization pending
- `preauthorized` - Payment authorized but not yet captured
- `aborted` - Payment cancelled or failed
- `failed` - Payment processing failed

**Interaction Codes:**
- `PROCEED` - Customer proceeding to payment (payment initiated)
- `CHARGE` / `CHARGED` - Payment successfully charged
- `ABORT` - Payment aborted by customer or system
- `PEND` - Payment pending additional action
- `TRY_OTHER_ACCOUNT` - Customer requested to try different payment method
- `TRY_OTHER_NETWORK` - Network change requested

**Webhook Response:**
Your endpoint should return:
```json
{
  "received": true,
  "transactionId": "ORDER_123",
  "status": "paid|failed|pending"
}
```

**HTTP Status Codes:**
- `200 OK` - Webhook processed successfully
- `400 Bad Request` - Missing required data
- `401 Unauthorized` - Invalid signature
- `500 Internal Server Error` - Processing error

## Monitoring

### Logs to Monitor:
- Webhook receipt and processing
- Signature verification results
- Order status updates
- Payment initiation attempts
- API errors

### Recommended Monitoring:
- Set up alerts for webhook failures
- Monitor payment success rate
- Track order status mismatches
- Review error logs daily

## Support

### Documentation:
- Payoneer Hosted Page API: https://developers.payoneer.com/
- Webhook Signature Verification: Check Payoneer docs

### Contact:
- For integration issues: Check application logs
- For Payoneer API issues: Contact Payoneer support
- For database issues: Review MongoDB connection

---

## Summary

This implementation provides a complete, secure, and production-ready Payoneer Hosted Payment Page integration that:

✅ Uses database for dynamic configuration
✅ Supports sandbox and production environments
✅ Includes webhook handling with signature verification
✅ Provides user-friendly callback page
✅ Handles all payment states (success/failed/cancelled)
✅ Follows security best practices
✅ Includes comprehensive error handling
✅ Ready for production deployment

All credentials are managed through the database, making it easy for administrators to update payment configurations without code changes.
