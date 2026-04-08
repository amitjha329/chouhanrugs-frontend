'use server'

import { unstable_cache } from 'next/cache'
import clientPromise from "@/lib/clientPromise"
import BlogDataModel from "@/types/BlogDataModel"
import converter from "@/utils/mongoObjectConversionUtility"

export default async function getBlogPostWithSlug(slug: string): Promise<BlogDataModel> {
    return unstable_cache(
        async () => {
            const mongoClient = await clientPromise
            const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("blogs")
            try {
                const partnerIdsData = await collectionPartnerIds.findOne({ slug })
                if (partnerIdsData != null) {
                    return converter.fromWithNoFieldChange<BlogDataModel>(partnerIdsData)
                } else {
                    throw new Error("Data not Found")
                }
            } catch (err: any) {
                throw new Error(err)
            }
        },
        [`blog-post-${slug}`],
        { tags: ['blogs', `blog-${slug}`], revalidate: 3600 }
    )()
}