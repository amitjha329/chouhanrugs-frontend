'use server'

import clientPromise from "@/lib/clientPromise"
import { ObjectId } from "mongodb"

export default async function deleteUserAddress(addressId: string, userId: string) {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionAddr = db.collection("addresses")
    
    try {
        const deleteResult = await collectionAddr.deleteOne({
            _id: new ObjectId(addressId),
            userId: new ObjectId(userId) // Ensure user can only delete their own addresses
        })
        
        if (deleteResult.acknowledged && deleteResult.deletedCount > 0) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: "Address deleted successfully"
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: "Address not found or already deleted"
                }
            }
        }
    } catch (ex: any) {
        throw new Error(ex)
    }
}
