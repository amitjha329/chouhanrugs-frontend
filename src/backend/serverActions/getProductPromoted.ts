import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export default async function getProductPromoted(category: string): Promise<ProductDataModel[]> {
    return unstable_cache(
        async () => {
            try {
                const client = await clientPromise;
                const db = client.db();

                // Find products in the same category, excluding the current product
                const relatedProducts = await db.collection("products").aggregate([
                    {
                        $match: {
                            productCategory: category,
                            tags: { $in: ["Ads"] }
                        },
                    } // Get 10 random products
                ]).toArray();

                return relatedProducts.map((p) => converter.fromWithNoFieldChange<ProductDataModel>(p));
            } catch (error) {
                console.error("Error fetching related products:", error);
                return [];
            }
        },
        [`promoted-products-${category}`],
        { tags: ['products', 'promoted-products'], revalidate: 300 }
    )()
}
