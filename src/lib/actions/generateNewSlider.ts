'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";

export default async function generateNewSlider(): Promise<number> {
    const client = await clientPromise
    const collection = client.db(process.env.MONGODB_DB).collection("sliders")
    const lastSlide = await collection.find({}).sort({ _id: -1 }).limit(1).toArray()
    const draftProduct = {
        _id: new ObjectId(),
        active: false,
        images: [],
        slideDescription: "Untitle Slider",
        slideId: Number(lastSlide[0]?.slideId ?? 0) + 1
    }
    const insertedDoc = await collection.insertOne(draftProduct)
    return Number(lastSlide[0]?.slideId ?? 0) + 1
}