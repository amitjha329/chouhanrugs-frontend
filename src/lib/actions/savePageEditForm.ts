'use server'
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function savePageEditForm(page: string, pageTitle: string, pageKeywords: string, pageDescription: string, pageSlider: number, videoBanner: boolean): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("pages").findOneAndUpdate({ page }, {
            $set: { pageTitle, pageDescription, pageKeywords, sliderId:pageSlider, videoBanner }
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