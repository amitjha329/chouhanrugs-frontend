'use server'

import { ObjectId } from "mongodb"
import { getStorefrontDb } from "@/lib/mongodb"
import { getReviewCollection, isValidObjectId } from "@/lib/reviews"
import { ReviewEligibility } from "@/types/ReviewDataModel"

export default async function getProductReviewEligibility(
    productId: string,
    userId?: string | null
): Promise<ReviewEligibility> {
    if (!userId) {
        return {
            signedIn: false,
            purchased: false,
            existingReviewStatus: null,
            canSubmit: false,
            message: "Sign in to review this product.",
        }
    }

    if (!isValidObjectId(productId) || !ObjectId.isValid(userId)) {
        return {
            signedIn: true,
            purchased: false,
            existingReviewStatus: null,
            canSubmit: false,
            message: "This product cannot accept reviews right now.",
        }
    }

    const db = await getStorefrontDb()

    const [existingReview, qualifyingOrder] = await Promise.all([
        getReviewCollection(db).findOne({
            productId,
            userId,
            status: { $in: ["pending", "approved"] },
        }),
        db.collection("orders").findOne({
            userId: new ObjectId(userId),
            orderStatus: { $nin: ["pending", "cancelled", "returned"] },
            paymentStatus: { $in: ["success", "paid", "completed"] },
            products: {
                $elemMatch: {
                    productId,
                },
            },
        }),
    ])

    if (!qualifyingOrder) {
        return {
            signedIn: true,
            purchased: false,
            existingReviewStatus: existingReview?.status ?? null,
            canSubmit: false,
            message: "Only customers who purchased this product can post a review.",
        }
    }

    if (existingReview?.status === "pending") {
        return {
            signedIn: true,
            purchased: true,
            existingReviewStatus: "pending",
            canSubmit: false,
            message: "Your review is awaiting approval.",
        }
    }

    if (existingReview?.status === "approved") {
        return {
            signedIn: true,
            purchased: true,
            existingReviewStatus: "approved",
            canSubmit: false,
            message: "You have already reviewed this product.",
        }
    }

    return {
        signedIn: true,
        purchased: true,
        existingReviewStatus: null,
        canSubmit: true,
    }
}

