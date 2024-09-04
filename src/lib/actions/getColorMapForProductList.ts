'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import ColorDataModel from "../types/ColorDataModel";
import { Variation } from "../types/ProductDataModel";
import { stringNotEmptyOrNull } from "../utilities/stringEmptyOrNull";

export default async function getColorMapForProductList(idList: string[]): Promise<Map<string, ColorDataModel[]>> {
    try {
        const db = (await clientPromise).db(process.env.MONGODB_DB)
        const productCollection = db.collection("products")
        const colorsCollection = db.collection("colors")
        const returnData = new Map<string, ColorDataModel[]>()
        const listofProducts = await productCollection.find({
            $and: [
                { "variations.variationColor": { $ne: null } },
                { _id: { $in: idList.map(id => new ObjectId(id)) } }
            ]
        }).toArray()
        for (const item of listofProducts) {
            const colors = item.variations.map((elem: Variation) => stringNotEmptyOrNull(elem.variationColor) && elem.variationColor)
            const colorsData = await colorsCollection.find({
                name: {
                    $in: colors.filter((item: string,
                        index: number) => colors.indexOf(item) === index)
                }
            }).toArray()
            returnData.set(item._id.toHexString(), colorsData.map(color => converter.fromWithNoFieldChange<ColorDataModel>(color)))
        }
        return returnData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}