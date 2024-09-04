'use server'

import clientPromise from "../mongodb/clientPromise"
import ThemeDataModel from "../types/ThemeDataModel"

export default async function getThemeData(): Promise<ThemeDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOne({ data_type: "themeData" })
        return JSON.parse(JSON.stringify(data)) as ThemeDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}