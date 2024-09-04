'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import UserAddressDataModel from "../types/UserAddressDataModel";
import converter from "../utilities/mongoObjectConversionUtility";

export default async function getUserAddressWithId(id: string): Promise<UserAddressDataModel> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("addresses")
        const addrItems = await collectionAddr.findOne({
            _id: new ObjectId(id)
        })
        if (addrItems != null)
            return converter.fromWithNoFieldChange<UserAddressDataModel>(addrItems)
        else {
            throw new Error("Data not Found")
        }
    } catch (err: any) {
        throw new Error(err)
    }
}