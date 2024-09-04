'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import AckResponse from "../types/AckResponse";
import algoliasearch from "algoliasearch";

export default async function deleteProduct(id?: string): Promise<AckResponse> {
    if (id == null || !id) {
        return {
            ack: false,
            result: {
                code: "NO_DATA",
                data: null
            }
        }
    }
    const algoliaCLient = algoliasearch(process.env.ALGOLIA_APPID ?? "", process.env.ALGOLIA_KEY ?? "")
    const index = algoliaCLient.initIndex(process.env.ALGOLIA_INDEX ?? "")
    const client = await clientPromise
    const collection = client.db(process.env.MONGODB_DB).collection("products")
    const productToDelete = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndDelete(productToDelete)
    if (deleteResult) {
        const deletRes = await index.deleteObject(id)
        console.log(deletRes)
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