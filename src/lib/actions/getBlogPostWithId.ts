'use server'
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import BlogDataModel from "../types/BlogDataModel";
import converter from "../utilities/mongoObjectConversionUtility";

export default async function getBlogPostWithId(id: string): Promise<BlogDataModel> {
    const mongoClient = await clientPromise
    const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("blogs")
    try {
        const partnerIdsData = await collectionPartnerIds.findOne({ _id: new ObjectId(id) })
        if (partnerIdsData != null) {
            return converter.fromWithNoFieldChange<BlogDataModel>(partnerIdsData)
        } else {
            throw new Error("Data not Found")
        }
    } catch (err: any) {
        throw new Error(err)
    }
}