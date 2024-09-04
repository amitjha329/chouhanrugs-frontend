'use server';
import clientPromise from "../mongodb/clientPromise"
import TagDataModel from "../types/TagDataModel"
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getTagsList(): Promise<TagDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("tags").find({}).toArray()
        const parsedData: Array<TagDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<TagDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}