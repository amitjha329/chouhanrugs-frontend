'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import AckResponse from "../types/AckResponse";

export default async function deleteShape(id: string): Promise<AckResponse> {
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
    const collection = client.db(process.env.MONGODB_DB).collection("shapes")
    const itemToDelete = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndDelete(itemToDelete)
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