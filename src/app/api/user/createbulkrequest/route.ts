import clientPromise from "@/lib/clientPromise";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection("bulkRequests")
    const request = await req.json()
    const { contactNum, email, message, productId, quantity, color, size, user } = request
    const collectionDataPoints = db.collection("data_points")
    try {
        const insertResponse = await collection.updateOne({ _id: new ObjectId() }, {
            $set: {
                contactNum, email, message, productId, quantity, color, size, user,
                requestDate: new Date().toISOString(),
                status: true,
                newChat: 1
            }
        }, { upsert: true })
        await collectionDataPoints.updateOne({ dataFor: "notification" }, {
            $inc: {
                bulkOrders: 1
            },
            $set: { newOrder: true }
        }, { upsert: true })
        if (insertResponse.acknowledged) {
            return NextResponse.json({
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            })
        } else {
            return NextResponse.json({
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            })
        }
    } catch (error: any) {
        throw new Error(error)
    }
}