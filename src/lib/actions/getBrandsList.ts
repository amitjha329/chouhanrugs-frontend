'use server';
import clientPromise from "../mongodb/clientPromise"
import BrandDataModel from "../types/BrandDataModel"
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getBrandsList(): Promise<BrandDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("brands").find({}).toArray()
        const parsedData: Array<BrandDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<BrandDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}