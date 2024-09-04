'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewBrand(): Promise<string> {
    const draftBrand = {
        _id: new ObjectId(),
        description: "",
        name: "Untitled Brand",
        active: false,
        imgSrc: "",
        popular: false
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("brands").insertOne(draftBrand)
    return insertedDoc.insertedId.toString()
}