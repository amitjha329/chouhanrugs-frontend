'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import BrandDataModel from "../types/BrandDataModel";

export default async function getBrandWithId(id: string): Promise<BrandDataModel> {
    console.log(id)
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("brands").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<BrandDataModel>(data)
        else
            throw new Error("TAG_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}