import clientPromise from "@/lib/clientPromise";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const cartColletion = db.collection("carts")
    const request = await req.json()
    const collectionUserProfile = db.collection("users")
    const { productId, userId, variationCode, customSize, quantity } = request
    try {
        const cartAdditionAck = await cartColletion.updateOne({
            prodId: ObjectId.createFromHexString(productId),
            userId: ObjectId.createFromHexString(userId),
            variationCode
        }, {
            $set: {
                customSize
            },
            $inc: {
                quantity: quantity
            }
        }, { upsert: true })
        if (cartAdditionAck.acknowledged) {
            await collectionUserProfile.findOneAndUpdate({ _id: ObjectId.createFromHexString(userId) }, { $inc: { cartCount: 1 } })
            return NextResponse.json({
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(cartAdditionAck)
                }
            })
        } else {
            return NextResponse.json({
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(cartAdditionAck)
                }
            })
        }
    } catch (err: any) {
        throw new Error(err)
    }
}