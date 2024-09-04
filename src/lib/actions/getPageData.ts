'use server';
import clientPromise from "../mongodb/clientPromise"
import PageMetaDataModel from "../types/PageMetaDataModel";

export default async function getPageData(pageType: string): Promise<PageMetaDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("pages").findOne({ page: pageType })
        return JSON.parse(JSON.stringify(data)) as PageMetaDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}