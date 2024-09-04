'use server';
import clientPromise from "../mongodb/clientPromise"
import ShippingDataModel from "../types/ShippingDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getShippingList(): Promise<ShippingDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("shipping").find({}).toArray()
        const parsedData: Array<ShippingDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<ShippingDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}