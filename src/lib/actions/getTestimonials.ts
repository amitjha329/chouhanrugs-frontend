'use server'

import clientPromise from "../mongodb/clientPromise"

export default async function getTestimonials(): Promise<Array<TestimonialDataModel>> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("testimonials").find({}).toArray()
        return JSON.parse(JSON.stringify(data)) as Array<TestimonialDataModel>
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}