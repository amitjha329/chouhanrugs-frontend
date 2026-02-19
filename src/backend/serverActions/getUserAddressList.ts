'use server'
import { connection } from 'next/server'
import clientPromise from "@/lib/clientPromise";
import UserAddressDataModel from "@/types/UserAddressDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { ObjectId } from "mongodb";

export default async function getUserAddressList(userId: string): Promise<UserAddressDataModel[]> {
    await connection()
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("addresses")
        const addrItems = await collectionAddr.find({
            userId: ObjectId.createFromHexString(userId)
        }).toArray()
        const returnArray: UserAddressDataModel[] = []
        addrItems.forEach(item => returnArray.push(converter.fromWithNoFieldChange<UserAddressDataModel>(item)))
        return returnArray
    } catch (err: any) {
        throw new Error(err)
    }
}