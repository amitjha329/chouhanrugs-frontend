'use server'

import clientPromise from "@/lib/clientPromise"
import PaymentGatewayDataModel from "@/types/PaymentGatewayDataModel"
import converter from "@/utils/mongoObjectConversionUtility"
import { getCountriesByName } from "@yusifaliyevpro/countries"
import { ObjectId } from "mongodb"

/**
 * Get Payoneer configuration from database
 * @returns Active status and configuration
 */
export async function getPayoneerConfig(): Promise<{
    isActive: boolean
    config?: PaymentGatewayDataModel
}> {
    try {
        const mongoClient = await clientPromise
        const collection = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")

        const result = await collection.findOne({
            partner: 'PAYONEER',
            activation: true
        })

        if (result) {
            return {
                isActive: true,
                config: converter.fromWithNoFieldChange<PaymentGatewayDataModel>(result)
            }
        }

        return { isActive: false }
    } catch (error) {
        console.error("Error fetching Payoneer config:", error)
        return { isActive: false }
    }
}

/**
 * Initiate Payoneer payment session
 * @param orderData Order information
 * @returns Redirect URL or error
 */
export async function initiatePayoneerPayment(orderData: {
    orderId: string
    amount: number
    currency: string
    customerEmail?: string
    customerName?: string
    shippingAddress?: {
        fname: string
        lname: string
        email: string
        streetAddress: string
        city: string
        state: string
        country: string
        postalCode: string
    }
    customerNumber?: string
}): Promise<{
    success: boolean
    redirectUrl?: string
    error?: string
}> {
    try {
        // Fetch credentials from database
        const mongoClient = await clientPromise
        const collection = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")

        const config = await collection.findOne({
            partner: 'PAYONEER',
            activation: true
        })

        if (!config || !config.key_id || !config.key_secret) {
            return {
                success: false,
                error: "Payoneer is not configured or inactive"
            }
        }

        const division = config.key_id // Division/Store Code
        const apiToken = config.key_secret // API Token

        // Determine API endpoint based on environment
        const baseUrl = process.env.NEXT_PUBLIC_PAYONEER_ENV === 'production'
            ? 'https://api.oscato.com'
            : 'https://api.sandbox.oscato.com'

        // IMPORTANT: The division field in the payload should be your Store/Division Code
        // The key_id for authentication should be your Merchant Code (API Username)
        // If getting 401 errors, verify:
        // 1. key_id in database = Merchant Code (for auth)
        // 2. division in payload = Store/Division Code
        // 3. Headers use versioned content-type (see below)

        // Construct the LIST session request according to Payoneer documentation
        const country = await getCountriesByName({
            name: orderData.shippingAddress?.country ?? "United States",
            fields: ["name", "cca2"]
        })
        const payload: any = {
            transactionId: orderData.orderId,
            integration: "HOSTED",
            operationType: "CHARGE",
            division: division,
            country: (country?.length ?? 0) > 0 ? country?.at(0)?.cca2 : "US",
            payment: {
                amount: orderData.amount,
                currency: orderData.currency,
                reference: `Order ${orderData.orderId}`
            },
            style: {
                language: "en_US",
                hostedVersion: "v4"
            },
            // callback: {
            //     returnUrl: `https://congestive-tabetha-saturninely.ngrok-free.dev/payment/callback`,
            //     cancelUrl: `https://congestive-tabetha-saturninely.ngrok-free.dev/checkout`,
            //     notificationUrl: `https://congestive-tabetha-saturninely.ngrok-free.dev/api/payoneer/webhook`
            // },
            callback: {
                returnUrl: `https://stagin.chouhanrugs.in/payment/callback`,
                cancelUrl: `https://stagin.chouhanrugs.in/checkout`,
                notificationUrl: `https://stagin.chouhanrugs.in/api/payoneer/webhook`
            }
        }

        // Add customer data if available
        if (orderData.customerEmail && orderData.shippingAddress) {
            const addr = orderData.shippingAddress
            const country = await getCountriesByName({
                name: addr.country,
                fields: ["name", "cca2"]
            })
            const countryCode = (country?.length ?? 0) > 0 ? country?.at(0)?.cca2 : "US"
            payload.customer = {
                number: orderData.customerNumber || `customer_${Date.now()}`,
                email: orderData.customerEmail,
                addresses: {
                    billing: {
                        name: {
                            firstName: addr.fname,
                            lastName: addr.lname
                        },
                        street: addr.streetAddress,
                        city: addr.city,
                        state: addr.state,
                        zip: addr.postalCode,
                        country: countryCode
                    },
                    shipping: {
                        name: {
                            firstName: addr.fname,
                            lastName: addr.lname
                        },
                        street: addr.streetAddress,
                        city: addr.city,
                        state: addr.state,
                        zip: addr.postalCode,
                        country: countryCode
                    }
                }
            }
        } else if (orderData.customerEmail) {
            // Minimal customer data if address not available
            payload.customer = {
                email: orderData.customerEmail
            }
        }

        console.log('📦 Payoneer Payload:', JSON.stringify(payload, null, 2));

        // Make API request with Basic Auth
        const authHeader = 'Basic ' + Buffer.from(`VLXYUTYX:${apiToken}`).toString('base64')

        console.log('🔐 Payoneer Authentication Debug:', {
            merchantCode: division,
            apiTokenLength: apiToken?.length || 0,
            apiTokenFirst4: apiToken?.substring(0, 4) || 'missing',
            authHeaderLength: authHeader.length,
            baseUrl: `${baseUrl}/api/lists`,
            environment: process.env.NEXT_PUBLIC_PAYONEER_ENV
        })

        const response = await fetch(`${baseUrl}/api/lists`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/vnd.optile.payment.enterprise-v1-extensible+json',
                'Accept': 'application/vnd.optile.payment.enterprise-v1-extensible+json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("❌ Payoneer API Error:", {
                status: response.status,
                statusText: response.statusText,
                errorBody: errorText,
                headers: Object.fromEntries(response.headers.entries())
            })

            // Provide more specific error messages
            if (response.status === 401) {
                return {
                    success: false,
                    error: `Authentication failed. Please verify:\n1. key_id (${division}) is your Merchant Code\n2. key_secret is correct API Token\n3. Credentials match the environment (${process.env.NEXT_PUBLIC_PAYONEER_ENV})`
                }
            }

            return {
                success: false,
                error: `Payoneer API error: ${response.status} - ${errorText}`
            }
        }

        const responseData = await response.json()

        console.log("Payoneer API Response:", responseData)
        
        // Extract redirect URL from response
        // Payoneer returns redirect URL in redirect.url field, not links.redirect
        if (responseData.redirect?.url) {
            return {
                success: true,
                redirectUrl: responseData.redirect.url
            }
        }

        // Fallback: check links.redirect for older API versions
        if (responseData.links?.redirect) {
            return {
                success: true,
                redirectUrl: responseData.links.redirect
            }
        }

        console.error("No redirect URL found in response:", {
            hasRedirect: !!responseData.redirect,
            hasLinks: !!responseData.links,
            responseKeys: Object.keys(responseData)
        })

        return {
            success: false,
            error: "No redirect URL received from Payoneer"
        }
    } catch (error) {
        console.error("Error initiating Payoneer payment:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Verify Payoneer webhook signature
 * @param body Request body as string
 * @param signature Signature from header
 * @param secret Webhook secret from database
 * @returns Whether signature is valid
 */
export async function verifyPayoneerSignature(
    body: string,
    signature: string,
    secret: string
): Promise<boolean> {
    try {
        const crypto = require('crypto')
        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(body)
        const calculatedSignature = hmac.digest('hex')

        return calculatedSignature === signature
    } catch (error) {
        console.error("Error verifying Payoneer signature:", error)
        return false
    }
}

/**
 * Update order payment status after Payoneer payment
 * @param orderId Order ID (can be _id or orderId field)
 * @param transactionId Payoneer transaction ID
 * @param status Payment status
 */
export async function updatePayoneerOrderStatus(
    orderId: string,
    transactionId: string,
    status: 'paid' | 'failed' | 'pending'
): Promise<{ success: boolean; error?: string }> {
    try {
        const mongoClient = await clientPromise
        const ordersCollection = mongoClient.db(process.env.MONGODB_DB).collection("orders")

        const updateData: any = {
            paymentStatus: status,
            payoneerTransactionId: transactionId,
            updatedAt: new Date()
        }

        if (status === 'paid') {
            updateData.paidAt = new Date()
            updateData.orderStatus = 'placed'
        }

        // Try to find order by both orderId field and _id field
        const result = await ordersCollection.updateOne(
            {
                $or: [
                    { orderId: orderId },
                    { _id: orderId as unknown as ObjectId }
                ]
            },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            console.error(`Order not found with ID: ${orderId}`)
            return {
                success: false,
                error: "Order not found"
            }
        }

        console.log(`✅ Order ${orderId} updated successfully:`, updateData)
        return { success: true }
    } catch (error) {
        console.error("Error updating Payoneer order status:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }
    }
}
