'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import ShapeDataModel from "../types/ShapeDataModel";

export default async function getShapeWithId(id: string): Promise<ShapeDataModel> {
    console.log(id)
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("shapes").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<ShapeDataModel>(data)
        else
            throw new Error("SHAPE_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}