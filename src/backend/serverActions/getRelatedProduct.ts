import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { cacheLife, cacheTag } from "next/cache";

async function getRelatedProductsInternal(categoryId: string, excludeProductId: string): Promise<ProductDataModel[]> {
    "use cache";

    cacheLife("seconds");
    cacheTag("products");
    cacheTag("related-products");

    try {
        const client = await clientPromise;
        const db = client.db();

        // Find products in the same category, excluding the current product
        const relatedProducts = await db.collection("products").aggregate([
            {
                $match: {
                    productCategory: categoryId,
                    _id: { $ne: excludeProductId },
                },
            },
            { $sample: { size: 10 } }, // Get 10 random products
        ]).toArray();

        return relatedProducts.map((p) => converter.fromWithNoFieldChange<ProductDataModel>(p));
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
