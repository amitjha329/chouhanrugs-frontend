import clientPromise from "@/lib/mongodb/clientPromise";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const mongoClient = await clientPromise
    const collection = mongoClient.db(process.env.MONGODB_DB).collection("site_data")
    const { smtpHost, smtpPass, smtpPort, smtpUser } = await req.json()
    try {
        const result = await collection.findOneAndUpdate({ data_type: "emailData" }, { $set: { smtpHost: smtpHost || "", smtpPass: smtpPass || "", smtpPort: smtpPort || "", smtpUser: smtpUser || "" } }, { upsert: true })
        return NextResponse.json({ ack: true, result: { code: "SUCCESS", data: result } })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ ack: false, result: { code: "ERROR", data: err } })
    }
}