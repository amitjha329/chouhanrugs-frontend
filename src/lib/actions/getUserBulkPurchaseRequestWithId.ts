'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import BulkPurchaseDataModel from "../types/BulkPurchaseDataModel";

export default async function getUserBulkPurchaseRequestWithId(id: string): Promise<BulkPurchaseDataModel | undefined> {
    const mongoClient = await clientPromise
    const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("bulkRequests")
    try {
        const bulkRequest = await collectionPartnerIds.findOne({ _id: new ObjectId(id) })
        if (bulkRequest) {
            return converter.fromWithNoFieldChange<BulkPurchaseDataModel>(bulkRequest)
        } else {
            return undefined
        }
    } catch (err: any) {
        throw new Error(err)
    }
}