import { cacheLife, cacheTag } from "next/cache"
import { getStorefrontDb } from "@/lib/mongodb"
import { getReviewCollection, getReviewPublishedTimestamp } from "@/lib/reviews"
import { ReviewDataModel } from "@/types/ReviewDataModel"

async function getApprovedProductReviewsInternal(productId: string) {
    "use cache"

    cacheLife("hours")
    cacheTag(`product-reviews-${productId}`)

    const db = await getStorefrontDb()
    const reviews = await getReviewCollection(db)
        .find({ productId, status: "approved" })
        .sort({ publishedAt: -1, submittedAt: -1 })
        .limit(12)
        .toArray()

    const mapped = reviews.map(review => ({
        ...review,
        _id: String(review._id),
        publishedAt: getReviewPublishedTimestamp(review),
    })) as ReviewDataModel[]

    const totalReviews = mapped.length
    const average = totalReviews > 0
        ? Number((mapped.reduce((sum, review) => sum + Number(review.reviewRating || 0), 0) / totalReviews).toFixed(1))
        : 0

    return {
        reviews: mapped,
        summary: {
            average,
            totalReviews,
        },
    }
}

export const getApprovedProductReviews = getApprovedProductReviewsInternal
