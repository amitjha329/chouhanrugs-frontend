import clientPromise from "@/lib/mongodb/clientPromise";
import CategoriesDataModel from "@/lib/types/CategoriesDataModel";
import converter from "@/lib/utilities/mongoObjectConversionUtility";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("categories").find({ active: true, ...(params.get("popular")) && { popular: true } }).toArray()
        const parsedData: Array<CategoriesDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<CategoriesDataModel>(item))
        })
        return NextResponse.json(parsedData)
    } catch (error) {
        return NextResponse.error()
    }
}