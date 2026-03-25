import React from 'react'
import clsx from 'clsx'

// Skeleton components for loading states
const HeroSkeleton = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={clsx('flex w-full overflow-hidden relative', { "flex-col": isMobile })}>
        {/* Background placeholder for desktop */}
        {!isMobile && <div className="absolute inset-0 bg-secondary/80 z-10"></div>}
        
        {/* Slider area */}
        <div className={clsx("z-30", { "~lg/2xl:~w-[40rem]/[60rem]": !isMobile }, { "w-full": isMobile })}>
            <div className={clsx(
                "w-full bg-gray-300 animate-pulse",
                isMobile ? "aspect-[16/9]" : "aspect-[4/3] min-h-[400px]"
            )}></div>
        </div>
        
        {/* Section title for mobile */}
        {isMobile && (
            <div className="lg:hidden pt-3 flex justify-center">
                <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
            </div>
        )}
        
        {/* Categories grid */}
        <div className="flex-grow w-full z-30 grid grid-cols-4 justify-center ~gap-1/3 items-center ~px-2/10 py-5">
            {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-2 ~min-h-32/40 flex flex-col items-center justify-start">
                    <div className="~w-16/24 ~h-20/28 overflow-hidden rounded-xl border-white border-2 bg-gray-300 animate-pulse mx-auto"></div>
                    <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
            ))}
            <span className="~text-xl/3xl ~max-w-20/52 font-bold ml-2 max-lg:hidden">
                <div className="h-8 w-40 bg-gray-300 rounded animate-pulse"></div>
            </span>
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
