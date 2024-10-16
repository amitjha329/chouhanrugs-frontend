import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export default async function getRelatedProducts(currentProduct: ProductDataModel): Promise<ProductDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Find products in the same category, excluding the current product
        const relatedProducts = await db.collection("products").aggregate([
            {
                $match: {
                    productCategory: currentProduct.productCategory,
                    _id: { $ne: currentProduct._id }, // Exclude the current product
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
