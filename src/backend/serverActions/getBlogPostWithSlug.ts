'use server'

import { connection } from 'next/server'
import clientPromise from "@/lib/clientPromise"
import BlogDataModel from "@/types/BlogDataModel"
import converter from "@/utils/mongoObjectConversionUtility"

export default async function getBlogPostWithSlug(slug: string): Promise<BlogDataModel> {
    await connection()
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
}