import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import ColorDataModel from "@/types/ColorDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getColorsList(): Promise<ColorDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("colors");

    try {
        const db = await getStorefrontDb();
        const colors = await db.collection("colors").find({}).toArray();

        return colors.map(c=>converter.fromWithNoFieldChange<ColorDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
