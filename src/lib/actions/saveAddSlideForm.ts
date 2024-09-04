'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"

export default async function saveAddSlideForm(slideId: string, slideTitle: string, slideHeading: string, slideDescription: string, slideImage: string): Promise<AckResponse> {
    console.log(slideId)
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collection = db.collection("sliders")

    try {
        const updateResult = await collection.findOneAndUpdate({
            _id: new ObjectId(slideId)
        }, {
            //@ts-ignore
            $addToSet: {
                images: {
                    src: slideImage,
                    title: slideTitle,
                    heading: slideHeading,
                    desc: slideDescription
                }
            }
        })
        console.log(updateResult)
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