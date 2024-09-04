'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import { ProductDataModel, ProductDataModelWithColorMap } from "../types/ProductDataModel";
import converter from "../utilities/mongoObjectConversionUtility";
import getColorMapForProductList from "./getColorMapForProductList";

type Pagination = {
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

const createFilterString = (filter: Filter) => {
    let filterstring = "";
    Object.keys(filter).forEach((key) => {
        if (key == "category") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "size") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "color") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "tags") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "brand") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "shape") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "pattern") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "minPrice" || key == "maxPrice") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
        if (key == "category") {
            filterstring += filterstring.length == 0 ? `productCategory: ${filter[key]}` : `, productCategory: ${filter[key]}`;
        }
    })
}

async function getProductsList(pagination?: Pagination, filters?: Filter, query?: string, admin?: boolean): Promise<ProductDataModelWithColorMap[]> {
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
        limit: pagination?.limit,
        sort: [["_id", pagination?.prevPage ? 1 : -1]]
    }).toArray();
    const colorData = await getColorMapForProductList(data.map((item: any) => item._id.toHexString()))
    const parsedData: Array<ProductDataModelWithColorMap> = []
    data.forEach((item: any) => {
        parsedData.push({
            ...converter.fromWithNoFieldChange<ProductDataModel>(item),
            colorMap: colorData.get(item._id.toHexString()) ?? []
        })
    })
    return pagination?.prevPage ? parsedData.reverse() : parsedData
}

export default getProductsList



export async function getProductsListAdmin<B extends boolean>(pagination: B): Promise<B extends true ? (page: number, perpage: number, filter?: Filter, active?: boolean) => Promise<ProductDataModelWithColorMap[]> : () => Promise<ProductDataModelWithColorMap[]>> {
    const mongoClient = await clientPromise
    const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("products")
    return (pagination ? async function (page: number = 1, perpage: number, filter?: Filter, active?: boolean): Promise<ProductDataModelWithColorMap[]> {

        console.log(page, perpage)
        try {
            const partnerIdsData = await collectionPartnerIds.aggregate([
                {
                    $match:
                    {
                        ...(Array.isArray(filter?.brand)) && {
                            productBrand: {
                                $in: filter.brand
                            }
                        },
                        ...(Array.isArray(filter?.category)) && {
                            productCategory: {
                                $in: filter.category
                            }
                        },
                        ...(active != undefined) && { productActive: active }
                    }
                },
                { '$sort': { '_id': -1 } },
                { $skip: perpage * (page - 1) }, { $limit: perpage }
            ]).toArray()
            const returnData = new Array<ProductDataModelWithColorMap>()
            partnerIdsData.forEach((item: Record<string, any>) => {
                returnData.push(converter.fromWithNoFieldChange<ProductDataModelWithColorMap>(item))
            })
            return returnData
        } catch (err: any) {
            throw new Error(err)
        }
    } : async function (): Promise<ProductDataModelWithColorMap[]> {
        try {
            const partnerIdsData = await collectionPartnerIds.aggregate([
                { '$sort': { 'posted': -1 } }
            ]).toArray()
            const returnData = new Array<ProductDataModelWithColorMap>()
            partnerIdsData.forEach((item: Record<string, any>) => {
                returnData.push(converter.fromWithNoFieldChange<ProductDataModelWithColorMap>(item))
            })
            return returnData
        } catch (err: any) {
            throw new Error(err)
        }
    }) as B extends true ? (page: number, perpage: number) => Promise<ProductDataModelWithColorMap[]> : () => Promise<ProductDataModelWithColorMap[]>
}