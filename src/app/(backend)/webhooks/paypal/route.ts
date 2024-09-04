import clientPromise from "@/lib/mongodb/clientPromise";
import PayPalAccessToken from "@/lib/types/PayPalAccessToken";
import { PaypalOrderApproved } from "@/lib/types/PayPalOrderApprovedWebhook";
import { PaypalPaymentCapture } from "@/lib/types/PayPalPaymentCaptureWebhook";
import PayPalSignatureVerification from "@/lib/types/PayPalSignatureVerification";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionPG = db.collection("paymentGateway")
    const collectionPaypalStmnt = db.collection("paypalTrxn")
    const paymentGateway = await collectionPG.findOne({ partner: "PAYPAL" })
    const webhook_id = process.env.NODE_ENV == "development" ? "5X42631000964430L" : paymentGateway?.webhook_secret;
    const auth_algo = req.headers.get('paypal-auth-algo')
    const version = req.headers.get('paypal-auth-version')
    const cert_url = req.headers.get('paypal-cert-url')
    const transmission_id = req.headers.get('paypal-transmission-id')
    const transmission_sig = req.headers.get('paypal-transmission-sig')
    const transmission_time = req.headers.get('paypal-transmission-time')
    const token: PayPalAccessToken = await (await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(paymentGateway?.key_id + ":" + paymentGateway?.key_secret)
            // 'Authorization': 'Basic ' + btoa("ARtR4j6Cq0c5nL4l0VptZjSGlF5Ttrk1fkt0lZX8bk8-Xqwbh96k_y-VoGfquqhn97puaT8gZH62tnpo" + ":" + "EIT9ep65d76j8o8Ahh_41zQbm_G5NwVkJzzHVZoychRqnKpbpJddwOAnYCtTHePOFS147WsQRPcvaOK2")
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    })).json()
    const webhook_event: PaypalPaymentCapture | PaypalOrderApproved = await req.json()
    const signatureVerification: PayPalSignatureVerification = await (await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}`
        },
        body: JSON.stringify({
            auth_algo,
            cert_url,
            transmission_id,
            transmission_sig,
            transmission_time,
            webhook_id,
            webhook_event
        })
    })).json()
    console.log({
        auth_algo,
        cert_url,
        transmission_id,
        transmission_sig,
        transmission_time,
        webhook_id,
        webhook_event
    })
    console.log(signatureVerification)
    if (signatureVerification.verification_status == "FAILURE") {
        return new NextResponse()
    } else if (signatureVerification.verification_status == "SUCCESS") {
        if (webhook_event.eventType == "CHECKOUT.ORDER.APPROVED") {
            await collectionPaypalStmnt.findOneAndUpdate({ _id: (webhook_event as PaypalOrderApproved).resource.id as unknown as ObjectId }, { order: webhook_event }, { upsert: true })
        }
        if (webhook_event.eventType == "PAYMENT.CAPTURE.COMPLETED") {
            await collectionPaypalStmnt.findOneAndUpdate({ _id: (webhook_event as PaypalPaymentCapture).resource.supplementaryData.relatedIDS.orderID as unknown as ObjectId }, { payment: webhook_event }, { upsert: true })
        }
        return new NextResponse()
    }
    // let event
    // const body = Buffer.from(await req.arrayBuffer())
    // try {
    //     event = stripe.webhooks.constructEvent(body, sig ?? "", endpointSecret);
    // } catch (err) {
    //     console.log(err)
    //     return;
    // }
    // console.log(event)
    // const insertData = async (data: StripeWebhookResponse) => {
    //     const { id, ...newData } = data
    //     await collectionStripeStmnt.findOneAndUpdate({
    //         _id: id as unknown as ObjectId
    //     }, {
    //         $set: {
    //             ...newData
    //         }
    //     }, {
    //         upsert: true
    //     })
    //     if (data.status === "succeeded")
    //         await collectionOrders.findOneAndUpdate({
    //             paymentCode: id
    //         }, {
    //             paymentStatus: "success"
    //         })
    // }
    // switch (event.type) {
    //     case 'payment_intent.canceled':
    //         const paymentIntentCanceled: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
    //         insertData(paymentIntentCanceled).catch(e => console.log(e))
    //         break;
    //     case 'payment_intent.payment_failed':
    //         const paymentIntentPaymentFailed: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
    //         insertData(paymentIntentPaymentFailed).catch(e => console.log(e))
    //         break;
    //     case 'payment_intent.processing':
    //         const paymentIntentProcessing: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
    //         insertData(paymentIntentProcessing).catch(e => console.log(e))
    //         break;
    //     case 'payment_intent.succeeded':
    //         const paymentIntentSucceeded: StripeWebhookResponse = event.data.object as StripeWebhookResponse;
    //         insertData(paymentIntentSucceeded).catch(e => console.log(e))
    //         break;
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }
}