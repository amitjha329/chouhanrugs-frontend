import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchNewProductsTopSelling(limit: number): Promise<ProductDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const products = await db.collection("products").find({ tags: { $in: ["Top Selling"] } }, { limit, sort: [["_id", -1]] }).toArray();
        return products.map(p => converter.fromWithNoFieldChange<ProductDataModel>(p));
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        return [];
    }
}

export const getNewProductsTopSelling = ({ limit }: { limit: number }): Promise<ProductDataModel[]> => {
    return unstable_cache(
        () => fetchNewProductsTopSelling(limit),
        [`top-selling-products-${limit}`],
        {
            revalidate: 300, // 5 minutes
            tags: ['products', 'top-selling-products']
        }
    )();
}
