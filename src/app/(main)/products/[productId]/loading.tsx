import React from 'react'

// Skeleton for the product image gallery
function ImageSectionSkeleton() {
    return (
        <div className="md:basis-1/2 overflow-hidden relative pt-4 md:pt-6">
            {/* Main image skeleton */}
            <div className="rounded-2xl aspect-[4/5] w-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />

            {/* Thumbnail carousel skeleton */}
            <div className="flex gap-3 p-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse flex-shrink-0"
                        style={{ animationDelay: `${i * 100}ms` }}
                    />
                ))}
            </div>
        </div>
    )
}

// Skeleton for product details section
function ProductDetailsSkeleton() {
    return (
        <div className="basis-1/2">
            <div className="p-6 max-w-xl mx-auto space-y-4">
                {/* Brand badge */}
                <div className="h-8 w-32 rounded-md bg-gray-200 animate-pulse" />

                {/* Product title */}
                <div className="h-7 bg-gray-200 rounded animate-pulse w-3/4" />

                {/* Star rating + reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Price row: selling price + MSRP + discount */}
                <div className="flex items-center gap-3">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-7 w-20 bg-green-100 rounded animate-pulse" />
                </div>

                {/* Color & Size dropdowns */}
                <div className="flex flex-row gap-3">
                    <div className="basis-1/2 md:basis-1/3 flex-1 space-y-1">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse" />
                    </div>
                    <div className="basis-1/2 md:basis-1/3 flex-1 space-y-1">
                        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse" />
                    </div>
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-12 w-full max-w-40 rounded-xl bg-gray-200 animate-pulse" />
                </div>

                {/* Action buttons: Buy Now + Add to Cart */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="h-12 flex-1 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-12 flex-1 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                    {/* Bulk + Custom Order */}
                    <div className="flex flex-row gap-3">
                        <div className="h-12 flex-1 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-12 flex-1 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                </div>

                {/* Short description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                </div>

                {/* Features grid 2x2 */}
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-200 animate-pulse flex-shrink-0" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Skeleton for information tabs
function InformationTabsSkeleton() {
    return (
        <>
            {/* Mobile: Accordion skeleton */}
            <div className="w-full max-w-2xl mx-auto md:hidden px-5 space-y-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-2xl animate-pulse" />
                ))}
            </div>

            {/* Desktop: Side tabs skeleton */}
            <div className="hidden md:flex mx-auto flex-row ~py-10/20">
                <div className="flex flex-col">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 w-28 bg-gray-200 animate-pulse" />
                    ))}
                </div>
                <div className="w-full min-h-40 bg-gray-200 animate-pulse ~p-10/16">
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6" />
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5" />
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4" />
                    </div>
                </div>
            </div>
        </>
    )
}

// Skeleton for related products carousel
function RelatedProductsSkeleton() {
    return (
        <div className="fluid_container mx-auto ~py-10/20 ~px-5/0">
            {/* Section title */}
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto ~mb-10/16" />

            {/* Product cards */}
            <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[calc(20%-13px)] min-w-[160px]">
                        <div className="space-y-3">
                            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ProductPageLoading() {
    return (
        <div className="fluid_container">
            <div className="flex max-md:flex-col gap-10 ~px-5/0">
                <ImageSectionSkeleton />
                <ProductDetailsSkeleton />
            </div>
            <InformationTabsSkeleton />
            <RelatedProductsSkeleton />
        </div>
    )
}
