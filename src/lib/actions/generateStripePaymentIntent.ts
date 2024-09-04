'use server'

import Stripe from "stripe"
import clientPromise from "../mongodb/clientPromise"

export default async function generateStripePaymentIntent(orderAmount: number, currency: string): Promise<string | null> {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const paymentGeteway = await db.collection('paymentGateway').findOne({
        partner: "STRIPE"
    })
    const stripe = new Stripe(paymentGeteway?.key_secret, {
        apiVersion: "2022-11-15"
    })

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(orderAmount) * 100,
        currency,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return paymentIntent.client_secret
}