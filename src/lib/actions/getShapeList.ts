'use server';
import clientPromise from "../mongodb/clientPromise"
import ShapeDataModel from "../types/ShapeDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getShapeList(): Promise<ShapeDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("shapes").find({}).toArray()
        const parsedData: Array<ShapeDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<ShapeDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}