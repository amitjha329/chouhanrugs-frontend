'use server'

import clientPromise from "@/lib/clientPromise"
import { ObjectId } from "mongodb"

type EnquirySource = 'popup' | 'product_page' | 'contact' | 'other'

export default async function addCustomSizeEnquiry(
    email: string,
    mobile: string,
    requirements: string,
    source: EnquirySource = 'other',
    customerName?: string
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

        // Validate mobile
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
        const cleanMobile = mobile.replace(/\s/g, '')
        if (!mobile || !phoneRegex.test(cleanMobile)) {
            return {
                ack: false,
                result: {
                    code: "INVALID_MOBILE",
                    message: "Please enter a valid mobile number"
                }
            }
        }

        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)
        const collection = db.collection("custom_size_enquiries")

        const now = new Date()

        // Create enquiry document matching the expected schema
        const enquiryDoc = {
            email: email.toLowerCase().trim(),
            mobile: cleanMobile,
            requirements: requirements || '',
            customerName: customerName || undefined,
            status: 'pending',
            source: source,
            messages: [] as Array<{
                id: string
                type: 'customer' | 'admin'
                message: string
                timestamp: Date
                sentBy?: string
            }>,
            createdAt: now,
            updatedAt: now
        }

        // Add initial customer message if requirements are provided
        if (requirements && requirements.trim()) {
            enquiryDoc.messages.push({
                id: new ObjectId().toString(),
                type: 'customer',
                message: requirements,
                timestamp: now
            })
        }

        const result = await collection.insertOne(enquiryDoc)

        return {
            ack: true,
            result: {
                code: "SUCCESS",
                message: "Your enquiry has been submitted! We'll contact you soon.",
                insertedId: result.insertedId
            }
        }
    } catch (error) {
        console.error("Error adding custom size enquiry:", error)
        return {
            ack: false,
            result: {
                code: "ERROR",
                message: "Failed to submit enquiry. Please try again."
            }
        }
    }
}
