import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { type HomePageVideoSectionModel } from "@/types/HomePageVideoSectionModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHomePageVideoSection(): Promise<HomePageVideoSectionModel | null> {
    "use cache";

    cacheLife("hours");
    cacheTag("home-video-section");
    cacheTag("page-additional-home");

    try {
        const db = await getStorefrontDb();
        const section = await db.collection("page_additional").findOne({
            page: "home",
            dataType: "home_video_banner",
        });

        return section ? converter.fromWithNoFieldChange<HomePageVideoSectionModel>(section) : null;
    } catch (error) {
        console.error("Error fetching home page video section:", error);
        return null;
    }
}

export const getHomePageVideoSection = (): Promise<HomePageVideoSectionModel | null> => {
    return fetchHomePageVideoSection();
};
