import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { type HomePageProductShowcaseModel } from "@/types/HomePageProductShowcaseModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHomePageProductShowcase(): Promise<HomePageProductShowcaseModel | null> {
    "use cache";

    cacheLife("hours");
    cacheTag("home-product-showcase");
    cacheTag("page-additional-home");

    try {
        const db = await getStorefrontDb();
        const section = await db.collection("page_additional").findOne({
            page: "home",
            dataType: "product_showcase",
        });

        return section ? converter.fromWithNoFieldChange<HomePageProductShowcaseModel>(section) : null;
    } catch (error) {
        console.error("Error fetching home page product showcase:", error);
        return null;
    }
}

export const getHomePageProductShowcase = (): Promise<HomePageProductShowcaseModel | null> => {
    return fetchHomePageProductShowcase();
};
