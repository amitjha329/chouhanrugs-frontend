'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import AckResponse from "../types/AckResponse"

export default async function saveBlogPost(data: {
    id: string, draft: boolean, title: string, description: string, keywords: string, slug: string, content: string, userId: string, publish: boolean, featuredImage?: string
}): Promise<AckResponse> {
    const mongoClient = await clientPromise
    const collectionBlogs = mongoClient.db(process.env.MONGODB_DB).collection("blogs")
    const collectionUsers = mongoClient.db(process.env.MONGODB_DB).collection("users")
    try {
        const userData = await collectionUsers.findOne({ _id: new ObjectId(data.userId) })
        if (userData == null) {
            return {
                ack: false,
                result: {
                    code: "NO_DATA",
                    data: "User not Found"
                }
            }
        }
        const { username, name, image, ..._ } = converter.fromWithNoFieldChange<{ name: string, username: string, image: string }>(userData)
        const newBlodUpdateData = await collectionBlogs.findOneAndUpdate({ _id: new ObjectId(data.id) }, {
            $set: {
                content: data.content,
                description: data.description,
                ...(data.featuredImage) && { featuredImage: data.featuredImage },
                keywords: data.keywords,
                ...(data.publish) && { posted: Date.now() },
                updated: Date.now(),
                title: data.title,
                slug: data.slug,
                author: {
                    name,
                    username,
                    image,
                },
                draft: data.draft
            }
        })
        if (newBlodUpdateData) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(newBlodUpdateData)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(newBlodUpdateData)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}