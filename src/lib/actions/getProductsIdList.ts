'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import getColorMapForProductList from "./getColorMapForProductList";
import { ProductDataModel } from "../types/ProductDataModel";
import CategoriesDataModel from "../types/CategoriesDataModel";

export type Pagination = {
    lastItem?: string,
    limit?: number,
    prevPage?: boolean
}

export type Filter = {
    category?: string[]
    size?: string[]
    color?: string[]
    tags?: string[]
    brand?: string[]
    shape?: string[]
    pattern?: string[]
    minPrice?: number
    maxPrice?: number
    productCustomizable?: boolean
}

async function getProductsIdList(pagination?: Pagination, filters?: Filter, query?: string, admin?: boolean): Promise<{ _id: string }[]> {
    const mongoCLient = await clientPromise
    const db = mongoCLient.db(process.env.MONGODB_DB)
    const allCategoriesToFind: string[] = filters?.category ?? []
    if (filters?.category) {
        const finalCategoriesData = await db.collection("categories").find({ parent: { $regex: filters?.category?.join("|") } }).toArray()
        finalCategoriesData.forEach((item: any) => allCategoriesToFind.push(item.name))
    }
    const filter = {
        ...(pagination?.lastItem) && {
            _id: {
                ...(pagination.prevPage) ? { $gt: new ObjectId(pagination.lastItem) } : { $lt: new ObjectId(pagination.lastItem) }
            }
        },
        ...(query) && { $text: { $search: `${query}` } },
        ...(filters) && {
            ...(filters.category) && { productCategory: { $in: allCategoriesToFind } },
            ...(filters.brand) && { productBrand: { $in: filters.brand } },
            ...(filters.shape) && { "productShape.name": { $in: filters.shape } },
            ...(filters.pattern) && { "productPattern.name": { $in: filters.pattern } },
            ...(filters.color) && { $or: [{ "variations.variationColor": { $in: filters.color } }, { 'productBaseColor': { $regex: filters.color.join('|') } }] },
            ...(filters.size) && { "variations.variationSize": { $regex: filters.size.map(item => item.trim()).join('|'), $options: "i" } },
            ...(filters.tags) && { tags: { $in: filters.tags } },
            ...(filters.productCustomizable) && { productCustomizable: filters.productCustomizable },
            ...(filters.maxPrice || filters.minPrice) && { productSellingPrice: { $gte: filters.minPrice, $lte: filters.maxPrice } },
        },
        ...(!admin) && { productActive: { $eq: true } }
    }
    const data = await db.collection("products").find(filter, {
        limit: pagination?.limit ?? 50,
        sort: [["_id", pagination?.prevPage ? 1 : -1]],
        projection: {
            _id: 1
        }
    }).toArray();
    const parsedData: Array<{ _id: string }> = []
    data.forEach((item: any) => {
        parsedData.push({
            _id: converter.fromWithNoFieldChange<ProductDataModel>(item)._id!.toString(),
        })
    })
    return pagination?.prevPage ? parsedData.reverse() : parsedData
}

export default getProductsIdList