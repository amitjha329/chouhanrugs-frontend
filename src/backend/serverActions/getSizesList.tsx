import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import SizeDataModel from "@/types/SizeDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getSizesList(): Promise<SizeDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("sizes");

    try {
        const db = await getStorefrontDb();
        const colors = await db.collection("sizes").find({}).toArray();

        return colors.map(c=>converter.fromWithNoFieldChange<SizeDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
