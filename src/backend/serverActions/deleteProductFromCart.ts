'use server'

import clientPromise from "@/lib/clientPromise";
import { ObjectId } from "mongodb";

export default async function deleteProductFromCart(id: string) {
    const client = await clientPromise
    try {
        const cartAdditionAck = await client.db(process.env.MONGODB_DB).collection("carts").findOneAndDelete({
            _id: new ObjectId(id)
        })
        if (cartAdditionAck) {
            await client.db(process.env.MONGODB_DB).collection("users").updateOne({ _id: cartAdditionAck?.value?.userId }, { $inc: { cartCount: -1 } })
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