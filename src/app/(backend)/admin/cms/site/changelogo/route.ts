import clientPromise from "@/lib/mongodb/clientPromise";
import { ensureDir } from "fs-extra";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const requestBody = await req.formData()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collection = db.collection("site_data")
    try {
        const imgBlob = requestBody.get('logo') as Blob
        let imagePath: string = "./public/uploads/"
        if (imgBlob) {
            await ensureDir(imagePath)
            imagePath = imagePath + "site_logo.png"
            const imgFileArray = await (imgBlob).arrayBuffer()
            await writeFile(imagePath, Buffer.from(imgFileArray))
        }
        const toUpdate = {
            data_type: "siteData"
        }
        const dataToUpdate = {
            $set: {
                logoSrc: process.env.NEXTCDN + "/uploads/site_logo.png"
            }
        }
        // const currentOptions = await collection.findOne(toUpdate)
        const updateAck = await collection.updateOne(toUpdate, dataToUpdate, { upsert: true })
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