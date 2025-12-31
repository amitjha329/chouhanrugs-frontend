import React from 'react'

// Skeleton components for loading states
const HeroSkeleton = () => (
    <div className="w-full h-[400px] md:h-[500px] bg-gray-200 animate-pulse flex">
        <div className="w-full md:w-[60%] bg-gray-300"></div>
        <div className="hidden md:grid flex-grow grid-cols-4 gap-3 p-10">
            {[...Array(7)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-20"></div>
            ))}
        </div>
    </div>
)

const SectionTitleSkeleton = () => (
    <div className="flex justify-center py-5">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
    </div>
)

const ProductCardSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden w-full animate-pulse">
        <div className="h-52 md:h-60 bg-gray-200"></div>
        <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
    </div>
)

const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[...Array(count)].map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
)

const CategorySkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 py-10">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 md:h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
    </div>
)

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <HeroSkeleton />
            
            {/* New Products Section */}
            <div className="fluid_container mx-auto py-10 px-5 md:px-0">
                <SectionTitleSkeleton />
                <ProductGridSkeleton count={8} />
            </div>
            
            {/* Featured Products Section */}
            <div className="fluid_container mx-auto py-10 px-5 md:px-0">
                <SectionTitleSkeleton />
                <ProductGridSkeleton count={8} />
            </div>
            
            {/* Order Process Skeleton */}
            <div className="fluid_container mx-auto py-10 px-5 md:px-0">
                <SectionTitleSkeleton />
                <div className="flex justify-center gap-10 py-10">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Popular Categories Skeleton */}
            <div className="fluid_container mx-auto py-10 px-5 md:px-0">
                <SectionTitleSkeleton />
                <CategorySkeleton />
            </div>
            
            {/* Trending Products Section */}
            <div className="fluid_container mx-auto py-10 px-5 md:px-0">
                <SectionTitleSkeleton />
                <ProductGridSkeleton count={8} />
            </div>
        </div>
    )
}

// Export skeleton components for use in Suspense boundaries
export { HeroSkeleton, SectionTitleSkeleton, ProductCardSkeleton, ProductGridSkeleton, CategorySkeleton }
