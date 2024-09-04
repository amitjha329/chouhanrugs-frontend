'use server'
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function updatePopUpData(data: {
    title: string,
    description: string,
    button: {
        url: string,
        text: string
    },
    isSubscribeEnabled: boolean,
    image: string
}): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOneAndUpdate({ data_type: "popupData" }, {
            $set: { data }
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