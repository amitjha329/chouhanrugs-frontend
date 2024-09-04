'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import UserAddressDataModel from "../types/UserAddressDataModel";
import converter from "../utilities/mongoObjectConversionUtility";

export default async function getUserAddressList(userId: string): Promise<UserAddressDataModel[]> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("addresses")
        const addrItems = await collectionAddr.find({
            userId: new ObjectId(userId)
        }).toArray()
        const returnArray: UserAddressDataModel[] = []
        addrItems.forEach(item => returnArray.push(converter.fromWithNoFieldChange<UserAddressDataModel>(item)))
        return returnArray
    } catch (err: any) {
        throw new Error(err)
    }
}