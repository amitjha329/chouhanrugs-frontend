import clientPromise from "@/lib/mongodb/clientPromise";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "terms", dataType: "terms_page" })
        return NextResponse.json(data)
    } catch (error) {
        throw new Error(error?.toString())
    }
}