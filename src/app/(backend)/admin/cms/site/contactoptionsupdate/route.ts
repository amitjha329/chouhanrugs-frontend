import clientPromise from "@/lib/mongodb/clientPromise";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const requestBody = await req.json()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collection = db.collection("site_data")
    if (!requestBody.addressdata) {
        return NextResponse.json({ ack: false, result: { code: "NO_DATA", data: {} } })
    }
    try {
        const toUpdate = {
            data_type: "siteData"
        }
        const dataToUpdate = {
            $set: {
                ...(requestBody.addressdata.flat_house) && { "contact_details.flat_house": requestBody.addressdata.flat_house },
                ...(requestBody.addressdata.address1) && { "contact_details.address1": requestBody.addressdata.address1 },
                ...(requestBody.addressdata.address2) && { "contact_details.address2": requestBody.addressdata.address2 },
                ...(requestBody.addressdata.state) && { "contact_details.state": requestBody.addressdata.state },
                ...(requestBody.addressdata.country) && { "contact_details.country": requestBody.addressdata.country },
                ...(requestBody.addressdata.PIN) && { "contact_details.PIN": requestBody.addressdata.PIN },
                ...(requestBody.addressdata.email) && { "contact_details.email": requestBody.addressdata.email },
                ...(requestBody.addressdata.phone) && { "contact_details.phone": requestBody.addressdata.phone },
                ...(requestBody.addressdata.whatsapp) && { "contact_details.whatsapp": requestBody.addressdata.whatsapp }
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