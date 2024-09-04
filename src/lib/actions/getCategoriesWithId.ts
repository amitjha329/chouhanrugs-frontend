'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import CategoriesDataModel from "../types/CategoriesDataModel"
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getCategoriesWithId(id: string): Promise<CategoriesDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("categories").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<CategoriesDataModel>(data)
        else
            throw new Error("CATEGORY_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}