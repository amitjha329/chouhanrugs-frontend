import { cacheLife, cacheTag } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import PageMetaDataModel from "@/types/PageMetaDataModel";

async function fetchPageData(pageType: string): Promise<PageMetaDataModel> {
    "use cache";

    cacheLife("seconds");
    cacheTag("pages");
    cacheTag(`page-${pageType}`);

    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("pages").findOne({ page: pageType })
        return JSON.parse(JSON.stringify(data)) as PageMetaDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

const getPageData = (pageType: string): Promise<PageMetaDataModel> => {
    return fetchPageData(pageType)
}

export default getPageData
