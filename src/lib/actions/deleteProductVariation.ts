'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import AckResponse from "../types/AckResponse";

export default async function deleteProductVariation(id: string, varCode: string): Promise<AckResponse> {
    const client = await clientPromise
    const collection = client.db(process.env.MONGODB_DB).collection("products")
    const productToUpdate = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndUpdate(productToUpdate, {
        //@ts-ignore
        $pull: { ["variations"]: { variationCode: varCode } }
    })
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