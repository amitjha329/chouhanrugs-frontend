'use server'

import { connection } from 'next/server'
import clientPromise from "@/lib/clientPromise";
import { ObjectId } from "mongodb";

export default async function deleteProductFromWishlist(productId: string, userId: string) {
    await connection()
    const client = await clientPromise
    try {
        const cartAdditionAck = await client.db(process.env.MONGODB_DB).collection("wishlists").findOneAndUpdate({
            userId: new ObjectId(userId)
        }, {
            //@ts-ignore
            $pull: {
                items: new ObjectId(productId)
            }
        }, { upsert: true })
        if (cartAdditionAck) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(cartAdditionAck)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(cartAdditionAck)
                }
            }
        }
    } catch (err: any) {
        throw new Error(err)
    }
}