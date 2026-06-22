import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { cacheLife, cacheTag } from "next/cache";
import { populateProductsList } from "./populateProduct";
import { ObjectId } from "mongodb";

async function getRelatedProductsInternal(categoryId: string, excludeProductId: string): Promise<ProductDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("products");
    cacheTag("related-products");

    try {
        const db = await getStorefrontDb();

        let catQuery: any = categoryId;
        if (ObjectId.isValid(categoryId)) {
            const catDoc = await db.collection("categories").findOne({ _id: new ObjectId(categoryId) });
            const catName = catDoc?.name || categoryId;
            catQuery = { $in: [categoryId, new ObjectId(categoryId), catName] };
        } else {
            const catDoc = await db.collection("categories").findOne({ name: { $regex: new RegExp(`^${categoryId}$`, "i") } });
            if (catDoc) {
                catQuery = { $in: [categoryId, catDoc._id, catDoc._id.toString()] };
            }
        }

        // Find products in the same category, excluding the current product
        const filterId = ObjectId.isValid(excludeProductId) ? new ObjectId(excludeProductId) : excludeProductId;
        const relatedProducts = await db.collection("products").aggregate([
            {
                $match: {
                    productCategory: catQuery,
                    _id: { $ne: filterId },
                    productActive: true
                },
            },
            { $sample: { size: 10 } }, // Get 10 random products
        ]).toArray();

        const result = relatedProducts.map((p) => converter.fromWithNoFieldChange<ProductDataModel>(p));
        await populateProductsList(result);
        return result;
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}

export default async function getRelatedProducts(currentProduct: ProductDataModel): Promise<ProductDataModel[]> {
    return getRelatedProductsInternal(
        currentProduct.productCategory?.toString() ?? "",
        currentProduct._id?.toString() ?? ""
    );
}
