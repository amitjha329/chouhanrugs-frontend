'use server'

import clientPromise from "../mongodb/clientPromise"
import SiteDataModel from "../types/SiteDataModel"

export default async function getSiteData(): Promise<SiteDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOne({ data_type: "siteData" })
        return JSON.parse(JSON.stringify(data)) as SiteDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}