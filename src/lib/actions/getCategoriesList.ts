'use server';
import { getServerSession } from "next-auth";
import clientPromise from "../mongodb/clientPromise"
import CategoriesDataModel from "../types/CategoriesDataModel"
import converter from "../utilities/mongoObjectConversionUtility"
import AuthOpts from "../adapters/AuthOptions";
import UserModel from "../types/UserModel";

export default async function getCategoriesList(): Promise<CategoriesDataModel[]> {
    const session = await getServerSession(AuthOpts);
    const { user } = session ?? {}
    let filter: object
    if ((user as UserModel)?.roles?.includes("admin")) {
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