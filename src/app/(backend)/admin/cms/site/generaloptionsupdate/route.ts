import clientPromise from "@/lib/mongodb/clientPromise";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const requestBody = await req.json()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collection = db.collection("site_data")
    if (!requestBody.sitedata) {
        return NextResponse.json({ ack: false, result: { code: "NO_DATA", data: {} } })
    }
    try {
        const toUpdate = {
            data_type: "siteData"
        }
        const dataToUpdate = {
            $set: {
                ...(requestBody.sitedata.name) && { title: requestBody.sitedata.name },
                ...(requestBody.sitedata.description) && { description: requestBody.sitedata.description },
                ...(requestBody.sitedata.tag_line) && { tag_line: requestBody.sitedata.tag_line },
                ...(requestBody.sitedata.url) && { url: requestBody.sitedata.url }
            }
        }
        // const currentOptions = await collection.findOne(toUpdate)
        const updateAck = await collection.updateOne(toUpdate, dataToUpdate)
        if (updateAck.acknowledged && updateAck.modifiedCount > 0) {
            return NextResponse.json({ ack: true, result: { code: "SUCCESS", data: {} } })
        } else {
            return NextResponse.json({ ack: false, result: { code: "ERROR", data: {} } })
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({ ack: false, result: { code: "ERROR", data: err } })
    }
}