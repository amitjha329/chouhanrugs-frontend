'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import deleteImage from "./deleteImage"
import AckResponse from "../types/AckResponse"

export default async function deleteSlideFromSlider(slideId: string, slideImage: string): Promise<AckResponse> {
    console.log(slideId)
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collection = db.collection("sliders")

    try {
        const updateResult = await collection.findOneAndUpdate({
            _id: new ObjectId(slideId)
        }, {
            //@ts-ignore
            $pull: {
                images: {
                    src: slideImage,
                }
            }
        })
        console.log(updateResult)
        if (updateResult) {
            await deleteImage(slideImage)
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