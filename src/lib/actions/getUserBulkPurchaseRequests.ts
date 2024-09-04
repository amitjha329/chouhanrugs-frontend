'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import BulkPurchaseDataModel from "../types/BulkPurchaseDataModel";

export default async function getUserBulkPurchaseRequests(user: string): Promise<BulkPurchaseDataModel[]> {
    const mongoClient = await clientPromise
    const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("bulkRequests")
    try {
        const partnerIdsData = await collectionPartnerIds.find({ user }).toArray()
        return partnerIdsData.map(item => converter.fromWithNoFieldChange<BulkPurchaseDataModel>(item))
    } catch (err: any) {
        throw new Error(err)
    }
}