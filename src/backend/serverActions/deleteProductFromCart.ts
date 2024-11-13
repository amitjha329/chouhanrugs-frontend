'use server'

import { auth } from "@/auth";
import clientPromise from "@/lib/clientPromise";
import { ObjectId } from "mongodb";

export default async function deleteProductFromCart(id: string) {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collectionUserProfile = db.collection("users")
    const session = await auth()
    try {
        const cartAdditionAck = await db.collection("carts").findOneAndDelete({
            _id: ObjectId.createFromHexString(id)
        })
        if (cartAdditionAck) {
            await collectionUserProfile.findOneAndUpdate({ _id: ObjectId.createFromHexString(session?.user?.id ?? "") }, { $inc: { cartCount: -1 } })
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