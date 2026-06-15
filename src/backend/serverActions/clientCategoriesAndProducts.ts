'use server'

import getCategoriesList from "./getCategoriesList"
import { getProductsByCategory } from "./getProductsByCategory"
import CategoriesDataModel from "@/types/CategoriesDataModel"
import { ProductDataModel } from "@/types/ProductDataModel"

export async function getCategoriesForClient(): Promise<CategoriesDataModel[]> {
    return await getCategoriesList()
}

export async function getProductsByCategoryForClient(category: string, limit: number): Promise<ProductDataModel[]> {
    return await getProductsByCategory(category, limit)
}
