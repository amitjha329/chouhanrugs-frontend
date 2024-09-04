'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewSize(): Promise<string> {
    const draftProduct = {
        _id: new ObjectId(),
        name: "Untitled Size",
        sizeBanner: "",
        sizeCode: ""
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("sizes").insertOne(draftProduct)
    return insertedDoc.insertedId.toString()
}