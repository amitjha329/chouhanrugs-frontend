import getColorMapForProductList from "@/lib/actions/getColorMapForProductList";
import clientPromise from "@/lib/mongodb/clientPromise";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import converter from "@/lib/utilities/mongoObjectConversionUtility";
import { ProductDataModel } from "@/lib/types/ProductDataModel";


export async function POST(req: NextRequest) {
    const { id } = await req.json()
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("products").findOne({ _id: new ObjectId(id) })
        if (data) {
            const colorData = await getColorMapForProductList([data._id.toHexString()])
            return NextResponse.json({
                ...converter.fromWithNoFieldChange<ProductDataModel>(data),
                colorMap: colorData.get(data._id.toHexString()) ?? []
            })
        }
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}