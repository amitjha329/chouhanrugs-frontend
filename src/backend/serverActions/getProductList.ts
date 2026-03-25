'use server'
import clientPromise from "@/lib/clientPromise";
// import { ProductDataModel } from "@/types/ProductDataModel";
// import converter from "@/utils/mongoObjectConversionUtility";

interface ProductEntry {
    productName: string;
    productURL: string;
    productDescriptionShort: string;
    productDescriptionLong: string;
    productSellingPrice: number;
    productMSRP: number;
    productCategory: string;
    tags: string[];
    productBaseColor: string;
    highlights: string[];
    productStockQuantity: number;
    updatedOn: number;
}

export default async function getProductListForLLMS(): Promise<ProductEntry[]> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const productsCollection = db.collection('products');
        
        return (await productsCollection.aggregate(
            [
                {
                    $sort: {
                        updatedOn: -1
                    }
                },
                {
                    $project: {
                        productName: 1,
                        productURL: 1,
                        productDescriptionShort: 1,
                        productDescriptionLong: 1,
                        productSellingPrice: 1,
                        productMSRP: 1,
                        productCategory: 1,
                        tags: 1,
                        productBaseColor: 1,
                        highlights: 1,
                        productStockQuantity: 1,
                        updatedOn: 1
                    }
                }
            ]
        ).toArray()).map(function (it) {
            const data = it as unknown as ProductEntry;
            return data
        });
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}
