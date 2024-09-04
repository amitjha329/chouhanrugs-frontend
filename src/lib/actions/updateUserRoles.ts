'use server'

import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import AckResponse from "../types/AckResponse";

export default async function updateUserRoles(id: string, roles: string[]): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("users").findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: { roles }
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