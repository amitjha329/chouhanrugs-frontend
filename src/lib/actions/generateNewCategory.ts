'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewCategory(): Promise<string> {
    const draftCateogry = {
        _id: new ObjectId(),
        active: false,
        banner: "",
        description: "",
        imgSrc: "",
        name: "Untitled Category",
        popular: false,
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("categories").insertOne(draftCateogry)
    return insertedDoc.insertedId.toString()
}