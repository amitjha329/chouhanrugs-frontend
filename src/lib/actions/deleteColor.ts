'use server';
import { unlink } from "fs-extra";
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import AckResponse from "../types/AckResponse";

export default async function deleteColor(id: string, image: string): Promise<AckResponse> {
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
    const collection = client.db(process.env.MONGODB_DB).collection("colors")
    const itemToDelete = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndDelete(itemToDelete)
    const filename = process.env.NODE_ENV == "production" ? `./public${(new URL(image)).pathname}` : `./public${image}`
    await unlink(filename)
    if (deleteResult) {
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