import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { type HomePagePopularCategoriesModel } from "@/types/HomePagePopularCategoriesModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHomePagePopularCategories(): Promise<HomePagePopularCategoriesModel | null> {
    "use cache";

    cacheLife("hours");
    cacheTag("home-popular-categories");
    cacheTag("page-additional-home");

    try {
        const db = await getStorefrontDb();
        const section = await db.collection("page_additional").findOne({
            page: "home",
            dataType: "popular_categories",
        });

        return section ? converter.fromWithNoFieldChange<HomePagePopularCategoriesModel>(section) : null;
    } catch (error) {
        console.error("Error fetching home page popular categories:", error);
        return null;
    }
}

export const getHomePagePopularCategories = (): Promise<HomePagePopularCategoriesModel | null> => {
    return fetchHomePagePopularCategories();
};
