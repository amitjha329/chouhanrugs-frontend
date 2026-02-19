'use server'
import { connection } from 'next/server'

import clientPromise from "@/lib/clientPromise"
import UserAddressDataModel from "@/types/UserAddressDataModel"
import { ObjectId } from "mongodb"

export default async function updateUserAddress(addressData: UserAddressDataModel) {
    await connection()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionAddr = db.collection("addresses")
    
    try {
        const { _id, userId, active, ...parsedData } = addressData
        
        const updateData = {
            ...parsedData,
            userId: new ObjectId(userId),
            active: active ?? true
        }
        
        const updateResult = await collectionAddr.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        )
        
        if (updateResult.acknowledged && updateResult.modifiedCount > 0) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(updateResult)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: "Address not found or no changes made"
                }
            }
        }
    } catch (ex: any) {
        throw new Error(ex)
    }
}
