'use server'
import clientPromise from "../mongodb/clientPromise"
import PopUpDataModel from "../types/PopUpDataModel"

export default async function getPopupData(): Promise<PopUpDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOne({ data_type: "popupData" })
        return JSON.parse(JSON.stringify(data)) as PopUpDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}