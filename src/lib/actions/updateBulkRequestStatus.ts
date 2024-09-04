'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function updateBulkRequestStatus(id: string): Promise<AckResponse> {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionDataPoints = db.collection("data_points")
    try {
        const insertResponse = await db.collection("bulkRequests").findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: { status: false }
        })
        const resultOfClear = await collectionDataPoints.findOneAndUpdate({ dataFor: "notification" }, {
            $inc: {
                bulkOrders: -1,
            }
        }, { upsert: true, returnDocument: "after" })
        if (resultOfClear?.value?.processingOrders == 0 && resultOfClear.value?.pendingOrders == 0 && resultOfClear.value?.bulkOrders == 0) {
            await collectionDataPoints.findOneAndUpdate({ dataFor: "notification" }, {
                $set: {
                    newOrder: false
                }
            }, { upsert: true, returnDocument: "after" })
        }
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
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}