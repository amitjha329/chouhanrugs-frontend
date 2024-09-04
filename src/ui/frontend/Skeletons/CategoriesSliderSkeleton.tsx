import React from 'react'

function CategoriesSliderSkeleton() {
    return (
        <>
            <div className="carousel-item">
                <div className="card rounded-none w-[100px] carousel-item flex flex-col items-center shadow-md border-[1px] border-gray-200">
                    <div className="min-w-full skeleton h-14 rounded-none">
                    </div>
                    <div className="border-t-2 border-gray-500 flex items-center justify-center w-full">
                        <div className="text-xs skeleton w-4/5 h-4 mt-1"></div>
                    </div>
                </div>
            </div>
            <div className="carousel-item">
                <div className="card rounded-none w-[100px] carousel-item flex flex-col items-center shadow-md border-[1px] border-gray-200">
                    <div className="min-w-full skeleton h-14 rounded-none">
                    </div>
                    <div className="border-t-2 border-gray-500 flex items-center justify-center w-full">
                        <div className="text-xs skeleton w-4/5 h-4 mt-1"></div>
                    </div>
                </div>
            </div>
            <div className="carousel-item">
                <div className="card rounded-none w-[100px] carousel-item flex flex-col items-center shadow-md border-[1px] border-gray-200">
                    <div className="min-w-full skeleton h-14 rounded-none">
                    </div>
                    <div className="border-t-2 border-gray-500 flex items-center justify-center w-full">
                        <div className="text-xs skeleton w-4/5 h-4 mt-1"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoriesSliderSkeleton