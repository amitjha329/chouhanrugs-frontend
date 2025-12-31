import { unstable_cache } from "next/cache"
import clientPromise from "@/lib/clientPromise"
import SiteDataModel from "@/types/SiteDataModel"

async function fetchSiteData(): Promise<SiteDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOne({ data_type: "siteData" })
        return JSON.parse(JSON.stringify(data)) as SiteDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

const getSiteData = unstable_cache(
    fetchSiteData,
    ['site-data'],
    {
        revalidate: 3600, // 1 hour - site data changes rarely
        tags: ['site-data']
    }
)

export default getSiteData