'use server'

import { unstable_cache } from 'next/cache'
import clientPromise from "@/lib/clientPromise"
import BlogDataModel from "@/types/BlogDataModel"
import converter from "@/utils/mongoObjectConversionUtility"

export default async function getBlogPostsList(
    page: number = 1,
    limit: number = 6
): Promise<{ blogs: BlogDataModel[]; totalCount: number }> {
    return unstable_cache(
        async () => {
            const mongoClient = await clientPromise
            const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("blogs")
            try {
                const query = { draft: { $ne: true } }
                const totalCount = await collectionPartnerIds.countDocuments(query)

                const skip = (page - 1) * limit
                const partnerIdsData = await collectionPartnerIds
                    .find(query)
                    .sort({ posted: -1, updated: -1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray()

                const blogs = new Array<BlogDataModel>()
                partnerIdsData.forEach(item => {
                    blogs.push(converter.fromWithNoFieldChange<BlogDataModel>(item))
                })
                return { blogs, totalCount }
            } catch (err: any) {
                throw new Error(err)
            }
        },
        ['blog-posts-list', String(page), String(limit)],
        { tags: ['blogs'], revalidate: 3600 }
    )()
}