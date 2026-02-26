import Image from "next/image"
import Link from "next/link"
import React from "react"
import { getProductsByCategory } from "@/backend/serverActions/getProductsByCategory"
import { ProductDataModel } from "@/types/ProductDataModel"
import heroImage from "./side-banner.webp"

/* ------------------------------------------------------------------ */
/*  Mini Product Card (compact for the 50% grid)                      */
/* ------------------------------------------------------------------ */
function MiniProductCard({ product }: { product: ProductDataModel }) {
    const variations = product.variations ?? []
    let sellingPrice: number
    let msrpPrice: number
    if (variations.length > 0) {
        sellingPrice = variations.reduce((min, v) => {
            const price = Number(v.variationPrice ?? "0")
            const discount = Number(v.variationDiscount ?? "0")
            const sp = price - (discount / 100) * price
            return isNaN(sp) || sp < 0 ? min : Math.min(min, sp)
        }, Number.POSITIVE_INFINITY)
        msrpPrice = variations.reduce((min, v) => {
            const price = Number(v.variationPrice ?? "0")
            return isNaN(price) || price < 0 ? min : Math.min(min, price)
        }, Number.POSITIVE_INFINITY)
    } else {
        sellingPrice = product.productSellingPrice
        msrpPrice = product.productMSRP
    }
    const hasDiscount = msrpPrice > sellingPrice
    const primaryImage = product.images?.[product.productPrimaryImageIndex] ?? product.images?.[0]

    return (
        <Link href={`/products/${product.productURL}`} prefetch={false} className="h-full">
            <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
                    {primaryImage && (
                        <Image
                            src={primaryImage}
                            alt={product.productName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 40vw, 15vw"
                        />
                    )}
                    {hasDiscount && product.productDiscountPercentage && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {product.productDiscountPercentage}
                        </span>
                    )}
                </div>
                <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 min-h-[2rem] line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-1">
                        {product.productName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-auto">
                        <span className="text-primary font-bold text-sm">${sellingPrice.toFixed(2)}</span>
                        {hasDiscount && (
                            <span className="text-gray-400 text-xs line-through">${msrpPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
const JuteHandBagsShowcase = async () => {
    const products = await getProductsByCategory("Bags", 6)

    if (products.length === 0) return null

    return (
        <section className="~py-10/20 ~px-5/0">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    {/* Left 50% — Hero Image */}
                    <Link href="/jute-hand-bags" className="group relative block rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[550px]">
                        <Image
                            src={heroImage}
                            alt="Handcrafted Jute Hand Bags by Chouhan Rugs"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            placeholder="blur"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {/* Text content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                            <p className="text-xs uppercase tracking-[0.25em] text-amber-200 font-medium mb-2">Handcrafted Collection</p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                                Stylish Jute Hand Bags
                            </h2>
                            <p className="text-white/80 text-sm sm:text-base max-w-md leading-relaxed">
                                Premium jute bags crafted with sustainably obtained fiber and traditional techniques by Chouhan Rugs.
                            </p>
                        </div>
                    </Link>

                    {/* Right 50% — Products + Buttons */}
                    <div className="flex flex-col">
                        {/* Top bar — heading + nav buttons */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Jute Hand Bags</h3>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/jute-hand-bags"
                                    className="text-xs sm:text-sm font-medium text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    Know More
                                </Link>
                                <Link
                                    href="/products/category/Bags"
                                    className="text-xs sm:text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-all duration-300"
                                >
                                    Browse Collection
                                </Link>
                            </div>
                        </div>

                        {/* Product grid — 3 per row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-grow">
                            {products.map((product) => (
                                <MiniProductCard key={(product._id ?? product.objectID).toString()} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JuteHandBagsShowcase
