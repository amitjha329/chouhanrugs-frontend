'use server';

import { connection } from 'next/server'
import clientPromise from "@/lib/clientPromise";
import CategoriesDataModel from "@/types/CategoriesDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export default async function getCategoriesWithName(name: string): Promise<CategoriesDataModel> {
    await connection()
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("categories").findOne({ name })
        if (data != null)
            return converter.fromWithNoFieldChange<CategoriesDataModel>(data)
        else
            throw new Error("CATEGORY_NOT_FOUND")
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}