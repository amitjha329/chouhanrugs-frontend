'use server'
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export async function savePoliciesTitle(title: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page: "policies", dataType: "policies_page" }, {
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

export async function savePoliciesContent(content: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page: "policies", dataType: "policies_page" }, {
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