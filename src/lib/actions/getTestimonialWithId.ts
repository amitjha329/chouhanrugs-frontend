'use server'

import clientPromise from "../mongodb/clientPromise"
import { ObjectId } from 'mongodb'

export default async function getTestimonialWithId(id: string): Promise<TestimonialDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("testimonials").findOne({ _id: new ObjectId(id) })
        return JSON.parse(JSON.stringify(data)) as TestimonialDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}