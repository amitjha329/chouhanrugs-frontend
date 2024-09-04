'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import CategoriesDataModel from "../types/CategoriesDataModel";
import converter from "../utilities/mongoObjectConversionUtility";
import { ProductDataModel } from "../types/ProductDataModel";

export default async function getCategoryandItsPopularProduct(id: string): Promise<{ catrgory: CategoriesDataModel, product: ProductDataModel[] }> {
    const db = (await clientPromise).db(process.env.MONGODB_DB)
    try {
        const cat = converter.fromWithNoFieldChange<CategoriesDataModel>((await db.collection("categories").findOne({ _id: new ObjectId(id) }))!)
        const prod = await db.collection("products").find({
            productCategory: `${cat.name}`,
            tags: { $in: ["Top Selling"] }
        }, { limit: 3 }).toArray()
        return {
            catrgory: cat,
            product: prod.map(e => converter.fromWithNoFieldChange<ProductDataModel>(e))
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}