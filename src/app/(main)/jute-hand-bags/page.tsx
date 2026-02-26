import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import image_1 from "./images/jute-hand-bags-banner.webp"
import category_1 from "./images/cat-1.webp"
import category_2 from "./images/cat-2.webp"
import category_3 from "./images/cat-3.webp"
import category_4 from "./images/cat-4.webp"
import image_step_1 from "./images/step-1.webp"
import image_step_2 from "./images/step-2.webp"
import image_step_3 from "./images/step-3.webp"
import image_step_4 from "./images/step-4.webp"
import image_step_5 from "./images/step-5.webp"
import about_1 from "./images/about-1.webp"
import about_2 from "./images/about-2.webp"
import about_3 from "./images/about-3.webp"
import about_4 from "./images/about-4.webp"
import footer_banner from "./images/footer_banner.webp"
import getSiteData from "@/backend/serverActions/getSiteData"
import getPageData from "@/backend/serverActions/getPageData"
import { getProductsByCategory } from "@/backend/serverActions/getProductsByCategory"
import { ProductDataModel } from "@/types/ProductDataModel"

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */
export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    const pageMeta = await getPageData("hand-bags")
    const title = pageMeta?.pageTitle ?? "Premium Jute Bags | Handmade Jute Hand Bags \u2013 Chouhan Rugs"
    const description =
        pageMeta?.pageDescription ??
        "Shop handmade jute hand bags crafted in Jaipur. Eco-friendly, stylish jute handbags available in USA & UK. Premium quality by Chouhan Rugs."
    const keywords =
        pageMeta?.pageKeywords ??
        "jute hand bags, premium jute bags, handmade jute bags, stylish jute handbags, jute hand bags in usa, jute hand bags in uk, jute hand bags seller in usa"
    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: image_1.src,
        },
        twitter: {
            title,
            card: "summary_large_image",
            description,
            images: image_1.src,
        },
        alternates: {
            canonical: `${dataAdditional.url}jute-hand-bags`,
        },
    }
}

/* ------------------------------------------------------------------ */
/*  Journey steps                                                     */
/* ------------------------------------------------------------------ */
const journeySteps = [
    {
        step: "01",
        title: "Choosing Premium Jute Fiber",
        description:
            "The process starts with selecting quality natural jute to create long-lasting jute bags. The jute is cleaned and sorted to provide strength, texture, and longevity before it can be used to make jute bags.",
        image: image_step_1,
    },
    {
        step: "02",
        title: "Weaving of Jute Fabric",
        description:
            "Once organized, jute is woven using traditional techniques to create a sturdy, long-lasting piece of cloth. These fabrics form the inspiration of our Stylish Handmade Handbags, making sure breathability, durability, and environmental sustainability.",
        image: image_step_2,
    },
    {
        step: "03",
        title: "Cutting & Design Shaping",
        description:
            "The jute material is then cut accurately to match the handbag's design and size, including all handle lengths, panel sizes and pocket dimensions to ensure overall balance and finish of each item.",
        image: image_step_3,
    },
    {
        step: "04",
        title: "Weaving",
        description:
            "Our expert and skilled artisan easily able to weave all pieces of jute heavy duty thread for more strength and durability. Our bags can use in daily life without any hurdle; attachment of handle is firm with reinforcement. Strong cotton thread is used to join the pieces of jute thread.",
        image: image_step_4,
    },
    {
        step: "05",
        title: "Finishing & Quality Check",
        description:
            "After all the jute purses are created, finishing touches which consist of trimming, cleaning, and shaping take location for each bag. We additionally carry out a pleasing inspection of each jute handbag to ensure consistent neatness in end, power, and sturdiness earlier than delivery out. This ensures premium-satisfactory Stylish handbags geared up for customers worldwide.",
        image: image_step_5,
    },
]

/* ------------------------------------------------------------------ */
/*  FAQ data                                                          */
/* ------------------------------------------------------------------ */
const faqs = [
    {
        question: "Which material is used to make hand bags?",
        answer: "The jute hand bags that we manufacture use high-quality natural jute fiber. Jute is an extremely durable fiber that is biodegradable and environmentally sustainable. Therefore, these bags will last for a long time and will also do good for the environment.",
    },
    {
        question: "Can jute hand bags be used daily because they are sturdy enough?",
        answer: "Yes, they are durable and easily used in daily life. Our bags can carry multiple things at a single time like smart phones, books, groceries and more item in it. Also they do not loose or change their original while using them.",
    },
    {
        question: "Are jute handbags eco-friendly?",
        answer: "Our hand bags are made up of organic jute fiber which is eco friendly. Our all products are reusable and we do not use any kind of plastic or synthetic base in our products.",
    },
    {
        question: "How to clean and maintain a jute handbag?",
        answer: "For spot-cleaning your jute handbag, we suggest using a soft, dry or slightly damp cloth. Avoid washing with a washing machine! Jute is a natural fiber and therefore should not be continuously exposed to water! If your jute handbag gets wet, allow it to air dry in the shade and it should be fine!",
    },
    {
        question: "Can I order jute hand bags in bulk?",
        answer: "Yes, we deal in bulk order also. We manufacture jute handbags on order basis for wholesale, retails and promotional markets. Also, we offer best prices according to your quantity of order.",
    },
    {
        question: "Are jute handbags shipped globally?",
        answer: "We ship jute handbags globally. Our jute handbags are packaged in accordance with export standards, and we use reputable logistics companies for safe and timely delivery to your country.",
    },
]

/* ------------------------------------------------------------------ */
/*  Testimonials data                                                 */
/* ------------------------------------------------------------------ */
const testimonials = [
    {
        name: "Sarah M.",
        location: "New York, USA",
        rating: 5,
        text: "Absolutely stunning quality! The braided jute tote I ordered exceeded every expectation. The craftsmanship is clearly artisanal — you can feel the difference from mass-produced bags. Will be ordering again!",
        product: "Braided Jute Tote",
        avatar: "SM",
    },
    {
        name: "Emma W.",
        location: "London, UK",
        rating: 5,
        text: "I've been searching for stylish jute handbags that don't compromise on durability, and Chouhan Rugs delivered. The colorful prints are gorgeous and haven't faded after months of daily use.",
        product: "Colorful Printed Handbag",
        avatar: "EW",
    },
    {
        name: "Priya K.",
        location: "Toronto, Canada",
        rating: 5,
        text: "As someone who cares deeply about sustainability, finding premium jute bags that are also fashion-forward was a dream. The eco-friendly packaging was a lovely touch. 10/10 recommend!",
        product: "Natural Jute Market Bag",
        avatar: "PK",
    },
    {
        name: "Lisa R.",
        location: "Sydney, Australia",
        rating: 4,
        text: "Beautiful bags with incredible attention to detail. The crossbody strap is super comfortable and the bag itself is way more spacious than I expected. Shipping to Australia was faster than quoted.",
        product: "Jute Crossbody",
        avatar: "LR",
    },
]

/* ------------------------------------------------------------------ */
/*  Stats data                                                        */
/* ------------------------------------------------------------------ */
const stats = [
    { value: "12,000+", label: "Bags Handcrafted", suffix: "" },
    { value: "45+", label: "Countries Shipped", suffix: "" },
    { value: "98%", label: "Customer Satisfaction", suffix: "" },
    { value: "200+", label: "Artisan Partners", suffix: "" },
]

/* ------------------------------------------------------------------ */
/*  Category highlights                                               */
/* ------------------------------------------------------------------ */
const categories = [
    { name: "Tote Bags", description: "Spacious everyday essentials", image: category_1, count: 24 },
    { name: "Shoulder Bags", description: "Effortless elegance", image: category_2, count: 18 },
    { name: "Crossbody Bags", description: "Hands-free convenience", image: category_3, count: 12 },
    { name: "Beach Bags", description: "Summer must-haves", image: category_4, count: 15 },
]

/* ------------------------------------------------------------------ */
/*  Inline SVG Icon components                                        */
/* ------------------------------------------------------------------ */
function LeafIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-3.8 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
    )
}

function HandIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-4 0v1" />
            <path d="M14 10V4a2 2 0 0 0-4 0v2" />
            <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
    )
}

function ShieldIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C8.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

function ChevronDownIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

function EyeIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

function CartIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}

function StarIcon({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}

function QuoteIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity={0.15}>
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
    )
}

function TruckIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
            <circle cx="17" cy="18" r="2" />
            <circle cx="7" cy="18" r="2" />
        </svg>
    )
}

function RefreshIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
        </svg>
    )
}

function LockIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}

function HeartIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}

/* ------------------------------------------------------------------ */
/*  Product Card                                                      */
/* ------------------------------------------------------------------ */
function ProductCard({ product, index }: { product: ProductDataModel; index: number }) {
    // Calculate selling price (after discount)
    const variations = product.variations ?? []
    let sellingPrice: number
    let msrpPrice: number
    if (variations.length > 0) {
        sellingPrice = variations.reduce((min, v) => {
            const price = Number(v.variationPrice ?? '0')
            const discount = Number(v.variationDiscount ?? '0')
            const sp = price - (discount / 100) * price
            return isNaN(sp) || sp < 0 ? min : Math.min(min, sp)
        }, Number.POSITIVE_INFINITY)
        msrpPrice = variations.reduce((min, v) => {
            const price = Number(v.variationPrice ?? '0')
            return isNaN(price) || price < 0 ? min : Math.min(min, price)
        }, Number.POSITIVE_INFINITY)
    } else {
        sellingPrice = product.productSellingPrice
        msrpPrice = product.productMSRP
    }

    const hasDiscount = msrpPrice > sellingPrice
    const primaryImage = product.images?.[product.productPrimaryImageIndex] ?? product.images?.[0]
    const productLink = `/products/${product.productURL}`
    const tag = product.tags?.[0] ?? null

    return (
        <Link href={productLink} prefetch={false} className="h-full">
            <article
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-base-300/40 hover:-translate-y-2 h-full flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-base-200 flex-shrink-0">
                    {primaryImage && (
                        <Image
                            src={primaryImage}
                            alt={product.productName}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    )}
                    {/* Tag */}
                    {tag && (
                        <span className="absolute top-4 left-4 bg-primary text-primary-content text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md animate-fade-in">
                            {tag}
                        </span>
                    )}
                    {/* Discount badge */}
                    {hasDiscount && product.productDiscountPercentage && (
                        <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.productDiscountPercentage}
                        </span>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 gap-3">
                        <span
                            className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 translate-y-6 group-hover:translate-y-0 hover:scale-110"
                        >
                            <EyeIcon />
                        </span>
                        <span
                            className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 translate-y-6 group-hover:translate-y-0 delay-75 hover:scale-110"
                        >
                            <CartIcon />
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Rating */}
                    {product.productReviews && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex items-center text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon key={i} className="w-3.5 h-3.5" filled={i < Math.floor(product.productReviews.average)} />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400">({product.productReviews.totalReviews})</span>
                        </div>
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base leading-snug min-h-[2.5rem] line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-2">
                        {product.productName}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold text-lg">${sellingPrice.toFixed(2)}</span>
                            {hasDiscount && (
                                <span className="text-gray-400 text-sm line-through">${msrpPrice.toFixed(2)}</span>
                            )}
                        </div>
                        <span
                            className="text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 group/link"
                        >
                            Details
                            <ArrowRightIcon className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */
const JuteHandBagsPage = async () => {
    const products = await getProductsByCategory("Bags", 8)
    return (
        <>
            {/* ====================================================== */}
            {/*  1. HERO SECTION — Ken Burns bg + staggered text       */}
            {/* ====================================================== */}
            <header className="relative isolate min-h-[92vh] flex items-center justify-center overflow-hidden">
                {/* Background image with Ken Burns */}
                <Image
                    src={image_1}
                    alt="Premium jute bags collection by Chouhan Rugs"
                    fill
                    priority
                    className="object-cover object-center -z-20 animate-ken-burns"
                    sizes="100vw"
                />
                {/* Grain overlay for texture */}
                <div className="absolute inset-0 -z-[15] opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
                {/* Gradient overlay */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/40 to-black/75" />

                {/* Content — staggered fade-in */}
                <div className="mx-auto max-w-4xl px-6 py-32 text-center text-white">
                    <p className="animate-fade-in-down text-sm md:text-base uppercase tracking-[0.35em] font-medium text-amber-200 mb-6">
                        Handcrafted Jute Bags by Chouhan Rugs
                    </p>
                    <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                        Stylish <a href="/products/category/Bags">Jute Hand Bags</a> <br className="hidden sm:block" />
                        <span className="text-amber-100 font-light italic animate-fade-in-up-delay-2">Woven with Purpose</span>
                    </h1>
                    <p className="animate-fade-in-up-delay-2 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-white/80 mb-12">
                        With premium-satisfactory jute bags crafted with sustainably obtained fiber and traditional techniques by using Chouhan Rugs, you&apos;ll be prepared to tackle any task. Lightweight but durable enough for daily use, shopping, traveling, etc., these bags also promote environmentally friendly practices. Our collection includes elegant luxury tote bags, beautifully crafted jute hand bags for women, and other timeless designs that combine sustainability with fashion.
                    </p>
                    <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/products/category/Bags"
                            className="group inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all duration-300 text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
                        >
                            Shop Collection
                            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="#journey"
                            className="group inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 hover:border-white/60 transition-all duration-300 text-sm uppercase tracking-wider"
                        >
                            Our Process
                            <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                        </a>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDownIcon className="w-6 h-6 text-white/60" />
                </div>
            </header>

            {/* ====================================================== */}
            {/*  2. STATS / NUMBERS BAR                                */}
            {/* ====================================================== */}
            <section className="bg-primary text-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
                        {stats.map((stat, i) => (
                            <div key={i} className="group space-y-2">
                                <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white group-hover:scale-110 transition-transform duration-500">
                                    {stat.value}
                                </p>
                                <p className="text-sm sm:text-base uppercase tracking-wider text-white/70 font-medium">
                                    {stat.label}
                                </p>
                                <div className="mx-auto w-8 h-0.5 bg-white/20 group-hover:w-16 group-hover:bg-amber-300 transition-all duration-500 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  3. SHOP BY CATEGORY — hover cards                     */}
            {/* ====================================================== */}
            <section className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                            Browse
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-gray-600">Find the perfect jute companion for every occasion.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <Link
                                key={i}
                                href="/products/category/Bags"
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-primary/80 group-hover:via-primary/30 transition-all duration-500" />
                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                    <p className="text-xs uppercase tracking-widest text-white/70 mb-1">{cat.count} Products</p>
                                    <h3 className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform duration-300">{cat.name}</h3>
                                    <p className="text-sm text-white/80 group-hover:text-white transition-colors">{cat.description}</p>
                                    <div className="mt-3 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        Explore <ArrowRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  4. JOURNEY / STORY SECTION                            */}
            {/* ====================================================== */}
            <section id="journey" className="bg-base-200 py-24 sm:py-32 lg:py-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Section header */}
                    <div className="mx-auto max-w-2xl text-center mb-20">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                            Our Craft
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                            5-Step Making Process of <a href="/jute-hand-bags" className="text-primary underline">Hand Bags</a>
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-600">
                            Each of our jute bags has been cautiously crafted with the useful aid of hand with first-rate natural jute fibers for the wonderful aggregate of sturdiness, sustainability, and traditional format. Our handbag variety consists of all forms of baggage - shoulder luggage, totes, handbags, and buying luggage – which include jute hand bags for women designed for each splendor and practicality.
                        </p>
                    </div>

                    {/* Timeline steps */}
                    <div className="space-y-24 lg:space-y-32">
                        {journeySteps.map((item, index) => {
                            const isEven = index % 2 === 0
                            return (
                                <div
                                    key={item.step}
                                    className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}
                                >
                                    {/* Image */}
                                    <div className="w-full lg:w-1/2 group">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                            {/* Step number badge */}
                                            <span className="absolute top-6 left-6 bg-primary text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg">
                                                Step {item.step}
                                            </span>
                                            {/* Decorative corner */}
                                            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/30 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <div className="w-full lg:w-1/2 space-y-4">
                                        <span className="text-6xl lg:text-8xl font-black text-primary/10 leading-none select-none">
                                            {item.step}
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 -mt-8 lg:-mt-12 relative">
                                            {item.title}
                                        </h3>
                                        <p className="text-base lg:text-lg leading-relaxed text-gray-600 max-w-lg">
                                            {item.description}
                                        </p>
                                        {/* Decorative line */}
                                        <div className="w-16 h-1 bg-primary/30 rounded-full" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  5. PRODUCT GRID                                       */}
            {/* ====================================================== */}
            <section className="bg-white py-24 sm:py-32 lg:py-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Section header */}
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                            The Collection
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                            <Link href="/jute-hand-bags" className="hover:text-primary transition-colors duration-300">Handmade Jute Bags</Link>
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-600">
                            These bags also are favored as Handmade Tote Bags for Women, supplying a undying enchantment with eco-conscious craftsmanship. For customers in search of sophistication with sustainability, our variety additionally includes Designer tote bags that mirror subtle style at the same time as staying environmentally firendly. Many of our top rate collections are styled to healthy the look and feel of <Link href="/products/category/Bags" className="text-primary underline">stylish and luxurious tote bags</Link>, at the same time as retaining the authenticity of handcrafted techniques. Every product reflects our commitment to quality, functionality, and green values. We have wide range of collection in our inventory, which includes best hand bags for women, office hand bags for women, and ladies hand bags for all occasions, each designed to be a sustainable and stylish addition to your wardrobe.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {products.map((product, i) => (
                            <ProductCard key={(product._id ?? product.objectID).toString()} product={product} index={i} />
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <Link
                            href="/products/category/Bags"
                            className="group inline-flex items-center gap-2 bg-primary text-primary-content font-semibold px-10 py-4 rounded-full hover:bg-primary/90 transition-all duration-300 text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
                        >
                            View All Jute Bags
                            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  6. FEATURES / TRUST SECTION — with hover animations   */}
            {/* ====================================================== */}
            <section className="bg-base-200 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                            Why Choose Chouhan Rugs?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Three pillars that define every hand bag we craft.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Feature 1 */}
                        <article className="group bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-green-100">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-700 mb-6 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-green-100">
                                <LeafIcon className="w-8 h-8 group-hover:animate-float" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">100% Eco-Friendly</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our handbags are created using organic jute material, which is eco-friendly and biodegradable, making them an environmentally sound choice. We create handbags in a style that reduces the impact on the environment, providing customers with an attractive, reusable alternative to plastic and man-made bags. Our eco-conscious jute hand bags for women are perfect for those who value both sustainability and fashion.
                            </p>
                        </article>

                        {/* Feature 2 */}
                        <article className="group bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-amber-100">
                            <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 mb-6 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-amber-100">
                                <HandIcon className="w-8 h-8 group-hover:animate-float" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors duration-300">Handcrafted in Rajasthan</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Artisans primarily based in Rajasthan have made those bags. These artisans are almost completely from families with histories of creating those forms of merchandise using conventional methods. Because of the artisan&apos;s fingers-on technique, each piece is true, has extraordinary craftsmanship, and reflects India&apos;s long-lasting artistic legacy. Our collection of Stylish Handmade Handbags and Designer tote bags showcases this heritage fantastically.
                            </p>
                        </article>

                        {/* Feature 3 */}
                        <article className="group bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-blue-100">
                            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-100">
                                <ShieldIcon className="w-8 h-8 group-hover:animate-float" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">Premium Durability</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Each one of our jute bags is made from durable materials that offer years of service! These bags are woven together with a durable thread that creates an incredibly strong product and offers great strength when carrying heavy loads. Additionally, they are reinforced by strong handles and a professionally finished product.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  7. TESTIMONIALS — carousel-like cards                 */}
            {/* ====================================================== */}
            {/* <section className="bg-white py-24 sm:py-32 overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                            Love Letters
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                            What Our Customers Say
                        </h2>
                        <p className="text-lg text-gray-600">
                            Real stories from real people who chose sustainability without compromising style.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {testimonials.map((review, i) => (
                            <article
                                key={i}
                                className="group relative bg-base-200/50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-base-300/60 hover:-translate-y-1"
                            >
                                {/* Quote icon 
                                <div className="absolute top-6 right-6 text-primary">
                                    <QuoteIcon className="w-10 h-10" />
                                </div>

                                {/* Stars 
                                <div className="flex items-center gap-0.5 text-amber-500 mb-4">
                                    {Array.from({ length: review.rating }).map((_, j) => (
                                        <StarIcon key={j} className="w-4 h-4" />
                                    ))}
                                </div>

                                {/* Text 
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4 group-hover:line-clamp-none transition-all">
                                    &ldquo;{review.text}&rdquo;
                                </p>

                                {/* Divider 
                                <div className="w-full h-px bg-base-300/60 mb-4 group-hover:bg-primary/20 transition-colors" />

                                {/* Author 
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                                        <p className="text-xs text-gray-500">{review.location}</p>
                                    </div>
                                </div>

                                {/* Product tag 
                                <div className="mt-4">
                                    <span className="inline-block text-xs bg-primary/10 text-primary font-medium px-3 py-1 rounded-full">
                                        Bought: {review.product}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* ====================================================== */}
            {/*  8. MARQUEE — Trust signals / As Seen In               */}
            {/* ====================================================== */}
            <section className="bg-base-200 py-12 overflow-hidden border-y border-base-300/40">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(2)].map((_, setIdx) => (
                        <div key={setIdx} className="flex items-center gap-12 px-6">
                            {[
                                "★ Handcrafted with Love",
                                "★ Eco-Friendly & Sustainable",
                                "★ Made in Rajasthan, India",
                                "★ Free Shipping on All Orders",
                                "★ Easy Returns",
                                "★ 12,000+ Happy Customers",
                                "★ Premium Quality Jute",
                                "★ Worldwide Delivery",
                            ].map((text, i) => (
                                <span key={`${setIdx}-${i}`} className="text-sm sm:text-base font-semibold text-primary/70 tracking-wide">
                                    {text}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* ====================================================== */}
            {/*  9. SEO CONTENT BLOCK                                  */}
            {/* ====================================================== */}
            <section className="bg-white py-24 sm:py-32 lg:py-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Images collage — with hover animations */}
                        <div className="grid grid-cols-2 gap-4 lg:gap-6">
                            <div className="space-y-4 lg:space-y-6 pt-8">
                                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                                    <Image src={about_1} alt="Braided jute bags by Chouhan Rugs" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                                </div>
                                <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                                    <Image src={about_2} alt="Premium handmade jute bags" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                                </div>
                            </div>
                            <div className="space-y-4 lg:space-y-6">
                                <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                                    <Image src={about_3} alt="Branded jute bags wholesale" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                                </div>
                                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                                    <Image src={about_4} alt="Colorful handmade jute bags from Jaipur" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                                </div>
                            </div>
                        </div>

                        {/* Text content */}
                        <div className="space-y-8">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                                    About Our Jute Bags
                                </p>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-6">
                                    Your Trusted Jute Hand Bags Seller in USA &amp; Beyond
                                </h2>
                            </div>

                            <div className="prose prose-lg prose-gray max-w-none space-y-5 text-gray-600 leading-relaxed">
                                <p>
                                    At Chouhan Rugs, we are proud to be one of the most sought-after destinations for <Link href="/products/category/Bags"><strong>jute hand bags in USA</strong></Link> and <Link href="/products/category/Bags"><strong>jute hand bags in UK</strong></Link>. Our collection of <strong>handmade jute bags</strong> is born at the crossroads of centuries-old Indian craftsmanship and modern, fashion-forward design — resulting in accessories that are as sustainable as they are beautiful.
                                </p>
                                <p>
                                    Every piece in our catalogue qualifies as a <Link href="/products/category/Bags"><strong>stylish jute handbag</strong></Link> that pairs equally well with a weekend brunch outfit or a busy weekday commute. From totes and shoulder bags to clutches and crossbodies, our range ensures there&apos;s a perfect jute companion for every occasion: be it a farmer&apos;s market run, a beach day, or a corporate event.
                                </p>
                                <p>
                                    What sets us apart as a premier <strong>Jute Hand Bags Seller in USA</strong> is our direct relationship with the artisans who weave each bag in Jaipur, Rajasthan. By cutting out middlemen, we deliver <strong>premium jute bags</strong> at prices that respect both the maker and the buyer. Our customers in the United States, United Kingdom, Europe, and Australia trust us for consistent quality, eco-conscious packaging, and a seamless shopping experience.
                                </p>
                                <p>
                                    Jute is one of the most sustainable natural fibers on the planet — it&apos;s biodegradable, requires minimal water to cultivate, and actively enriches the soil it grows in. When you choose a Chouhan Rugs jute bag, you&apos;re making a conscious decision to reduce plastic consumption while supporting fair-trade artisan livelihoods. It&apos;s fashion with a purpose.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Link
                                    href="/products/category/Bags"
                                    className="group inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4 text-base"
                                >
                                    Explore the full collection
                                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  10. SHIPPING & TRUST BADGES                           */}
            {/* ====================================================== */}
            <section className="bg-base-200/60 py-16 sm:py-20 border-y border-base-300/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
                        <div className="group flex items-center gap-5 justify-center sm:justify-start">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                                <TruckIcon />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Free Worldwide Shipping</h4>
                                <p className="text-sm text-gray-500">On all Orders</p>
                            </div>
                        </div>
                        <div className="group flex items-center gap-5 justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                                <RefreshIcon />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">30-Day Easy Returns</h4>
                                <p className="text-sm text-gray-500">No questions asked</p>
                            </div>
                        </div>
                        <div className="group flex items-center gap-5 justify-center sm:justify-end">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                                <LockIcon />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Secure Checkout</h4>
                                <p className="text-sm text-gray-500">SSL encrypted payments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  11. INSTAGRAM / GALLERY SECTION                       */}
            {/* ====================================================== */}
            <section className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                            @chouhanrugs
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                            Follow the Journey
                        </h2>
                        <p className="text-lg text-gray-600">
                            See how our community styles their jute bags. Tag us to get featured!
                        </p>
                    </div>

                    {/* Masonry-style grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                        {[ ].map((img, i) => (
                            <div
                                key={i}
                                className={`group relative overflow-hidden rounded-xl cursor-pointer ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                                    }`}
                            >
                                <div className={`relative ${i === 0 ? "aspect-square" : "aspect-square"}`}>
                                    <Image
                                        src={img}
                                        alt={`Jute bag style inspiration ${i + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes={i === 0 ? "33vw" : "16vw"}
                                    />
                                </div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-500 flex items-center justify-center">
                                    <HeartIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  12. FAQ SECTION — enhanced accordion                  */}
            {/* ====================================================== */}
            <section className="bg-base-200 py-24 sm:py-32">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                            Got Questions?
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Everything you need to know about our handmade jute bags.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group bg-white rounded-xl shadow-sm border border-base-300/40 overflow-hidden [&_summary::-webkit-details-marker]:hidden hover:shadow-md transition-shadow duration-300"
                            >
                                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left font-semibold text-gray-900 hover:text-primary transition-colors duration-200 list-none">
                                    <span className="pr-4">{faq.question}</span>
                                    <span className="shrink-0 w-8 h-8 rounded-full bg-base-200 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-300">
                                        <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-primary transition-all duration-300 group-open:rotate-180" />
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-base-300/40 pt-4">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====================================================== */}
            {/*  13. NEWSLETTER / EMAIL SIGNUP                         */}
            {/* ====================================================== */}
            {/* <section className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-br from-base-200 to-secondary/30 rounded-3xl p-10 sm:p-16 lg:p-20 shadow-sm relative overflow-hidden">
                        /* Decorative circles
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/5 animate-pulse-soft" />
                        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-primary/5 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

                        <div className="relative z-10">
                            <span className="inline-block text-3xl mb-4">✉️</span>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                                Join the Chouhan Rugs Family
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                                Get early access to new arrivals, exclusive discounts, and artisan stories delivered to your inbox. Unsubscribe anytime.
                            </p>

                            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" >
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-5 py-4 rounded-full border border-base-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-300"
                                />
                                <button
                                    type="submit"
                                    className="group bg-primary text-primary-content font-semibold px-8 py-4 rounded-full hover:bg-primary/90 transition-all duration-300 text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-primary/25 hover:scale-105 whitespace-nowrap inline-flex items-center gap-2"
                                >
                                    Subscribe
                                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </form>
                            <p className="text-xs text-gray-400 mt-4">
                                No spam, ever. We respect your privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* ====================================================== */}
            {/*  14. FINAL CTA BANNER — with parallax feel             */}
            {/* ====================================================== */}
            <section className="relative isolate overflow-hidden">
                <Image
                    src={footer_banner}
                    alt="Natural jute bags by Chouhan Rugs"
                    fill
                    className="object-cover -z-20 animate-ken-burns"
                    sizes="100vw"
                />
                <div className="absolute inset-0 -z-10 bg-primary/80 backdrop-blur-[2px]" />
                <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 text-center text-white">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                        Ready to Carry Sustainability in Style?
                    </h2>
                    <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
                        Join thousands of conscious shoppers who trust Chouhan Rugs for premium, handmade jute bags. Free shipping on all orders.
                    </p>
                    <Link
                        href="/products/category/Bags"
                        className="group inline-flex items-center gap-2 bg-white text-primary font-semibold px-10 py-4 rounded-full hover:bg-base-200 transition-all duration-300 text-sm uppercase tracking-wider hover:shadow-xl hover:scale-105"
                    >
                        Shop Jute Hand Bags
                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>
        </>
    )
}

export default JuteHandBagsPage