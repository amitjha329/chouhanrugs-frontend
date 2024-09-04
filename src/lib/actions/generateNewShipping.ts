'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewShipping(): Promise<string> {
    const draftShipping = {
        _id: new ObjectId(),
        active: false,
        country: "",
        ISO: "",
        shippingCharges: ""
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("shipping").insertOne(draftShipping)
    return insertedDoc.insertedId.toString()
}