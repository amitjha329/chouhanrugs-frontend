'use server'

import clientPromise from "@/lib/clientPromise";
import { ObjectId } from "mongodb";
export default async function updateUserProfile(id: string, email: string, name: string, number: string, image?: string) {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("users").findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, {
            $set: { name, email, ...(image) && { image }, number }
        })
        if (insertResponse) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}