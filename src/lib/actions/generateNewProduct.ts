'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewProduct(): Promise<string> {
    const draftProduct = {
        _id: new ObjectId(),
        addedOn: Date.now(),
        updatedOn: Date.now(),
        careInstructions: [],
        highlights: [],
        images: [],
        productActive: false,
        productBaseColor: "{}",
        productBrand: "",
        productCategory: "",
        productCustomizable: false,
        productDescriptionLong: "",
        productDescriptionShort: "",
        productDiscountPercentage: "",
        productFreeDel: false,
        productHandCrafted: false,
        productMSRP: 0,
        productName: "Untitled",
        productPriceSqFt: 0,
        productPrimaryImageIndex: 0,
        productReturns: false,
        productReviews: {
            average: 0,
            reviews: [],
            totalReviews: 0
        },
        productSellingPrice: 0,
        productShippingInfo: "",
        productStockQuantity: 0,
        productURL: "",
        tags: [],
        variations: [],
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("products").insertOne(draftProduct)
    return insertedDoc.insertedId.toString()
}