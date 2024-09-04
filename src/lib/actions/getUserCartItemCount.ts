'use server';
import clientPromise from "../mongodb/clientPromise"
import { ObjectId } from "mongodb";

export default async function getUserCartItemCount(userId: string): Promise<{
    cartItemCount: number
}> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("carts").countDocuments({
            userId: new ObjectId(userId)
        })
        return {
            cartItemCount: data
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}