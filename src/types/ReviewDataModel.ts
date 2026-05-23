import { ObjectId } from "mongodb"

export type ReviewStatus = "pending" | "approved" | "rejected"
export type ReviewSource = "customer" | "admin"

export interface ReviewDataModel {
    _id?: string | ObjectId
    productId: string
    userId?: string | null
    userEmail?: string | null
    userDisplayName: string
    reviewTitle: string
    reviewRating: number
    reviewDetailed: string
    reviewImages: string[]
    status: ReviewStatus
    reviewSource: ReviewSource
    isVerifiedPurchase: boolean
    productVariationCode?: string | null
    submittedAt: number
    publishedAt?: number | null
    backdatedAt?: number | null
    moderatedAt?: number | null
    moderatedBy?: string | null
    adminCreatedBy?: string | null
    rejectionReason?: string | null
    productSnapshot?: {
        productName: string
        productTitle: string
        productURL?: string
        productCategory?: string
    }
}

export interface ReviewEligibility {
    signedIn: boolean
    purchased: boolean
    existingReviewStatus: ReviewStatus | null
    canSubmit: boolean
    message?: string
}

