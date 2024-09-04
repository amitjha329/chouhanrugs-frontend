'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";

export default async function generateNewBlogPost(): Promise<string> {
    const data = {
        content: "",
        description: "",
        featuredImage: "",
        _id: new ObjectId(),
        keywords: "",
        posted: Date.now(),
        updated: Date.now(),
        draft: true,
        title: "Untitled Blog",
        slug: "",
        author: {
            image: "",
            name: "",
            username: ""
        }
    }
    const client = await clientPromise
    const insertedDoc = await client.db(process.env.MONGODB_DB).collection("blogs").insertOne(data)
    return insertedDoc.insertedId.toString()
}