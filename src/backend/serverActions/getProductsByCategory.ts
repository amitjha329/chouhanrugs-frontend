import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

import { populateProductsList } from "./populateProduct";
import { ObjectId } from "mongodb";

async function fetchProductsByCategory(category: string, limit: number): Promise<ProductDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("products");
    cacheTag(`category-${category}`);

    try {
        const db = await getStorefrontDb();
        
        let catQuery: any = category;
        if (ObjectId.isValid(category)) {
            catQuery = new ObjectId(category);
        } else {
            const catDoc = await db.collection("categories").findOne({ name: { $regex: new RegExp(`^${category}$`, "i") } });
            if (catDoc) {
                catQuery = { $in: [category, catDoc._id, catDoc._id.toString()] };
            }
        }

        const products = await db.collection("products").aggregate([
            { $match: { productCategory: catQuery, productActive: true } },
            { $sample: { size: limit } },
        ]).toArray();
        const result = products.map(p => converter.fromWithNoFieldChange<ProductDataModel>(p));
        await populateProductsList(result);
        return result;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return [];
    }
}

export const getProductsByCategory = (category: string, limit: number): Promise<ProductDataModel[]> => {
    return fetchProductsByCategory(category, limit);
}
