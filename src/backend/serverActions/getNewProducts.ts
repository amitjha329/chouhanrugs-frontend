import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getNewProducts({ limit }: { limit: number }): Promise<ProductDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const products = await db.collection("products").aggregate([
            { $match: { tags: { $in: ["New Arrivals"] }, productActive: true } },
            { $sample: { size: limit } }
        ]).toArray();
        return products.map(p => converter.fromWithNoFieldChange<ProductDataModel>(p));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
