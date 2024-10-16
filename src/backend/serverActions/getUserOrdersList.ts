'use server'
import clientPromise from "@/lib/clientPromise";
import OrderDataModel from "@/types/OrderDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { ObjectId } from "mongodb";

export default async function getUserOrdersList(userId: string): Promise<OrderDataModel[]> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("orders")
        const orderItems = await collectionAddr.find({
            userId: new ObjectId(userId)
        }).toArray()
        const returnArray: OrderDataModel[] = orderItems.map(item => converter.fromWithNoFieldChange<OrderDataModel>(item, "shippingAddress", "userId"))
        return returnArray
    } catch (err: any) {
        throw new Error(err)
    }
}