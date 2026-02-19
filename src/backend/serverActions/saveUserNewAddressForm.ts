'use server'
import { connection } from 'next/server'

import clientPromise from "@/lib/clientPromise"
import UserAddressDataModel from "@/types/UserAddressDataModel"
import { ObjectId } from "mongodb"

export default async function saveUserNewAddressForm(addressData: UserAddressDataModel) {
    await connection()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionAddr = db.collection("addresses")
    const { _id, userId, active, ...parsedData } = addressData
    try {
        const inserData = {
            _id: new ObjectId(),
            ...parsedData,
            userId: new ObjectId(userId),
            active: true
        }
        const addAddressResult = await collectionAddr.insertOne(inserData)
        if (addAddressResult.acknowledged) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(addAddressResult)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(addAddressResult)
                }
            }
        }
    } catch (ex: any) {
        throw new Error(ex)
    }
}