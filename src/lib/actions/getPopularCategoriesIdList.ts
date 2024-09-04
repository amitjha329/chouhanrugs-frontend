'use server';
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getPopularCategoriesIdList(): Promise<{ _id: string }[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("categories").find({ popular: true }).toArray()
        const parsedData: Array<{ _id: string }> = []
        data.forEach(item => {
            parsedData.push({ _id: converter.fromWithNoFieldChange<{ _id: string }>(item)._id })
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}