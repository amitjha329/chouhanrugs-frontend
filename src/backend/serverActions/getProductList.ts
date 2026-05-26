'use server'
import clientPromise from "@/lib/clientPromise";
import { LocalizedField } from "@/lib/resolveLocalized";
// import { ProductDataModel } from "@/types/ProductDataModel";
// import converter from "@/utils/mongoObjectConversionUtility";

interface ProductEntry {
    productName: LocalizedField<string>;
    productTitle?: LocalizedField<string>;
    metaTitle?: LocalizedField<string>;
    metaDescription?: LocalizedField<string>;
    productURL: LocalizedField<string>;
    productDescriptionShort: LocalizedField<string>;
    productDescriptionLong: LocalizedField<string>;
    productSellingPrice: number;
    productMSRP: number;
    productCategory: string;
    tags: string[];
    productBaseColor: string;
    highlights: LocalizedField<string[]>;
    productStockQuantity: number;
    productFeaturedImage?: string;
    images?: string[];
    productBrand?: string;
    sku?: string;
    gtin?: string;
    itemCode?: string;
    productStatus?: string;
    visibility?: string;
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
                    $match: {
                        productActive: true,
                        productStatus: { $nin: ["Draft", "Archived"] },
                        visibility: { $nin: ["hidden", "Hidden"] }
                    }
                },
                {
                    $sort: {
                        updatedOn: -1
                    }
                },
                {
                    $project: {
                        productName: 1,
                        productTitle: 1,
                        metaTitle: 1,
                        metaDescription: 1,
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
                        productFeaturedImage: 1,
                        images: 1,
                        productBrand: 1,
                        sku: 1,
                        gtin: 1,
                        itemCode: 1,
                        productStatus: 1,
                        visibility: 1,
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
