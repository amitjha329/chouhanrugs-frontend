import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { type HomePageBannerSectionModel } from "@/types/HomePageBannerSectionModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHomePageBannerSection(): Promise<HomePageBannerSectionModel | null> {
    "use cache";

    cacheLife("hours");
    cacheTag("home-banner-section");
    cacheTag("page-additional-home");

    try {
        const db = await getStorefrontDb();
        const section = await db.collection("page_additional").findOne({
            page: "home",
            dataType: "right_image_banner",
        });

        return section ? converter.fromWithNoFieldChange<HomePageBannerSectionModel>(section) : null;
    } catch (error) {
        console.error("Error fetching home page banner section:", error);
        return null;
    }
}

export const getHomePageBannerSection = (): Promise<HomePageBannerSectionModel | null> => {
    return fetchHomePageBannerSection();
};
