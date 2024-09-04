import getColorMapForProductList from "@/lib/actions/getColorMapForProductList";
import { Filter, Pagination } from "@/lib/actions/getProductsIdList";
import clientPromise from "@/lib/mongodb/clientPromise";
import { ProductDataModel, ProductDataModelWithColorMap } from "@/lib/types/ProductDataModel";
import converter from "@/lib/utilities/mongoObjectConversionUtility";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const mongoCLient = await clientPromise
    const db = mongoCLient.db(process.env.MONGODB_DB)
    const { filters, pagination, query }: { pagination?: Pagination, filters?: Filter, query?: string } = await req.json();
    const allCategoriesToFind: string[] = filters?.category ?? []
    if (filters?.category) {
        const finalCategoriesData = await db.collection("categories").find({ parent: { $regex: filters?.category?.join("|") } }).toArray()
        finalCategoriesData.forEach(item => allCategoriesToFind.push(item.name))
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
        productActive: { $eq: true }
    }
    const data = await db.collection("products").find(filter, {
        limit: pagination?.limit ?? 50,
        sort: [["_id", pagination?.prevPage ? 1 : -1]]
    }).toArray();
    const colorData = await getColorMapForProductList(data.map(item => item._id.toHexString()))
    const parsedData: Array<ProductDataModelWithColorMap> = []
    data.forEach(item => {
        parsedData.push({
            ...converter.fromWithNoFieldChange<ProductDataModel>(item),
            colorMap: colorData.get(item._id.toHexString()) ?? []
        })
    })
    return NextResponse.json(pagination?.prevPage ? parsedData.reverse() : parsedData)
}