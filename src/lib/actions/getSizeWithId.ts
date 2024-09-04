'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import SizeDataModel from "../types/SizeDataModel";

export default async function getSizeWithId(id: string): Promise<SizeDataModel> {
    console.log(id)
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("sizes").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<SizeDataModel>(data)
        else
            throw new Error("COLOR_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}