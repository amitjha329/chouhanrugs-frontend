'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function saveHighlightedFeatureForm(id: string, productCustomizable: boolean, productFreeDel: boolean, productHandCrafted: boolean, productReturns: boolean): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("products").findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: { productCustomizable, productFreeDel, productHandCrafted, productReturns, updatedOn: Date.now() }
        })
        if (insertResponse) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}