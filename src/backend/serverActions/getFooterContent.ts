import clientPromise from "@/lib/clientPromise"
import converter from "@/utils/mongoObjectConversionUtility"

export async function getPageFooterContent(page: string): Promise<FooterContentDataModel | undefined> {
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