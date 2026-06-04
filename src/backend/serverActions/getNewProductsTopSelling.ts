import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchNewProductsTopSelling(limit: number): Promise<ProductDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("products");
    cacheTag("top-selling-products");

    try {
        const db = await getStorefrontDb();
        const products = await db.collection("products").find({ tags: { $in: ["Top Selling"] }, productActive: true }, { limit, sort: [["_id", -1]] }).toArray();
        return products.map(p => converter.fromWithNoFieldChange<ProductDataModel>(p));
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        return [];
    }
}

export const getNewProductsTopSelling = ({ limit }: { limit: number }): Promise<ProductDataModel[]> => {
    return fetchNewProductsTopSelling(limit);
}
