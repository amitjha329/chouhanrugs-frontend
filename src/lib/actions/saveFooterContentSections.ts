'use server'

import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export async function saveFooterContentSections(page: string, content: string, buttonText: string, shortContent: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page, dataType: "footer_content" }, {
            $set: {
                content, buttonText, shortContent
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