'use server';
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import { ProductDataModel, ProductDataModelWithColorMap } from "../types/ProductDataModel"
import getColorMapForProductList from "./getColorMapForProductList";

export default async function getProductWithId(id: string): Promise<ProductDataModelWithColorMap|null> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("products").findOne({ _id: new ObjectId(id) })
        if (data != null) {
            const colorData = await getColorMapForProductList([data._id.toHexString()])
            return {
                ...converter.fromWithNoFieldChange<ProductDataModel>(data),
                colorMap: colorData.get(data._id.toHexString()) ?? []
            }
        } else
            return null
    } catch (error) {
        console.error(error)
        return null
    }
}