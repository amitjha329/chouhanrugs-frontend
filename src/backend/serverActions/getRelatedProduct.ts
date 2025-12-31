import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { unstable_cache } from "next/cache";

async function getRelatedProductsInternal(categoryId: string, excludeProductId: string): Promise<ProductDataModel[]> {
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

const getCachedRelatedProducts = unstable_cache(
    getRelatedProductsInternal,
    ["related-products"],
    { revalidate: 1800, tags: ["products", "related-products"] } // Cache for 30 minutes
);

export default async function getRelatedProducts(currentProduct: ProductDataModel): Promise<ProductDataModel[]> {
    return getCachedRelatedProducts(
        currentProduct.productCategory?.toString() ?? "",
        currentProduct._id?.toString() ?? ""
    );
}
