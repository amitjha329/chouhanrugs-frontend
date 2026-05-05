import { cacheLife, cacheTag } from "next/cache"
import clientPromise from "@/lib/clientPromise"
import converter from "@/utils/mongoObjectConversionUtility"

async function fetchPageFooterContent(page: string): Promise<FooterContentDataModel | undefined> {
    "use cache"

    cacheLife("seconds")
    cacheTag("footer-content")
    cacheTag(`footer-${page}`)

    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page, dataType: "footer_content" })
        if (data != null)
            return converter.fromWithNoFieldChange<FooterContentDataModel>(data)
        else
            return
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export const getPageFooterContent = (page: string): Promise<FooterContentDataModel | undefined> => {
    return fetchPageFooterContent(page)
}
