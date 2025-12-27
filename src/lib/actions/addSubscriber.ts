'use server'

import clientPromise from "@/lib/clientPromise"

type SubscriberSource = 'popup' | 'footer' | 'checkout' | 'other'

export default async function addSubscriber(
    email: string,
    source: SubscriberSource = 'other'
) {
    try {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            return {
                ack: false,
                result: {
                    code: "INVALID_EMAIL",
                    message: "Please enter a valid email address"
                }
            }
        }

        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)
        const collection = db.collection("subscribers")

        // Check if already subscribed
        const existingSubscriber = await collection.findOne({ 
            email: email.toLowerCase().trim() 
        })

        if (existingSubscriber) {
            // If already subscribed and active, return success with info
            if (existingSubscriber.isActive) {
                return {
                    ack: true,
                    result: {
                        code: "NO_DATA",
                        message: "You are already subscribed!"
                    }
                }
            } else {
                // Reactivate subscription
                await collection.updateOne(
                    { _id: existingSubscriber._id },
                    { 
                        $set: { 
                            isActive: true,
                            subscribedAt: new Date(),
                            source: source
                        },
                        $unset: { unsubscribedAt: "" }
                    }
                )
                return {
                    ack: true,
                    result: {
                        code: "SUCCESS",
                        message: "Welcome back! Your subscription has been reactivated."
                    }
                }
            }
        }

        // Add new subscriber
        const result = await collection.insertOne({
            email: email.toLowerCase().trim(),
            subscribedAt: new Date(),
            source: source,
            isActive: true
        })

        return {
            ack: true,
            result: {
                code: "SUCCESS",
                message: "Thank you for subscribing!",
                insertedId: result.insertedId
            }
        }
    } catch (error) {
        console.error("Error adding subscriber:", error)
        return {
            ack: false,
            result: {
                code: "ERROR",
                message: "Failed to subscribe. Please try again."
            }
        }
    }
}
