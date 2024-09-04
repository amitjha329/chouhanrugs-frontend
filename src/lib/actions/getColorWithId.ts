'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import ColorDataModel from "../types/ColorDataModel"
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getColorsWithId(id: string): Promise<ColorDataModel> {
    console.log(id)
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("colors").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<ColorDataModel>(data)
        else
            throw new Error("COLOR_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}