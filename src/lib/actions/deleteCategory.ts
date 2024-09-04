'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import CategoriesDataModel from "../types/CategoriesDataModel";
import converter from "../utilities/mongoObjectConversionUtility";
import { unlink } from "fs-extra";
import AckResponse from "../types/AckResponse";

export default async function deleteCategory(id?: string): Promise<AckResponse> {
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
    const collection = client.db(process.env.MONGODB_DB).collection("categories")
    const catToDelete = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndDelete(catToDelete)
    if (deleteResult) {
        if (deleteResult.value != null) {
            const deletedCat = converter.from<CategoriesDataModel>(deleteResult.value)
            let filename = process.env.NODE_ENV == "production" ? `./public${(new URL(deletedCat.imgSrc)).pathname}` : `./public${deletedCat.imgSrc}`
            await unlink(filename)
            filename = process.env.NODE_ENV == "production" ? `./public${(new URL(deletedCat.banner)).pathname}` : `./public${deletedCat.banner}`
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