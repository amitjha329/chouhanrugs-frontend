'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import TagDataModel from "../types/TagDataModel";

export default async function getTagWithId(id: string): Promise<TagDataModel> {
    console.log(id)
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("tags").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<TagDataModel>(data)
        else
            throw new Error("TAG_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}