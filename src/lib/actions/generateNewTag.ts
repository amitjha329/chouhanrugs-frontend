'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewTag(): Promise<string> {
    const draftCateogry = {
        _id: new ObjectId(),
        description: "",
        name: "Untitled Tag",
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("tags").insertOne(draftCateogry)
    return insertedDoc.insertedId.toString()
}