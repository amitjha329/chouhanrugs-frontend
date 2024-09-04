import clientPromise from "@/lib/mongodb/clientPromise";
import StripeWebhookResponse from "@/lib/types/StripeWebhookResponse";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { Stripe } from 'stripe'

export async function POST(req: NextRequest) {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionPG = db.collection("paymentGateway")
    const collectionStripeStmnt = db.collection("stripeTrxn")
    const collectionOrders = db.collection("orders")
    const paymentGateway = await collectionPG.findOne({ partner: "STRIPE" })
    const stripe = new Stripe(paymentGateway?.key_secret, {
        apiVersion: "2022-11-15"
    })
    const endpointSecret = process.env.NODE_ENV == "development" ? "whsec_d94853b3c97d3cbe50673bfd2a6be031dfbebbb70fecc19c88337b53b7582d54" : paymentGateway?.webhook_secret;
    const sig = req.headers.get('stripe-signature')
    let event
    const body = Buffer.from(await req.arrayBuffer())
    try {
        event = stripe.webhooks.constructEvent(body, sig ?? "", endpointSecret);
    } catch (err) {
        console.log(err)
        return;
    }
    console.log(event)
    const insertData = async (data: StripeWebhookResponse) => {
        const { id, ...newData } = data
        await collectionStripeStmnt.findOneAndUpdate({
            _id: id as unknown as ObjectId
        }, {
            $set: {
                ...newData
            }
        }, {
            upsert: true
        })
        if (data.status === "succeeded")
            await collectionOrders.findOneAndUpdate({
                paymentCode: id
            }, {
                paymentStatus: "success"
            })
    }
    switch (event.type) {
        case 'payment_intent.canceled':
            const paymentIntentCanceled: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
            insertData(paymentIntentCanceled).catch(e => console.log(e))
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentPaymentFailed: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
            insertData(paymentIntentPaymentFailed).catch(e => console.log(e))
            break;
        case 'payment_intent.processing':
            const paymentIntentProcessing: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
            insertData(paymentIntentProcessing).catch(e => console.log(e))
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
            insertData(paymentIntentSucceeded).catch(e => console.log(e))
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
}