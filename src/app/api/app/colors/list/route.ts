import clientPromise from "@/lib/mongodb/clientPromise";
import ColorDataModel from "@/lib/types/ColorDataModel";
import converter from "@/lib/utilities/mongoObjectConversionUtility";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("colors").find().toArray()
        const parsedData: Array<ColorDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<ColorDataModel>(item))
        })
        return NextResponse.json(parsedData)
    } catch (error) {
        return NextResponse.error()
    }
}