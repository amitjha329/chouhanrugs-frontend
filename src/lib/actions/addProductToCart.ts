'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import { CustomSize } from "../types/CartDataModel";
import AckResponse from "../types/AckResponse";

export default async function addProductToCart(productId: string, userId: string, quantity: number, variationCode?: string, customSize?: CustomSize): Promise<AckResponse> {
    const client = await clientPromise
    try {
        const cartAdditionAck = variationCode != "customSize" ? await client.db(process.env.MONGODB_DB).collection("carts").updateOne({
            prodId: new ObjectId(productId),
            userId: new ObjectId(userId)
        }, {
            $set: {
                variationCode
            },
            $inc: {
                quantity: quantity
            }
        }, { upsert: true }) : await client.db(process.env.MONGODB_DB).collection("carts").insertOne({
            prodId: new ObjectId(productId),
            userId: new ObjectId(userId),
            variationCode, customSize,
            quantity
        })
        if (cartAdditionAck.acknowledged) {
            await client.db(process.env.MONGODB_DB).collection("users").updateOne({ _id: new ObjectId(userId) }, { $inc: { cartCount: 1 } })
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