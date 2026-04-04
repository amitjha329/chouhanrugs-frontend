import { unstable_cache } from "next/cache"
import clientPromise from "@/lib/clientPromise"
import converter from "@/utils/mongoObjectConversionUtility"
import HomePageVideoSectionModel from "@/types/HomePageVideoSectionModel"

async function fetchHomePageVideoSection(): Promise<HomePageVideoSectionModel | undefined> {
    try {
        const data = await (await clientPromise)
            .db(process.env.MONGODB_DB)
            .collection("page_additional")
            .findOne({ page: "home", dataType: "home_video_banner" })
        if (data != null)
            return converter.fromWithNoFieldChange<HomePageVideoSectionModel>(data)
        else
            return undefined
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export const getHomePageVideoSection = (): Promise<HomePageVideoSectionModel | undefined> => {
    return unstable_cache(
        fetchHomePageVideoSection,
        ["home-video-section"],
        {
            revalidate: 3600,
            tags: ["home-video-section", "page-additional-home"],
        }
    )()
}
