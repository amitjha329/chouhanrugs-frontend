import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchProductsByCategory(category: string, limit: number): Promise<ProductDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const products = await db.collection("products").aggregate([
            { $match: { productCategory: category, productActive: true } },
            { $sample: { size: limit } },
        ]).toArray();
        return products.map(p => converter.fromWithNoFieldChange<ProductDataModel>(p));
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return [];
    }
}

export const getProductsByCategory = (category: string, limit: number): Promise<ProductDataModel[]> => {
    return unstable_cache(
        () => fetchProductsByCategory(category, limit),
        [`products-by-category-${category}-${limit}`],
        {
            revalidate: 300,
            tags: ['products', `category-${category}`]
        }
    )();
}
