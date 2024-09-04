import React from 'react'

function TestimonialsSkeleton() {
    return (
        <div className='flex gap-x-4 items-center justify-center'>
            <div className="w-80 rounded-lg bg-white shadow-lg overflow-hidden m-5">
                <div className="h-[424px] skeleton rounded-none"></div>
                <div className="flex flex-col mx-5 my-7">
                    <div className='skeleton w-full h-5 mb-3'></div>
                    <div className='skeleton w-1/2 h-5'></div>
                </div>
            </div>

            <div className="w-80 rounded-lg bg-white shadow-lg overflow-hidden m-5 max-sm:hidden">
                <div className="h-[424px] skeleton rounded-none"></div>
                <div className="flex flex-col mx-5 my-7">
                    <div className='skeleton w-full h-5 mb-3'></div>
                    <div className='skeleton w-1/2 h-5'></div>
                </div>
            </div>

            <div className="w-80 rounded-lg bg-white shadow-lg overflow-hidden m-5 max-md:hidden">
                <div className="h-[424px] skeleton rounded-none"></div>
                <div className="flex flex-col mx-5 my-7">
                    <div className='skeleton w-full h-5 mb-3'></div>
                    <div className='skeleton w-1/2 h-5'></div>
                </div>
            </div>

            <div className="w-80 rounded-lg bg-white shadow-lg overflow-hidden m-5 max-lg:hidden">
                <div className="h-[424px] skeleton rounded-none"></div>
                <div className="flex flex-col mx-5 my-7">
                    <div className='skeleton w-full h-5 mb-3'></div>
                    <div className='skeleton w-1/2 h-5'></div>
                </div>
            </div>
        </div>
    )
}

export default TestimonialsSkeleton