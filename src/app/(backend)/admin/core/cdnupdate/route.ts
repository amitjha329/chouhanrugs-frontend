import clientPromise from "@/lib/mongodb/clientPromise";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const mongoClient = await clientPromise
    const collection = mongoClient.db(process.env.MONGODB_DB).collection("site_data")
    const { CDNURL } = await req.json()
    if (!CDNURL || CDNURL == null || CDNURL == "") {
        return NextResponse.json({ ack: false, result: { code: "NO_DATA", data: {} } })
    }
    try {
        const result = await collection.findOneAndUpdate({ data_type: "cdnData" }, { $set: { url: CDNURL } }, { upsert: true })
        return NextResponse.json({ ack: true, result: { code: "SUCCESS", data: result } })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ ack: false, result: { code: "ERROR", data: err } })
    }
}