'use server';

import { auth } from "@/auth";
import clientPromise from "@/lib/clientPromise";
import CategoriesDataModel from "@/types/CategoriesDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export default async function getCategoriesList(): Promise<CategoriesDataModel[]> {
    const session = await auth();
    const { user } = session ?? {}
    let filter: object
    if ((user as { roles: string[] })?.roles?.includes("admin")) {
        filter = {}
    } else {
        filter = {
            active: true
        }
    }
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