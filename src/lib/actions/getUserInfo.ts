'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import UserProfileDataModel from "../types/UserProfileDataModel";

export default async function getUserInfo(id: string): Promise<UserProfileDataModel | undefined> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("users")
        const orderItem = await collectionAddr.findOne({
            _id: new ObjectId(id)
        })
        if (orderItem != null)
            return converter.fromWithNoFieldChange<UserProfileDataModel>(orderItem)
        else {
            return undefined
        }
    } catch (err: any) {
        throw new Error(err)
    }
}