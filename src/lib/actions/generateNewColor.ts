'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewColor(): Promise<string> {
    const draftProduct = {
        _id: new ObjectId(),
        colorCode: {
            hsl: {
                h: 0,
                s: 0,
                l: 1,
                a: 1
            },
            hex: "#ffffff",
            rgb: {
                r: 255,
                g: 255,
                b: 255,
                a: 1
            },
            hsv: {
                h: 0,
                s: 0,
                v: 1,
                a: 1
            },
            oldHue: 0,
            source: "hex"
        },
        name: "Untitled Color",
        sampleImg: ""
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("colors").insertOne(draftProduct)
    return insertedDoc.insertedId.toString()
}