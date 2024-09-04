import React from 'react'

function ShopByColorSkeleton() {
    return (
        <div className='flex gap-x-4 items-center max-sm:items-start max-sm:justify-start justify-center'>
            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-44 h-44 max-sm:h-[120px] max-sm:w-[120px] skeleton rounded-none sm:rounded-full">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-44 h-44 max-sm:h-[120px] max-sm:w-[120px] skeleton rounded-none sm:rounded-full">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-44 h-44 max-sm:h-[120px] max-sm:w-[120px] skeleton rounded-none sm:rounded-full">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-44 h-44 max-sm:h-[120px] max-sm:w-[120px] skeleton rounded-none sm:rounded-full">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-44 h-44 max-sm:h-[120px] max-sm:w-[120px] skeleton rounded-none sm:rounded-full">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-44 h-44 max-sm:h-[120px] max-sm:w-[120px] skeleton rounded-none sm:rounded-full">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>
        </div>
    )
}

export default ShopByColorSkeleton