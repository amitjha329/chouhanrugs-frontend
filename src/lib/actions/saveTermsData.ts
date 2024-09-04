'use server'
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export async function saveTermsTitle(title: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page: "terms", dataType: "terms_page" }, {
            $set: {
                title
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

export async function saveTermsContent(content: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page: "terms", dataType: "terms_page" }, {
            $set: {
                content
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