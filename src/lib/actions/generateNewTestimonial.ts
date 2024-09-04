'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewTestimonial(): Promise<string> {
    const draftProduct = {
        _id: new ObjectId(),
        title: "",
        client: "",
        description: "",
        publishedOn: "",
        updatedOn: "",
        testimonialImage: ""
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("testimonials").insertOne(draftProduct)
    return insertedDoc.insertedId.toString()
}