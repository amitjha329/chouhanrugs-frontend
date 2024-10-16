'use server'

import clientPromise from "@/lib/clientPromise"
import BlogDataModel from "@/types/BlogDataModel"
import converter from "@/utils/mongoObjectConversionUtility"

export default async function getBlogPostsList(): Promise<BlogDataModel[]> {
    const mongoClient = await clientPromise
    const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("blogs")
    try {
        const partnerIdsData = await collectionPartnerIds.find({}).toArray()
        const returnData = new Array<BlogDataModel>()
        partnerIdsData.forEach(item => {
            returnData.push(converter.fromWithNoFieldChange<BlogDataModel>(item))
        })
        return returnData
    } catch (err: any) {
        throw new Error(err)
    }
}