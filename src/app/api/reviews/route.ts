import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { auth } from "@/lib/auth"
import { getStorefrontDb } from "@/lib/mongodb"
import { ProductDataModel } from "@/types/ProductDataModel"
import { ReviewDataModel } from "@/types/ReviewDataModel"
import {
    applyReviewRateLimit,
    ensureStorefrontReviewIndexes,
    getProfanityError,
    getReviewCollection,
    isValidObjectId,
    uploadReviewImages,
} from "@/lib/reviews"
import { REVIEW_IMAGE_LIMIT } from "@/lib/reviewConstants"
import { resolveLocalizedString } from "@/lib/resolveLocalized"

const MIN_FORM_FILL_MS = 3000

export async function GET(req: NextRequest) {
    const productId = req.nextUrl.searchParams.get("productId") ?? ""
    if (!isValidObjectId(productId)) {
        return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
    }

    const db = await getStorefrontDb()
    const reviews = await getReviewCollection(db)
        .find({ productId, status: "approved" })
        .sort({ publishedAt: -1, submittedAt: -1 })
        .limit(12)
        .toArray()

    const data = reviews.map(review => ({
        ...review,
        _id: String(review._id),
        publishedAt: review.backdatedAt ?? review.publishedAt ?? review.submittedAt,
    }))

    const totalReviews = data.length
    const average = totalReviews > 0
        ? Number((data.reduce((sum, review) => sum + Number(review.reviewRating || 0), 0) / totalReviews).toFixed(1))
        : 0

    return NextResponse.json({ reviews: data, summary: { average, totalReviews } })
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Please sign in to submit a review." }, { status: 401 })
        }

        const formData = await req.formData()
        const productId = String(formData.get("productId") ?? "")
        const reviewTitle = String(formData.get("reviewTitle") ?? "").trim()
        const reviewDetailed = String(formData.get("reviewDetailed") ?? "").trim()
        const reviewRating = Number(formData.get("reviewRating") ?? 0)
        const honeypot = String(formData.get("company") ?? "").trim()
        const formStartedAt = Number(formData.get("formStartedAt") ?? 0)
        const now = Date.now()

        if (honeypot) {
            return NextResponse.json({ error: "Spam submission detected." }, { status: 400 })
        }
        if (!formStartedAt || now - formStartedAt < MIN_FORM_FILL_MS) {
            return NextResponse.json({ error: "Please take a moment before submitting your review." }, { status: 400 })
        }
        if (!isValidObjectId(productId)) {
            return NextResponse.json({ error: "Invalid product id." }, { status: 400 })
        }
        if (!reviewTitle || !reviewDetailed) {
            return NextResponse.json({ error: "Title and comment are required." }, { status: 400 })
        }
        if (!Number.isFinite(reviewRating) || reviewRating < 1 || reviewRating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 })
        }

        const profanityError = getProfanityError(`${reviewTitle} ${reviewDetailed}`)
        if (profanityError) {
            return NextResponse.json({ error: profanityError }, { status: 400 })
        }

        const db = await getStorefrontDb()
        await ensureStorefrontReviewIndexes(db)

        await applyReviewRateLimit(db, `review:${session.user.id}:${productId}`)
        await applyReviewRateLimit(db, `review-ip:${req.headers.get("x-forwarded-for") ?? "local"}:${productId}`)

        const product = await db.collection<ProductDataModel>("products").findOne({
            _id: new ObjectId(productId),
            productActive: true,
            productStatus: { $nin: ["Draft", "Archived"] },
        })
        if (!product) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 })
        }

        const [existingReview, qualifyingOrder] = await Promise.all([
            getReviewCollection(db).findOne({
                productId,
                userId: session.user.id,
                status: { $in: ["pending", "approved"] },
            }),
            db.collection("orders").findOne({
                userId: new ObjectId(session.user.id),
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
            return NextResponse.json({ error: "Only customers who purchased this product can post a review." }, { status: 403 })
        }
        if (existingReview?.status === "pending") {
            return NextResponse.json({ error: "Your review is already awaiting approval." }, { status: 409 })
        }
        if (existingReview?.status === "approved") {
            return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 })
        }

        const files = formData.getAll("images").filter(item => item instanceof File) as File[]
        if (files.length > REVIEW_IMAGE_LIMIT) {
            return NextResponse.json({ error: `A maximum of ${REVIEW_IMAGE_LIMIT} images is allowed per review.` }, { status: 400 })
        }

        const reviewImages = files.length ? await uploadReviewImages(productId, files) : []

        const review: ReviewDataModel = {
            productId,
            userId: session.user.id,
            userEmail: session.user.email ?? null,
            userDisplayName: session.user.name || session.user.email?.split("@")[0] || "Customer",
            reviewTitle,
            reviewRating,
            reviewDetailed,
            reviewImages,
            status: "pending",
            reviewSource: "customer",
            isVerifiedPurchase: true,
            submittedAt: now,
            publishedAt: null,
            backdatedAt: null,
            moderatedAt: null,
            moderatedBy: null,
            adminCreatedBy: null,
            productSnapshot: {
                productName: resolveLocalizedString(product.productName, "en-US"),
                productTitle: resolveLocalizedString(product.productTitle ?? product.productName, "en-US"),
                productURL: resolveLocalizedString(product.productURL, "en-US"),
                productCategory: product.productCategory,
            },
        }

        await getReviewCollection(db).insertOne(review)

        return NextResponse.json({
            ack: true,
            message: "Review submitted successfully. It will appear after approval.",
        })
    } catch (error) {
        console.error("[reviews POST]", error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Failed to submit review.",
        }, { status: 500 })
    }
}
