import clientPromise from "@/lib/mongodb/clientPromise";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "policies", dataType: "policies_page" })
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}