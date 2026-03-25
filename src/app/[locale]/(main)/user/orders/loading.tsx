import React from 'react'

const OrderCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        {/* Header */}
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                    <div className="h-2.5 w-16 bg-gray-200 rounded mb-1.5" />
                    <div className="h-2 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
        </div>

        {/* Content */}
        <div className="p-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div>
                        <div className="h-2 w-8 bg-gray-200 rounded mb-1" />
                        <div className="h-4 w-14 bg-gray-200 rounded" />
                    </div>
                    <div className="border-l border-gray-200 pl-3 sm:pl-4">
                        <div className="h-2 w-8 bg-gray-200 rounded mb-1" />
                        <div className="h-3 w-6 bg-gray-200 rounded" />
                    </div>
                    <div className="border-l border-gray-200 pl-3 sm:pl-4 hidden sm:block">
                        <div className="h-2 w-12 bg-gray-200 rounded mb-1" />
                        <div className="h-3 w-10 bg-gray-200 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 bg-gray-200 rounded" />
                    <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="px-3 pb-3">
            <div className="bg-gray-50 rounded p-2 border border-gray-100">
                <div className="flex justify-between items-center">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

const OrdersPageSkeleton = () => {
    return (
        <section className="basis-full lg:basis-3/4">
            <div className="mx-auto px-2 sm:px-4">
                <div className="container mx-auto my-2 sm:my-4">
                    {/* Header Section Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 mb-3 animate-pulse">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="h-5 w-24 bg-gray-200 rounded" />
                            <div className="h-7 w-32 sm:w-40 bg-gray-200 rounded" />
                        </div>

                        {/* Filter Tabs Skeleton */}
                        <div className="flex gap-1.5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-7 w-16 sm:w-20 bg-gray-200 rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Orders List Skeleton */}
                    <div className="space-y-2 sm:space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <OrderCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OrdersPageSkeleton
