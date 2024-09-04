'use server'

import clientPromise from "../mongodb/clientPromise"

export default async function getFooterLinks(): Promise<{ dataType: string, page: string, footer_links: any }> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ dataType: "footer_links",page: "footer_all" })
        return JSON.parse(JSON.stringify(data)) as { dataType: string, page: string, footer_links: any }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}