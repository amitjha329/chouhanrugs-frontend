'use server'
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function saveSocialProfilesForm(profiles: string[], data_type: string = "siteData"): Promise<AckResponse> {
    try {
        const themeChangeRes = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOneAndUpdate({ data_type }, {
            $set: { profiles }
        })
        if (themeChangeRes) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(themeChangeRes)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(themeChangeRes)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}