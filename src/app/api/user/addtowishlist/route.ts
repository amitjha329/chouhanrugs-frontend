'use server'

import clientPromise from "@/lib/clientPromise";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// export default async function addProductToWishlist(productId: string, userId: string): Promise<AckResponse> {
export async function POST(req: NextRequest) {
    const client = await clientPromise
    const reqBody = await req.json()
    const { productId, userId } = reqBody
    try {
        const cartAdditionAck = await client.db(process.env.MONGODB_DB).collection("wishlists").findOneAndUpdate({
            userId: ObjectId.createFromHexString(userId)
        }, {
            //@ts-ignore
            $addToSet: {
                items: ObjectId.createFromHexString(productId)
            }
        }, { upsert: true })
        if (cartAdditionAck) {
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
        return NextResponse.json({
            ack: false,
            result: {
                code: "ERROR",
                data: JSON.stringify(err)
            }
        })
    }
}