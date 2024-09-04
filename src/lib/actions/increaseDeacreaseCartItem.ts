'use server'

import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function increaseDeacreaseCartItem(itemID: string, quantity: number): Promise<AckResponse> {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionCart = db.collection("carts")
    try {
        const cartToUpdate = {
            _id: new ObjectId(itemID)
        }
        const cartData = {
            $inc: {
                quantity: quantity
            }
        }
        const addCartResult = await collectionCart.updateOne(cartToUpdate, cartData)
        console.log(cartToUpdate)
        if (addCartResult.acknowledged) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(addCartResult)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(addCartResult)
                }
            }
        }
    } catch (err: any) {
        throw new Error(err)
    }
}