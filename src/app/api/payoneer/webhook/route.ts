import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/clientPromise'
import { verifyPayoneerSignature, updatePayoneerOrderStatus } from '@/backend/serverActions/payoneer'

/**
 * Payoneer Webhook Handler
 * Handles payment notifications from Payoneer
 * Documentation: https://checkoutdocs.payoneer.com/docu/docs/create-notification-endpoints
 */
export async function POST(request: NextRequest) {
    try {
        // Get raw body for signature verification (MUST be raw before JSON parsing)
        const body = await request.text()
        const signature = request.headers.get('X-Payoneer-Signature') || 
                         request.headers.get('x-payoneer-signature')

        console.log('📨 Payoneer Webhook Received')
        console.log('Headers:', Object.fromEntries(request.headers.entries()))
        console.log('Body:', body)

        // For testing, signature verification can be optional
        // In production, ensure webhook_secret is configured in database
        if (signature) {
            // Fetch webhook secret from database
            const mongoClient = await clientPromise
            const collection = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")
            
            const config = await collection.findOne({ 
                partner: 'PAYONEER', 
                activation: true 
            })

            if (config?.webhook_secret) {
                // Verify signature
                const isValid = await verifyPayoneerSignature(
                    body,
                    signature,
                    config.webhook_secret
                )

                if (!isValid) {
                    console.error("❌ Invalid Payoneer webhook signature")
                    return NextResponse.json(
                        { error: 'Invalid signature' },
                        { status: 401 }
                    )
                }
                console.log("✅ Signature verified successfully")
            } else {
                console.warn("⚠️  Webhook secret not configured, skipping signature verification")
            }
        } else {
            console.warn("⚠️  No signature header found, skipping verification (testing mode)")
        }

        // Parse the webhook payload
        const payload = JSON.parse(body)
        
        console.log("✅ Payoneer webhook verified and parsed:")
        console.log(JSON.stringify(payload, null, 2))

        // Extract transaction details from various possible locations
        const transactionId = payload.identification?.transactionId || 
                             payload.transactionId || 
                             payload.transaction?.id
        
        const payoneerLongId = payload.identification?.longId || 
                              payload.longId || 
                              payload.id || 
                              payload.transaction?.longId
        
        const statusCode = payload.status?.code || 
                          payload.statusCode || 
                          payload.state
        
        const interactionCode = payload.interaction?.code
        const interactionReason = payload.interaction?.reason

        console.log('📋 Extracted Data:', {
            transactionId,
            payoneerLongId,
            statusCode,
            interactionCode,
            interactionReason
        })

        if (!transactionId) {
            console.error("❌ Missing transaction ID in webhook payload")
            return NextResponse.json(
                { error: 'Missing transaction ID' },
                { status: 400 }
            )
        }

        // Determine payment status based on status code and interaction
        let paymentStatus: 'paid' | 'failed' | 'pending' | null = null

        // Handle successful payment
        if (statusCode === 'listed' && interactionCode === 'PROCEED') {
            // Payment page created, customer proceeding to pay
            paymentStatus = 'pending'
            console.log(`💳 Order ${transactionId} - Payment initiated`)
        }
        else if (statusCode === 'charged' || 
                 interactionCode === 'CHARGE' || 
                 interactionCode === 'CHARGED') {
            // Payment successfully completed
            paymentStatus = 'paid'
            console.log(`✅ Order ${transactionId} - Payment successful`)
        }
        // Handle failed/aborted payment
        else if (statusCode === 'aborted' || 
                 interactionCode === 'ABORT' ||
                 statusCode === 'failed') {
            paymentStatus = 'failed'
            console.log(`❌ Order ${transactionId} - Payment failed/aborted`)
        }
        // Handle pending states
        else if (statusCode === 'pending' || 
                 interactionCode === 'PENDING' ||
                 statusCode === 'preauthorized' ||
                 interactionCode === 'PEND') {
            paymentStatus = 'pending'
            console.log(`⏳ Order ${transactionId} - Payment pending`)
        }

        // Update order status if we have a valid status
        if (paymentStatus) {
            const updateResult = await updatePayoneerOrderStatus(
                transactionId,
                payoneerLongId || 'unknown',
                paymentStatus
            )

            if (!updateResult.success) {
                console.error(`❌ Failed to update order ${transactionId}:`, updateResult.error)
                return NextResponse.json(
                    { error: 'Failed to update order' },
                    { status: 500 }
                )
            }

            console.log(`✅ Order ${transactionId} status updated to: ${paymentStatus}`)
        } else {
            console.log(`ℹ️  Webhook received but no status update needed. Status: ${statusCode}, Interaction: ${interactionCode}`)
        }

        // Return 200 OK to acknowledge receipt
        return NextResponse.json({ 
            received: true,
            transactionId,
            status: paymentStatus 
        }, { status: 200 })

    } catch (error) {
        console.error("Error processing Payoneer webhook:", error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json(
        { message: 'Payoneer webhook endpoint. Use POST method.' },
        { status: 405 }
    )
}
