import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import PageMetaDataModel from "@/types/PageMetaDataModel";

async function fetchPageData(pageType: string): Promise<PageMetaDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("pages").findOne({ page: pageType })
        return JSON.parse(JSON.stringify(data)) as PageMetaDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

const getPageData = (pageType: string): Promise<PageMetaDataModel> => {
    return unstable_cache(
        () => fetchPageData(pageType),
        [`page-data-${pageType}`],
        {
            revalidate: 3600, // 1 hour - page metadata changes rarely
            tags: ['pages', `page-${pageType}`]
        }
    )()
}

export default getPageData