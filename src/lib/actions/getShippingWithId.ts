'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import ShippingDataModel from "../types/ShippingDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getShippingWithId(id: string): Promise<ShippingDataModel | undefined> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("shipping").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<ShippingDataModel>(data)
        else return undefined
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}