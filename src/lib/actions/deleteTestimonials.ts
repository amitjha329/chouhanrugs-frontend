'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import AckResponse from "../types/AckResponse";
import converter from "../utilities/mongoObjectConversionUtility";
import { unlink } from "fs/promises";

export default async function deleteTestimonials(id: string): Promise<AckResponse> {
    if (id == null || !id) {
        return {
            ack: false,
            result: {
                code: "NO_DATA",
                data: null
            }
        }
    }
    const client = await clientPromise
    const collection = client.db(process.env.MONGODB_DB).collection("testimonials")
    const itemToDelete = {
        _id: new ObjectId(id)
    }
    const deleteResult = await collection.findOneAndDelete(itemToDelete)
    if (deleteResult) {
        if (deleteResult.value != null) {
            const deletedBrand = converter.from<TestimonialDataModel>(deleteResult.value)
            const imagefile = process.env.NODE_ENV == "production" ? `./public${(new URL(deletedBrand.testimonialImage)).pathname}` : `./public${deletedBrand.testimonialImage}`
            if (deletedBrand.testimonialVideo) {
                const videofile = process.env.NODE_ENV == "production" ? `./public${(new URL(deletedBrand.testimonialVideo)).pathname}` : `./public${deletedBrand.testimonialVideo}`
                unlink(videofile)
            }
            unlink(imagefile)
        }
        return {
            ack: true,
            result: {
                code: "SUCCESS",
                data: JSON.stringify(deleteResult)
            }
        }
    } else {
        return {
            ack: false,
            result: {
                code: "ERROR",
                data: JSON.stringify(deleteResult)
            }
        }
    }
}