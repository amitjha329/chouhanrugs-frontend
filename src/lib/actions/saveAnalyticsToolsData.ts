'use server'
import clientPromise from "../mongodb/clientPromise";
import AckResponse from "../types/AckResponse";

export default async function saveAnalyticsToolsData(type: "GOOGLE" | "GOOGLE_VER" | "BING", code: string): Promise<AckResponse> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("seoAnalytics").updateOne({ type }, { $set: { code } }, { upsert: true })
        return {
            ack: data.acknowledged ? true : false,
            result: {
                code: data.acknowledged ? "SUCCESS" : "ERROR",
                data: JSON.parse(JSON.stringify(data))
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}