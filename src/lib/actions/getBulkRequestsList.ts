'use server';
import clientPromise from "../mongodb/clientPromise"
import BulkPurchaseDataModel from "../types/BulkPurchaseDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getBulkRequestsList(): Promise<BulkPurchaseDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("bulkRequests").find({}).sort({ requestDate: -1 }).toArray()
        const parsedData: Array<BulkPurchaseDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<BulkPurchaseDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}