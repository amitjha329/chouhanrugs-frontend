import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { type OrderProcessStepsDataModel } from "@/types/OrderProcessStepsDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHomePageOrderProcessInformation(): Promise<OrderProcessStepsDataModel | null> {
    "use cache";

    cacheLife("hours");
    cacheTag("home-order-process");
    cacheTag("page-additional-home");

    try {
        const db = await getStorefrontDb();
        const section = await db.collection("page_additional").findOne({
            page: "home",
            dataType: "order_process_content",
        });

        return section ? converter.fromWithNoFieldChange<OrderProcessStepsDataModel>(section) : null;
    } catch (error) {
        console.error("Error fetching home page order process info:", error);
        return null;
    }
}

export const getHomePageOrderProcessInformation = (): Promise<OrderProcessStepsDataModel | null> => {
    return fetchHomePageOrderProcessInformation();
};
