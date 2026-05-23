import "server-only"
import sharp from "sharp"
import { Db, ObjectId } from "mongodb"
import { buildFirebaseStoragePath, uploadFileToFirebaseStorage } from "@/utils/firebaseStorage"
import { ReviewDataModel } from "@/types/ReviewDataModel"
import { REVIEW_IMAGE_LIMIT, REVIEW_RATE_LIMIT_MAX_ATTEMPTS, REVIEW_RATE_LIMIT_WINDOW_MS } from "@/lib/reviewConstants"

const REVIEW_COLLECTION = "product_reviews"
const REVIEW_RATE_LIMIT_COLLECTION = "product_review_rate_limits"
const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
])
const PROFANITY_WORDS = [
    "fuck",
    "shit",
    "bitch",
    "bastard",
    "asshole",
    "damn",
]

export function getReviewCollection(db: Db) {
    return db.collection<ReviewDataModel>(REVIEW_COLLECTION)
}

export function isValidObjectId(value: string) {
    return ObjectId.isValid(value)
}

export function getProfanityError(text: string) {
    const normalized = text.toLowerCase()
    const found = PROFANITY_WORDS.find(word => normalized.includes(word))
    return found ? "Please remove abusive language from your review." : null
}

export async function ensureStorefrontReviewIndexes(db: Db) {
    await Promise.all([
        getReviewCollection(db).createIndexes([
            { key: { productId: 1, status: 1, publishedAt: -1 }, name: "product_status_publishedAt" },
            { key: { userId: 1, productId: 1 }, name: "user_product" },
            { key: { status: 1, submittedAt: -1 }, name: "status_submittedAt" },
        ]),
        db.collection(REVIEW_RATE_LIMIT_COLLECTION).createIndex(
            { key: 1, windowStartedAt: 1 },
            { name: "key_windowStartedAt" }
        ),
    ])
}

export async function applyReviewRateLimit(db: Db, key: string) {
    const collection = db.collection(REVIEW_RATE_LIMIT_COLLECTION)
    const now = Date.now()
    const windowStartedAt = now - REVIEW_RATE_LIMIT_WINDOW_MS

    await collection.deleteMany({ windowStartedAt: { $lt: windowStartedAt } })

    const current = await collection.findOne({ key, windowStartedAt: { $gte: windowStartedAt } })
    if (current && Number(current.count ?? 0) >= REVIEW_RATE_LIMIT_MAX_ATTEMPTS) {
        throw new Error("Too many review attempts. Please wait a few minutes and try again.")
    }

    await collection.updateOne(
        { key, windowStartedAt: { $gte: windowStartedAt } },
        {
            $setOnInsert: { key, windowStartedAt: now },
            $inc: { count: 1 },
            $set: { updatedAt: now },
        },
        { upsert: true }
    )
}

export async function optimizeReviewImage(file: File) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new Error(`Unsupported image type: ${file.type}`)
    }

    const sourceBuffer = Buffer.from(await file.arrayBuffer())
    const output = await sharp(sourceBuffer)
        .rotate()
        .resize(1400, 1400, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({
            quality: 82,
            effort: 5,
            alphaQuality: 82,
        })
        .toBuffer()

    const baseName = file.name.replace(/\.[^.]+$/, "") || "review-image"
    return new File([new Uint8Array(output)], `${baseName}.webp`, {
        type: "image/webp",
        lastModified: Date.now(),
    })
}

export async function uploadReviewImages(productId: string, files: File[]) {
    if (files.length > REVIEW_IMAGE_LIMIT) {
        throw new Error(`A maximum of ${REVIEW_IMAGE_LIMIT} images is allowed per review.`)
    }

    const uploads = await Promise.all(files.map(async file => {
        const optimized = await optimizeReviewImage(file)
        const { storagePath } = buildFirebaseStoragePath(optimized, "reviews", productId, "webp")
        const uploaded = await uploadFileToFirebaseStorage(optimized, storagePath)
        return uploaded.url
    }))

    return uploads
}

export function getReviewPublishedTimestamp(review: ReviewDataModel) {
    return review.backdatedAt ?? review.publishedAt ?? review.submittedAt
}
