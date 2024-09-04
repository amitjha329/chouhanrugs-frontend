'use server'
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import UserProfileDataModel from "../types/UserProfileDataModel";

export default async function getUsersList(): Promise<UserProfileDataModel[]> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("users")
        const orderItems = await collectionAddr.find({}).sort({ _id: -1 }).toArray()
        const returnArray: UserProfileDataModel[] = orderItems.map(item => converter.fromWithNoFieldChange<UserProfileDataModel>(item))
        return returnArray
    } catch (err: any) {
        throw new Error(err)
    }
}