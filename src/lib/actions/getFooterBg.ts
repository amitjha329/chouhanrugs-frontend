'use server'

import clientPromise from "../mongodb/clientPromise"

export default async function getFooterBg(): Promise<{ dataType: string, page: string, footer_bg: string }> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ dataType: "footer_links", page: "footer_all" })
        return JSON.parse(JSON.stringify(data)) as { dataType: string, page: string, footer_bg: string }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}