'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function saveShippingForm(id: string, country: string, ISO: string, shippingCharges: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("shipping").findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: { country, ISO, shippingCharges, updatedOn: Date.now() }
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