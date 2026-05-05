import { cacheLife, cacheTag } from 'next/cache'
import clientPromise from "@/lib/clientPromise";
import CategoriesDataModel from "@/types/CategoriesDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export default async function getCategoriesList(): Promise<CategoriesDataModel[]> {
    "use cache"

    cacheLife("seconds")
    cacheTag("categories")

    const filter = { active: true }
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("categories").find(filter).toArray()
        const parsedData: Array<CategoriesDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<CategoriesDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}
