'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function setDefaultCurrency(id: string): Promise<AckResponse> {
    try {
        const replaceRes = await (await clientPromise).db(process.env.MONGODB_DB).collection("currencies").findOneAndUpdate({ default: true }, {
            $set: { default: false }
        })
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("currencies").findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: { default: true }
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