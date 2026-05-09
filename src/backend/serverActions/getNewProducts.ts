import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchNewProducts(limit: number): Promise<ProductDataModel[]> {
    "use cache";

    cacheLife("seconds");
    cacheTag("products");
    cacheTag("new-products");

    try {
        const db = await getStorefrontDb();
        const products = await db.collection("products").aggregate([
            { $match: { tags: { $in: ["New Arrivals"] }, productActive: true } },
            { $sample: { size: limit } }
        ]).toArray();
        return products.map(p => converter.fromWithNoFieldChange<ProductDataModel>(p));
    } catch (error) {
        console.error("Error fetching new products:", error);
        return [];
    }
}

export const getNewProducts = ({ limit }: { limit: number }): Promise<ProductDataModel[]> => {
    return fetchNewProducts(limit);
}
