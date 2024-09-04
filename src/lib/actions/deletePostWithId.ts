'use server'
import { rmSync } from "fs-extra";
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import { resolve } from "path";
import AckResponse from "../types/AckResponse";

export default async function deletePostWithId(id: string): Promise<AckResponse> {
    const mongoClient = await clientPromise
    const collectionBlogs = mongoClient.db(process.env.MONGODB_DB).collection("blogs")
    try {
        const postDeleteData = await collectionBlogs.findOneAndDelete({ _id: new ObjectId(id) })
        if (postDeleteData) {
            rmSync(resolve("./public/uploads/blog/", id), { recursive: true, force: true })
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(postDeleteData)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "NO_DATA",
                    data: "Data not Found"
                }
            }
        }
    } catch (err: any) {
        throw new Error(err)
    }
}