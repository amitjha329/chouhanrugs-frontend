'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import converter from "../utilities/mongoObjectConversionUtility";
import { unlinkSync } from "fs-extra";
import SliderDataModel from "../types/SliderDataModel";
import AckResponse from "../types/AckResponse";

export default async function deleteSlider(id: string): Promise<AckResponse> {
    if (id == null || !id) {
        return {
            ack: false,
            result: {
                code: "NO_DATA",
                data: null
            }
        }
    }
    const client = await clientPromise
    const collection = client.db(process.env.MONGODB_DB).collection("sliders")
    const itemToDelete = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndDelete(itemToDelete)
    if (deleteResult) {
        if (deleteResult.value != null) {
            const deletedBrand = converter.from<SliderDataModel>(deleteResult.value)
            deletedBrand.images.forEach(img => {
                const filename = process.env.NODE_ENV == "production" ? `./public${(new URL(img.src.toString())).pathname}` : `./public${img.src.toString()}`
                unlinkSync(filename)
            })
        }
        return {
            ack: true,
            result: {
                code: "SUCCESS",
                data: JSON.stringify(deleteResult)
            }
        }
    } else {
        return {
            ack: false,
            result: {
                code: "ERROR",
                data: JSON.stringify(deleteResult)
            }
        }
    }
}