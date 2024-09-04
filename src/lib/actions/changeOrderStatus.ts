'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function changeOrderStatus(id: string, orderStatus: "pending" | "placed" | "dispatched" | "out-for-delivery" | "delivered" | "returned" | "transit" | "cancelled", tracking?: {
    type: string
    trackingNum: string
}): Promise<AckResponse> {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionDataPoints = db.collection("data_points")
    try {
        const insertResponse = await db.collection("orders").updateOne({ _id: id as unknown as ObjectId }, {
            $set: {
                orderStatus,
                ...(tracking != undefined) && { tracking }
            }
        })
        const resultOfClear = await collectionDataPoints.findOneAndUpdate({ dataFor: "notification" }, {
            $inc: {
                ...(orderStatus == "placed") && { pendingOrders: -1 },
                ...(orderStatus == "dispatched") && { processingOrders: -1 }
            }
        }, { upsert: true, returnDocument: "after" })
        if (resultOfClear?.value?.processingOrders == 0 && resultOfClear.value?.pendingOrders == 0 && resultOfClear.value?.bulkOrders == 0) {
            await collectionDataPoints.findOneAndUpdate({ dataFor: "notification" }, {
                $set: {
                    newOrder: false
                }
            }, { upsert: true, returnDocument: "after" })
        }
        if (insertResponse.acknowledged) {
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