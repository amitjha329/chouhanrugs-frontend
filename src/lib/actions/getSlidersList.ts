'use server';
import clientPromise from "../mongodb/clientPromise"
import SliderDataModel from "../types/SliderDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getSlidersList(): Promise<SliderDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("sliders").find({}).toArray()
        const parsedData: Array<SliderDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<SliderDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}