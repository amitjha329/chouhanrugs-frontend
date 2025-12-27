'use server'

import clientPromise from "@/lib/clientPromise"
import { generateUnsubscribeToken, verifyUnsubscribeToken } from "@/utils/emailUnsubscribe"

// Unsubscribe a user from mailing list
export default async function unsubscribe(
    email: string,
    token: string
) {
    try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            return {
                ack: false,
                result: {
                    code: "INVALID_EMAIL",
                    message: "Invalid email address"
                }
            }
        }

        // Verify the token to prevent unauthorized unsubscribes
        if (!verifyUnsubscribeToken(email, token)) {
            return {
                ack: false,
                result: {
                    code: "INVALID_TOKEN",
                    message: "Invalid or expired unsubscribe link"
                }
            }
        }

        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)
        const collection = db.collection("subscribers")

        // Find the subscriber
        const subscriber = await collection.findOne({ 
            email: email.toLowerCase().trim() 
        })

        if (!subscriber) {
            return {
                ack: false,
                result: {
                    code: "NOT_FOUND",
                    message: "This email is not in our mailing list"
                }
            }
        }

        if (!subscriber.isActive) {
            return {
                ack: true,
                result: {
                    code: "ALREADY_UNSUBSCRIBED",
                    message: "You have already been unsubscribed"
                }
            }
        }

        // Unsubscribe the user
        await collection.updateOne(
            { _id: subscriber._id },
            { 
                $set: { 
                    isActive: false,
                    unsubscribedAt: new Date()
                }
            }
        )

        return {
            ack: true,
            result: {
                code: "SUCCESS",
                message: "You have been successfully unsubscribed from our mailing list"
            }
        }
    } catch (error) {
        console.error("Error unsubscribing:", error)
        return {
            ack: false,
            result: {
                code: "ERROR",
                message: "Failed to unsubscribe. Please try again."
            }
        }
    }
}
