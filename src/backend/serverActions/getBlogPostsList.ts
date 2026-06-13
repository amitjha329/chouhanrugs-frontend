'use server'

import { unstable_cache } from 'next/cache'
import clientPromise from "@/lib/clientPromise"
import BlogDataModel from "@/types/BlogDataModel"
import converter from "@/utils/mongoObjectConversionUtility"

export default async function getBlogPostsList(): Promise<BlogDataModel[]> {
    return unstable_cache(
        async () => {
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
        },
        ['blog-posts-list'],
        { tags: ['blogs'], revalidate: 3600 }
    )()
}