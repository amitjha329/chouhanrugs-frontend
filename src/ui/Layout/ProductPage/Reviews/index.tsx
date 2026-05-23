import Link from "next/link"
import { HiOutlineShieldCheck, HiStar } from "react-icons/hi"
import { ReviewDataModel, ReviewEligibility } from "@/types/ReviewDataModel"
import ReviewSubmissionForm from "./ReviewSubmissionForm"

const ProductReviewsSection = ({
    productId,
    productTitle,
    summary,
    reviews,
    eligibility,
    locale,
}: {
    productId: string
    productTitle: string
    summary: { average: number; totalReviews: number }
    reviews: ReviewDataModel[]
    eligibility: ReviewEligibility
    locale: string
}) => {
    return (
        <section id="reviews" className="fluid_container pb-12 pt-4 sm:pb-16">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px]">
                <div className="rounded-[28px] border border-[#eadfd5] bg-[#fffdf9] p-4 shadow-[0_14px_40px_rgba(53,39,24,0.05)] sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#efe3d8] pb-5">
                        <div>
                            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#8b786d]">Customer reviews</span>
                            <h2 className="mt-2 text-xl font-semibold text-[#221914] sm:text-2xl">{productTitle}</h2>
                            <p className="mt-2 text-sm leading-6 text-[#75685f]">
                                Published reviews are manually approved, so this section stays useful and credible.
                            </p>
                        </div>
                        <div className="min-w-[170px] rounded-3xl border border-[#eadfd5] bg-white px-4 py-4 text-center">
                            <div className="text-3xl font-semibold text-[#231814]">{summary.average > 0 ? summary.average.toFixed(1) : "0.0"}</div>
                            <div className="mt-2 flex items-center justify-center gap-1 text-[#d78936]">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <HiStar key={index} className={`h-4 w-4 ${index < Math.round(summary.average) ? "fill-current" : "text-[#e5d6ca]"}`} />
                                ))}
                            </div>
                            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#8b786d]">
                                {summary.totalReviews} published review{summary.totalReviews === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {reviews.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#e3d6ca] bg-[#fbf8f4] px-5 py-8 text-sm text-[#6e6056]">
                                No published reviews yet. Verified customers can submit the first review for this product.
                            </div>
                        ) : reviews.map(review => (
                            <article key={String(review._id)} className="rounded-3xl border border-[#ece1d7] bg-white p-4 shadow-[0_10px_28px_rgba(53,39,24,0.04)]">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-semibold text-[#231814]">{review.reviewTitle}</h3>
                                            {review.isVerifiedPurchase ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ede6] px-2.5 py-1 text-[11px] font-medium text-[#7a4a27]">
                                                    <HiOutlineShieldCheck className="h-3.5 w-3.5" />
                                                    Verified purchase
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="mt-1 text-xs text-[#7c6e64]">
                                            {review.userDisplayName} · {new Date(review.publishedAt ?? review.submittedAt).toLocaleDateString(locale)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#d78936]">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <HiStar key={index} className={`h-4 w-4 ${index < review.reviewRating ? "fill-current" : "text-[#e5d6ca]"}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-[#564940]">{review.reviewDetailed}</p>
                                {review.reviewImages?.length ? (
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        {review.reviewImages.map(image => (
                                            <Link
                                                key={image}
                                                href={image}
                                                target="_blank"
                                                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#eadfd5] bg-[#f7f1ea]"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={image} alt={review.reviewTitle} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    {!eligibility.signedIn ? (
                        <div className="mb-4 rounded-3xl border border-[#eadfd5] bg-[#fff8f1] px-4 py-4 text-sm text-[#6e6056]">
                            Sign in first to submit a verified purchase review.
                            <div className="mt-3">
                                <Link href={`/${locale}/signin`} className="btn h-10 rounded-full border-none bg-[#2b1f18] px-5 text-sm font-medium text-white hover:bg-[#3a2b23]">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    ) : null}
                    <ReviewSubmissionForm productId={productId} eligibility={eligibility} />
                </div>
            </div>
        </section>
    )
}

export default ProductReviewsSection

