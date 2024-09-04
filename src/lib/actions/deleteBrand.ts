'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import converter from "../utilities/mongoObjectConversionUtility";
import BrandDataModel from "../types/BrandDataModel";
import { unlink } from "fs-extra";
import AckResponse from "../types/AckResponse";

export default async function deleteBrand(id: string): Promise<AckResponse> {
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
    const collection = client.db(process.env.MONGODB_DB).collection("brands")
    const itemToDelete = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndDelete(itemToDelete)
    if (deleteResult) {
        if (deleteResult.value != null) {
            const deletedBrand = converter.from<BrandDataModel>(deleteResult.value)
            const filename = process.env.NODE_ENV == "production" ? `./public${(new URL(deletedBrand.imgSrc)).pathname}` : `./public${deletedBrand.imgSrc}`
            await unlink(filename)
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