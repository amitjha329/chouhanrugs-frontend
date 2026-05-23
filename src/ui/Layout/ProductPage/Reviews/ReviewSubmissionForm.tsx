'use client'

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { HiOutlinePhotograph, HiOutlineShieldCheck, HiStar } from "react-icons/hi"
import { REVIEW_IMAGE_LIMIT } from "@/lib/reviewConstants"
import { ReviewEligibility } from "@/types/ReviewDataModel"

const FRONTEND_PROFANITY_WORDS = ["fuck", "shit", "bitch", "bastard", "asshole", "damn"]

const ReviewSubmissionForm = ({
    productId,
    eligibility,
}: {
    productId: string
    eligibility: ReviewEligibility
}) => {
    const router = useRouter()
    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null)
    const [formStartedAt] = useState(() => Date.now())

    const profanityDetected = useMemo(() => {
        const content = `${title} ${comment}`.toLowerCase()
        return FRONTEND_PROFANITY_WORDS.some(word => content.includes(word))
    }, [title, comment])

    const canSubmit = eligibility.canSubmit && !isSubmitting && !profanityDetected

    const handleImages = (fileList: FileList | null) => {
        if (!fileList) return
        setImages(Array.from(fileList).slice(0, REVIEW_IMAGE_LIMIT))
    }

    const handleSubmit = async () => {
        if (!eligibility.canSubmit) {
            setStatus({ type: "error", message: eligibility.message || "You cannot submit a review right now." })
            return
        }
        if (!title.trim() || !comment.trim()) {
            setStatus({ type: "error", message: "Please enter a review title and comment." })
            return
        }
        if (profanityDetected) {
            setStatus({ type: "error", message: "Please remove abusive language from your review." })
            return
        }

        setIsSubmitting(true)
        setStatus(null)
        try {
            const data = new FormData()
            data.append("productId", productId)
            data.append("reviewTitle", title)
            data.append("reviewDetailed", comment)
            data.append("reviewRating", String(rating))
            data.append("company", "")
            data.append("formStartedAt", String(formStartedAt))
            images.forEach(file => data.append("images", file))

            const response = await fetch("/api/reviews", {
                method: "POST",
                body: data,
            })
            const payload = await response.json().catch(() => ({ error: "Review submission failed." }))
            if (!response.ok) {
                throw new Error(payload.error || "Review submission failed.")
            }

            setStatus({ type: "success", message: payload.message || "Review submitted successfully." })
            setTitle("")
            setComment("")
            setImages([])
            router.refresh()
        } catch (error) {
            setStatus({ type: "error", message: error instanceof Error ? error.message : "Review submission failed." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="rounded-3xl border border-[#eadfd5] bg-white p-4 shadow-[0_14px_40px_rgba(53,39,24,0.06)] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h3 className="text-sm font-semibold text-[#231814] sm:text-base">Write a review</h3>
                    <p className="mt-1 text-xs leading-5 text-[#75685f] sm:text-sm">
                        Share the craftsmanship, comfort, and finish you received.
                    </p>
                </div>
                {eligibility.purchased ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f5eee7] px-3 py-1 text-[11px] font-medium text-[#7a4a27]">
                        <HiOutlineShieldCheck className="h-4 w-4" />
                        Verified purchaser
                    </span>
                ) : null}
            </div>

            {!eligibility.canSubmit && eligibility.message ? (
                <div className="mt-4 rounded-2xl border border-[#eadfd5] bg-[#fbf8f4] px-4 py-3 text-sm text-[#6d5f55]">
                    {eligibility.message}
                </div>
            ) : null}

            <div className="mt-5 space-y-4">
                <div>
                    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[#8b786d]">Your rating</span>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, index) => {
                            const value = index + 1
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    className="rounded-full p-1"
                                    onClick={() => setRating(value)}
                                    aria-label={`Rate ${value} stars`}
                                >
                                    <HiStar className={`h-6 w-6 ${value <= rating ? "fill-[#d78936] text-[#d78936]" : "text-[#d8cbc0]"}`} />
                                </button>
                            )
                        })}
                    </div>
                </div>

                <label className="form-control">
                    <span className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#8b786d]">Review title</span>
                    <input
                        className="input input-bordered h-11 rounded-2xl border-[#e4d7cc] bg-white text-sm"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        placeholder="Summarize your experience"
                    />
                </label>

                <label className="form-control">
                    <span className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#8b786d]">Your review</span>
                    <textarea
                        className="textarea textarea-bordered min-h-28 rounded-2xl border-[#e4d7cc] bg-white text-sm leading-6"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        placeholder="How did it feel in your space? Mention material quality, color, softness, or finish."
                    />
                </label>

                <div>
                    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[#8b786d]">Photos</span>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#dccfc3] bg-[#fbf8f5] px-4 py-5 text-sm text-[#6f6258]">
                        <HiOutlinePhotograph className="h-5 w-5" />
                        Upload up to {REVIEW_IMAGE_LIMIT} images
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            multiple
                            onChange={event => handleImages(event.target.files)}
                        />
                    </label>
                    {images.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {images.map(file => (
                                <span key={`${file.name}-${file.size}`} className="rounded-full bg-[#f2ebe4] px-3 py-1 text-xs text-[#6c5d52]">
                                    {file.name}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>

                {status ? (
                    <div className={`rounded-2xl px-4 py-3 text-sm ${status.type === "success" ? "bg-[#eef6ee] text-[#23603a]" : "bg-[#fff1ef] text-[#9c3e35]"}`}>
                        {status.message}
                    </div>
                ) : null}

                <button
                    type="button"
                    className="btn h-11 rounded-full border-none bg-[#2b1f18] px-6 text-sm font-medium text-white hover:bg-[#3a2b23] disabled:bg-[#c7b9ad]"
                    disabled={!canSubmit}
                    onClick={() => void handleSubmit()}
                >
                    {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : null}
                    Submit for approval
                </button>
            </div>
        </div>
    )
}

export default ReviewSubmissionForm
