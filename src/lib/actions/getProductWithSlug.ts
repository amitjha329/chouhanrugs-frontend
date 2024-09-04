'use server';
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import { ProductDataModel } from "../types/ProductDataModel"

export default async function getProductWithSlug(slug: string): Promise<ProductDataModel | undefined> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("products").findOne({
            productURL: slug
        })
        if (data != null)
            return converter.fromWithNoFieldChange<ProductDataModel>(data)
        else
            return undefined
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}