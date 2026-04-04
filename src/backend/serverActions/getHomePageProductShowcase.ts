import { unstable_cache } from "next/cache"
import clientPromise from "@/lib/clientPromise"
import converter from "@/utils/mongoObjectConversionUtility"
import HomePageProductShowcaseModel from "@/types/HomePageProductShowcaseModel"

async function fetchHomePageProductShowcase(): Promise<HomePageProductShowcaseModel | undefined> {
    try {
        const data = await (await clientPromise)
            .db(process.env.MONGODB_DB)
            .collection("page_additional")
            .findOne({ page: "home", dataType: "product_showcase" })
        if (data != null)
            return converter.fromWithNoFieldChange<HomePageProductShowcaseModel>(data)
        else
            return undefined
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export const getHomePageProductShowcase = (): Promise<HomePageProductShowcaseModel | undefined> => {
    return unstable_cache(
        fetchHomePageProductShowcase,
        ["home-product-showcase"],
        {
            revalidate: 3600,
            tags: ["home-product-showcase", "page-additional-home"],
        }
    )()
}
