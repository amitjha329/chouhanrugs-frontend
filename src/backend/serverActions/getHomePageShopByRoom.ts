import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { type ShopByRoomContentDataModel } from "@/types/ShopByRoomContentDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHomePageShopByRoom(): Promise<ShopByRoomContentDataModel | null> {
    "use cache";

    cacheLife("hours");
    cacheTag("home-shop-by-room");
    cacheTag("page-additional-home");

    try {
        const db = await getStorefrontDb();
        const section = await db.collection("page_additional").findOne({
            page: "home",
            dataType: "shop_by_room_content",
        });

        return section ? converter.fromWithNoFieldChange<ShopByRoomContentDataModel>(section) : null;
    } catch (error) {
        console.error("Error fetching home page shop by room section:", error);
        return null;
    }
}

export const getHomePageShopByRoom = (): Promise<ShopByRoomContentDataModel | null> => {
    return fetchHomePageShopByRoom();
};
