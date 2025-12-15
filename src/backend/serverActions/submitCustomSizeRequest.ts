'use server'

import clientPromise from "@/lib/clientPromise"

type CustomSizeRequestData = {
    email: string
    mobile: string
    requirements?: string
}

export default async function submitCustomSizeRequest(data: CustomSizeRequestData) {
    try {
        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)
        const collection = db.collection("custom_size_requests")

        const result = await collection.insertOne({
            email: data.email,
            mobile: data.mobile,
            requirements: data.requirements || '',
            status: 'pending',
            source: 'popup',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return {
            ack: true,
            result: {
                code: "SUCCESS",
                message: "Request submitted successfully. We'll contact you soon!",
                insertedId: result.insertedId
            }
        }
    } catch (error) {
        console.error("Error submitting custom size request:", error)
        return {
            ack: false,
            result: {
                code: "ERROR",
                message: "Failed to submit request. Please try again."
            }
        }
    }
}
