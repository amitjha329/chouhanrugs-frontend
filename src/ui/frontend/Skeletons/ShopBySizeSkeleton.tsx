import React from 'react'

function ShopBySizeSkeleton() {
    return (
        <div className='flex gap-x-4 items-center max-sm:items-start max-sm:justify-start justify-center'>
            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-80 h-80 max-sm:h-60 max-sm:w-60 skeleton rounded-none">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-80 h-80 max-sm:h-60 max-sm:w-60 skeleton rounded-none">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-80 h-80 max-sm:h-60 max-sm:w-60 skeleton rounded-none">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>

            <div className="text-center mx-3 flex flex-col items-center justify-center">
                <div className="w-80 h-80 max-sm:h-60 max-sm:w-60 skeleton rounded-none">
                </div>
                <div className=" my-2 skeleton h-6 w-24"></div>
            </div>
        </div>
    )
}

export default ShopBySizeSkeleton