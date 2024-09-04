'use server';
import clientPromise from "../mongodb/clientPromise"
import ColorDataModel from "../types/ColorDataModel"
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getColorsList(): Promise<ColorDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("colors").find({}).toArray()
        const parsedData: Array<ColorDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<ColorDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}