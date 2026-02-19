'use server'
import { connection } from 'next/server'

import clientPromise from "@/lib/clientPromise"
import { ObjectId } from "mongodb"
import orderId from "@/utils/orderIdGenerator"

/**
 * Save Payoneer order after successful payment
 * This is called from the callback page after payment confirmation
 */
export async function savePayoneerOrder(pendingOrderData: {
    orderId: string
    userId: string
    cartItems: any[]
    shippingAddressId: string
    shippingMethod: any
    paymentMethod: string
    orderTotal: number
    currency: string
    couponCode?: string
    discount?: number
}): Promise<{ success: boolean; error?: string; orderNumber?: string }> {
    await connection()
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const ordersCollection = db.collection("orders")
        const cartsCollection = db.collection("carts")
        const productsCollection = db.collection("products")
        const addressesCollection = db.collection("addresses")

        // Check if order already exists
        const existingOrder = await ordersCollection.findOne({
            orderId: pendingOrderData.orderId
        })

        if (existingOrder) {
            console.log(`Order ${pendingOrderData.orderId} already exists`)
            return {
                success: true,
                orderNumber: existingOrder._id.toString()
            }
        }

        // Get user data
        const user = await db.collection("users").findOne({ 
            _id: new ObjectId(pendingOrderData.userId) 
        })

        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }

        // Get shipping address
        const shippingAddress = await addressesCollection.findOne({
            _id: new ObjectId(pendingOrderData.shippingAddressId)
        })

        if (!shippingAddress) {
            return {
                success: false,
                error: "Shipping address not found"
            }
        }

        // Calculate order details
        const products = []
        let subtotal = 0

        for (const cartItem of pendingOrderData.cartItems) {
            const product = await productsCollection.findOne({
                _id: new ObjectId(cartItem.productId || cartItem.cartProduct?._id)
            })

            if (product) {
                const productPrice = cartItem.productPrice || cartItem.cartProduct?.price || 0
                const quantity = cartItem.quantity || 1

                products.push({
                    productId: product._id,
                    productPrice: productPrice,
                    productMSRP: product.msrp || productPrice,
                    quantity: quantity,
                    variation: cartItem.variation,
                    customSize: cartItem.customSize
                })

                subtotal += productPrice * quantity
            }
        }

        // Generate order number using the same logic as saveOrderAfterPay
        const orderNumber = orderId().generate()
        const orderDate = Date.now()

        // Create order document
        const orderDocument = {
            _id: orderNumber as unknown as ObjectId,
            orderId: pendingOrderData.orderId, // Keep the Payoneer transaction ID for reference
            products: products,
            shippingType: pendingOrderData.shippingMethod?.name || "Standard",
            shippingAddress: new ObjectId(pendingOrderData.shippingAddressId),
            tracking: {
                type: "",
                trackingNum: ""
            },
            paymentStatus: "pending", // Will be updated by webhook
            paymentMode: pendingOrderData.paymentMethod,
            paymentCode: "", // Will be updated by webhook
            subtotal: subtotal,
            taxation: 0, // Add if you calculate tax
            orderValue: pendingOrderData.orderTotal,
            userCurrency: {
                currency: pendingOrderData.currency,
                exchangeRates: 1
            },
            userId: new ObjectId(pendingOrderData.userId),
            orderPlacedOn: orderDate,
            orderStatus: "pending" // Will be updated by webhook to "placed"
        }

        // Insert order
        const insertResult = await ordersCollection.insertOne(orderDocument)

        if (!insertResult.acknowledged) {
            return {
                success: false,
                error: "Failed to create order"
            }
        }

        // Clear user's cart
        await cartsCollection.deleteMany({ 
            userId: new ObjectId(pendingOrderData.userId) 
        })

        console.log(`✅ Order ${pendingOrderData.orderId} created successfully:`, orderNumber.toString())

        return {
            success: true,
            orderNumber: orderNumber.toString()
        }
    } catch (error) {
        console.error("Error saving Payoneer order:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }
    }
}
