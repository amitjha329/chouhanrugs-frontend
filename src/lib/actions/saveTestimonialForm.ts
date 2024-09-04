'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function saveTestimonialForm(testimonialData: TestimonialDataModel): Promise<AckResponse> {
    console.log(testimonialData)
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collection = db.collection("testimonials")
    const { _id, ...finalData } = testimonialData
    try {
        const updateResult = await collection.findOneAndUpdate({
            _id: new ObjectId(testimonialData._id)
        }, {
            $set: {
                ...finalData,
            }
        })
        if (updateResult) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(updateResult)
                }
            }
        } else {
            throw new Error("Unable To Update Slide", { cause: updateResult })
        }
    } catch (ex: any) {
        throw new Error(ex)
    }
}