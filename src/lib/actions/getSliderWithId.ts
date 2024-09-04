'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import SliderDataModel from "../types/SliderDataModel";

export default async function getSliderWithId(id: number): Promise<SliderDataModel> {
    console.log(id)
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("sliders").findOne({ slideId: id })
        if (data != null)
            return converter.fromWithNoFieldChange<SliderDataModel>(data)
        else
            throw new Error("COLOR_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}