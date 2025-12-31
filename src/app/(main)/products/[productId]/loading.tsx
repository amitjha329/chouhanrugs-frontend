import React from 'react'

// Skeleton for the product image gallery
function ImageSectionSkeleton() {
    return (
        <div className="md:basis-1/2 overflow-hidden">
            {/* Main image skeleton */}
            <div className="rounded-3xl mb-4 bg-gray-200 animate-pulse md:h-[500px] aspect-square w-full" />
            
            {/* Thumbnail carousel skeleton */}
            <div className="flex gap-3 py-3 pl-2 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse flex-shrink-0"
                    />
                ))}
            </div>
        </div>
    )
}

// Skeleton for product details section
function ProductDetailsSkeleton() {
    return (
        <div className="md:basis-1/2 space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                ))}
            </div>
            
            {/* Product title */}
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            
            {/* Price section */}
            <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
            </div>
            
            {/* Color options */}
            <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    ))}
                </div>
            </div>
            
            {/* Size options */}
            <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-20" />
                <div className="flex gap-2 flex-wrap">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 w-24 rounded-lg bg-gray-200 animate-pulse" />
                    ))}
                </div>
            </div>
            
            {/* Quantity and buttons */}
            <div className="flex gap-4 items-center">
                <div className="h-12 w-32 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-12 flex-1 rounded-lg bg-gray-200 animate-pulse" />
            </div>
            
            {/* Add to wishlist button */}
            <div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />
            
            {/* Product features */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// Skeleton for information tabs
function InformationTabsSkeleton() {
    return (
        <div className="mt-10 space-y-6">
            {/* Tab headers */}
            <div className="flex gap-4 border-b">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-28 bg-gray-200 rounded-t animate-pulse" />
                ))}
            </div>
            
            {/* Tab content */}
            <div className="space-y-4 py-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-4/5" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
        </div>
    )
}

// Skeleton for related products carousel
function RelatedProductsSkeleton() {
    return (
        <div className="py-10 space-y-6">
            {/* Section title */}
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto" />
            
            {/* Product cards */}
            <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[calc(25%-12px)] min-w-[200px]">
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
