import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import CategoriesDataModel from "@/types/CategoriesDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getCategoriesTop(): Promise<CategoriesDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("categories");

    try {
        const db = await getStorefrontDb();
        const categories = await db.collection("categories").find({  active: true }).toArray();

        return categories.map(c=>converter.fromWithNoFieldChange<CategoriesDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
