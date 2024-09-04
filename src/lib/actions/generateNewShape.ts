'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewShape(): Promise<string> {
    const draftProduct = {
        _id: new ObjectId(),
        name: "Untitled Shape",
        shapeDescription: ""
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("shapes").insertOne(draftProduct)
    return insertedDoc.insertedId.toString()
}