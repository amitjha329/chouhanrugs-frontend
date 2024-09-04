'use server'
import AckResponse from "../types/AckResponse";
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function saveBulkPurchaseRequest(contact: string, email: string, longMessage: string, product: string, quantity: number, color: string, size: string, userId: string): Promise<AckResponse> {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection("bulkRequests")
    const collectionDataPoints = db.collection("data_points")
    try {
        const insertResponse = await collection.findOneAndUpdate({ _id: new ObjectId() }, {
            $set: {
                contact, email, longMessage, product, quantity, color, size, userId
            }
        }, { upsert: true })
        await collectionDataPoints.updateOne({ dataFor: "notification" }, {
            $inc: {
                bulkOrders: 1
            },
            $set: { newOrder: true }
        }, { upsert: true })
        if (insertResponse) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}