'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import OrderDataModel from "../types/OrderDataModel";

export default async function getUserOrderWithId(id: string): Promise<OrderDataModel | undefined> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("orders")
        const orderItem = await collectionAddr.findOne({
            _id: id as unknown as ObjectId
        })
        if (orderItem != null)
            return converter.fromWithNoFieldChange<OrderDataModel>(orderItem, "shippingAddress", "userId")
        else {
            return undefined
        }
    } catch (err: any) {
        throw new Error(err)
    }
}