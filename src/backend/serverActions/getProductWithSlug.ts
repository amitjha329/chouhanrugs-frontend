import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getProductWithSlug(slug: string): Promise<ProductDataModel | undefined> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const product = await db.collection("products").findOne({
            productURL: slug
        });
        if (product === null) {
            throw new Error("Product not found");
        }
        return converter.fromWithNoFieldChange<ProductDataModel>(product);
    } catch (error) {
        return undefined;
    }
}
