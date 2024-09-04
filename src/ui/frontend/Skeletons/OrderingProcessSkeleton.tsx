import React from 'react'

function OrderingProcessSkeleton() {
    return (
        <section className="sm:container mx-auto no-scrollbar mt-10 max-sm:mx-4 card card-bordered shadow-xl rounded-none">
            <div className="text-lg font-medium md:text-3xl m-3 h-9 w-2/3 skeleton"></div>
            <div className='grid md:grid-cols-4 grid-cols-2 gap-2 sm:gap-6 mb-5'>
                <div className='card items-center max-sm:card-side mx-auto w-full'>
                    <div className='skeleton !h-10 md:!h-24 !w-10 md:!w-24 mb-4'>
                    </div>
                    <div className='skeleton h-7 w-36'>
                    </div>
                    <div className='card-body hidden md:block'>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-36'>
                        </div>
                    </div>
                </div>
                <div className='card items-center max-sm:card-side mx-auto w-full'>
                    <div className='skeleton !h-10 md:!h-24 !w-10 md:!w-24 mb-4'>
                    </div>
                    <div className='skeleton h-7 w-36'>
                    </div>
                    <div className='card-body hidden md:block'>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-36'>
                        </div>
                    </div>
                </div>
                <div className='card items-center max-sm:card-side mx-auto w-full'>
                    <div className='skeleton !h-10 md:!h-24 !w-10 md:!w-24 mb-4'>
                    </div>
                    <div className='skeleton h-7 w-36'>
                    </div>
                    <div className='card-body hidden md:block'>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-36'>
                        </div>
                    </div>
                </div>
                <div className='card items-center max-sm:card-side mx-auto w-full'>
                    <div className='skeleton !h-10 md:!h-24 !w-10 md:!w-24 mb-4'>
                    </div>
                    <div className='skeleton h-7 w-36'>
                    </div>
                    <div className='card-body hidden md:block'>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-52 mb-2'>
                        </div>
                        <div className='skeleton h-5 w-36'>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OrderingProcessSkeleton