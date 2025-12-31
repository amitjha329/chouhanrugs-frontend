import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchNewProducts(limit: number): Promise<ProductDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
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
    return unstable_cache(
        () => fetchNewProducts(limit),
        [`new-products-${limit}`],
        {
            revalidate: 300, // 5 minutes
            tags: ['products', 'new-products']
        }
    )();
}
