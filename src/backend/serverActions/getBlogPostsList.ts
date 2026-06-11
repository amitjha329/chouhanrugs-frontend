import { cacheLife, cacheTag } from 'next/cache'
import clientPromise from "@/lib/clientPromise"
import BlogDataModel from "@/types/BlogDataModel"
import converter from "@/utils/mongoObjectConversionUtility"

export default async function getBlogPostsList(
    page: number = 1,
    limit: number = 6
): Promise<{ blogs: BlogDataModel[]; totalCount: number }> {
    "use cache"

    cacheLife("hours")
    cacheTag("blogs")

    const mongoClient = await clientPromise
    const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("blogs")
    try {
        const query = { draft: { $ne: true } }
        const totalCount = await collectionPartnerIds.countDocuments(query)

        const partnerIdsData = await collectionPartnerIds
            .find(query)
            .sort({ posted: -1, updated: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray()

        const returnData = new Array<BlogDataModel>()
        partnerIdsData.forEach(item => {
            returnData.push(converter.fromWithNoFieldChange<BlogDataModel>(item))
        })
        return { blogs: returnData, totalCount }
    } catch (err: any) {
        throw new Error(err)
    }
}
