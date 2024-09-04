'use server'

import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export async function saveWhyShopWithUsForm(titleOne: string, contentOne: string, imageOne: string, titleTwo: string, contentTwo: string, imageTwo: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page:"home", dataType: "why_us_section" }, {
            $set: {
                titleOne, titleTwo, contentOne, contentTwo, imageOne, imageTwo
            }
        }, { upsert: true })
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