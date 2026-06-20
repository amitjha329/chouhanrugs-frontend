import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

import { populateProductsList } from "./populateProduct";
import { ObjectId } from "mongodb";

export default async function getProductPromoted(category: string): Promise<ProductDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("products");
    cacheTag("promoted-products");

    try {
        const db = await getStorefrontDb();

        let catQuery: any = category;
        if (ObjectId.isValid(category)) {
            catQuery = new ObjectId(category);
        } else {
            const catDoc = await db.collection("categories").findOne({ name: { $regex: new RegExp(`^${category}$`, "i") } });
            if (catDoc) {
                catQuery = { $or: [category, catDoc._id, catDoc._id.toString()] };
            }
        }

        // Find products in the same category, excluding the current product
        const relatedProducts = await db.collection("products").aggregate([
            {
                $match: {
                    productCategory: catQuery,
                    tags: { $in: ["Ads"] },
                    productActive: true
                },
            }
        ]).toArray();

        const result = relatedProducts.map((p) => converter.fromWithNoFieldChange<ProductDataModel>(p));
        await populateProductsList(result);
        return result;
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}
