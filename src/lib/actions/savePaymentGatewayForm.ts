'use server'
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export async function paymentGatewayActivation(partner: "RZP" | "STRIPE" | "PAYTM" | "PAYPAL", activation: boolean): Promise<AckResponse> {
    const mongoClient = await clientPromise
    const collection = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")
    try {
        const result = await collection.findOneAndUpdate({ partner }, { $set: { activation, updatedOn: Date.now() } }, { upsert: true })
        return { ack: true, result: { code: "SUCCESS", data: result } }
    } catch (err) {
        console.log(err)
        return { ack: false, result: { code: "ERROR", data: err } }
    }
}

export default async function savePaymentGatewayForm(partner: "RZP" | "STRIPE" | "PAYTM" | "PAYPAL", key_id: string, key_secret: string, webhook_secret?: string): Promise<AckResponse> {
    const mongoClient = await clientPromise
    const collection = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")
    try {
        const result = await collection.findOneAndUpdate({ partner }, { $set: { key_id, key_secret, webhook_secret, updatedOn: Date.now() } }, { upsert: true })
        return { ack: true, result: { code: "SUCCESS", data: result } }
    } catch (err) {
        console.log(err)
        return { ack: false, result: { code: "ERROR", data: err } }
    }
}