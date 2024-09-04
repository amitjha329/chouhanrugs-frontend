'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewPattern(): Promise<string> {
    const draftProduct = {
        _id: new ObjectId(),
        name: "Untitled Pattern",
        patternDescription: ""
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("patterns").insertOne(draftProduct)
    return insertedDoc.insertedId.toString()
}