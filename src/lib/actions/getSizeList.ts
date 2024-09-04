'use server';
import clientPromise from "../mongodb/clientPromise"
import SizeDataModel from "../types/SizeDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getSizeList(): Promise<SizeDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("sizes").find({}).toArray()
        const parsedData: Array<SizeDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<SizeDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}