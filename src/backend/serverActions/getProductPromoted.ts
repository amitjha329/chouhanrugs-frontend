import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export default async function getProductPromoted(category: string): Promise<ProductDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("products");
    cacheTag("promoted-products");

    try {
        const db = await getStorefrontDb();

        // Find products in the same category, excluding the current product
        const relatedProducts = await db.collection("products").aggregate([
            {
                $match: {
                    productCategory: category,
                    tags: { $in: ["Ads"] },
                    productActive: true
                },
            } // Get 10 random products
        ]).toArray();

        return relatedProducts.map((p) => converter.fromWithNoFieldChange<ProductDataModel>(p));
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}
