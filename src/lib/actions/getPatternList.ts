'use server';
import clientPromise from "../mongodb/clientPromise"
import PatternDataModel from "../types/PatternDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getPatternList(): Promise<PatternDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("patterns").find({}).toArray()
        const parsedData: Array<PatternDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<PatternDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}