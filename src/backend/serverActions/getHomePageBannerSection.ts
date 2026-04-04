import { unstable_cache } from "next/cache"
import clientPromise from "@/lib/clientPromise"
import converter from "@/utils/mongoObjectConversionUtility"
import HomePageBannerSectionModel from "@/types/HomePageBannerSectionModel"

async function fetchHomePageBannerSection(): Promise<HomePageBannerSectionModel | undefined> {
    try {
        const data = await (await clientPromise)
            .db(process.env.MONGODB_DB)
            .collection("page_additional")
            .findOne({ page: "home", dataType: "right_image_banner" })
        if (data != null)
            return converter.fromWithNoFieldChange<HomePageBannerSectionModel>(data)
        else
            return undefined
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export const getHomePageBannerSection = (): Promise<HomePageBannerSectionModel | undefined> => {
    return unstable_cache(
        fetchHomePageBannerSection,
        ["home-banner-section"],
        {
            revalidate: 3600,
            tags: ["home-banner-section", "page-additional-home"],
        }
    )()
}
