import React from 'react'

function PopularCategoriesSkeleton() {
    return (
        <section className="container mx-auto my-8 lg:my-24">
            <div className="flex flex-col md:flex-row mx-4 border shadow-xl card card-bordered rounded-none max-sm:mt-10">
                <div className="basis-1/3 hidden max-[480px]:block lg:block relative aspect-square skeleton rounded-none">
                </div>
                <div className="rounded-none cursor-pointer w-full card-side h-44 py-2 hidden max-[480px]:flex mt-2">
                    <div className="relative basis-1/2 sm:my-8 h-auto skeleton rounded-none"></div>
                    <div className="card-body basis-1/2 p-0">
                        <div className="p-5 pb-2 pr-10">
                            <div className="skeleton h-6 mb-2"></div>
                            <p className="h-3 skeleton mb-1"></p>
                            <p className="h-3 skeleton mb-2"></p>
                            <div className="font-semibold flex item-center skeleton h-6 w-20"></div>
                        </div>
                        <div className="card-actions action ml-5 w-36 h-8 skeleton rounded-none"></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:basis-2/3 border-t border-r border-b max-[480px]:hidden">
                    <div className="card card-side lg:!flex-row-reverse hover:shadow-[inset_0_0px_4px_rgba(0,0,0,0.3)] rounded-none carousel-item w-full cursor-pointer">
                        <div className="relative basis-2/5 sm:my-8 h-full sm:h-auto skeleton rounded-none"></div>
                        <div className="card-body basis-3/5">
                            <div className="skeleton h-7"></div>
                            <div className="skeleton h-7 w-1/2"></div>
                            <div className="skeleton h-4"></div>
                            <div className="skeleton h-4"></div>
                            <div className="font-semibold flex item-center h-6 w-20 skeleton">
                                <span className="text-lg"></span>
                                <span className="line-through text-lg place-self-center text-gray-400"></span>
                            </div>
                            <div className="card-actions action justify-end md:justify-start mt-3 h-6 w-20 skeleton rounded-none">
                            </div>
                        </div>
                    </div>

                    <div className="card card-side lg:!flex-row-reverse hover:shadow-[inset_0_0px_4px_rgba(0,0,0,0.3)] rounded-none carousel-item w-full cursor-pointer">
                        <div className="relative basis-2/5 sm:my-8 h-full sm:h-auto skeleton rounded-none"></div>
                        <div className="card-body basis-3/5">
                            <div className="skeleton h-7"></div>
                            <div className="skeleton h-7 w-1/2"></div>
                            <div className="skeleton h-4"></div>
                            <div className="skeleton h-4"></div>
                            <div className="font-semibold flex item-center h-6 w-20 skeleton">
                                <span className="text-lg"></span>
                                <span className="line-through text-lg place-self-center text-gray-400"></span>
                            </div>
                            <div className="card-actions action justify-end md:justify-start mt-3 h-6 w-20 skeleton rounded-none">
                            </div>
                        </div>
                    </div>

                    <div className="card card-side lg:!flex-row-reverse hover:shadow-[inset_0_0px_4px_rgba(0,0,0,0.3)] rounded-none carousel-item w-full cursor-pointer">
                        <div className="relative basis-2/5 sm:my-8 h-full sm:h-auto skeleton rounded-none"></div>
                        <div className="card-body basis-3/5">
                            <div className="skeleton h-7"></div>
                            <div className="skeleton h-7 w-1/2"></div>
                            <div className="skeleton h-4"></div>
                            <div className="skeleton h-4"></div>
                            <div className="font-semibold flex item-center h-6 w-20 skeleton">
                                <span className="text-lg"></span>
                                <span className="line-through text-lg place-self-center text-gray-400"></span>
                            </div>
                            <div className="card-actions action justify-end md:justify-start mt-3 h-6 w-20 skeleton rounded-none">
                            </div>
                        </div>
                    </div>

                    <div className="card card-side lg:!flex-row-reverse hover:shadow-[inset_0_0px_4px_rgba(0,0,0,0.3)] rounded-none carousel-item w-full cursor-pointer">
                        <div className="relative basis-2/5 sm:my-8 h-full sm:h-auto skeleton rounded-none"></div>
                        <div className="card-body basis-3/5">
                            <div className="skeleton h-7"></div>
                            <div className="skeleton h-7 w-1/2"></div>
                            <div className="skeleton h-4"></div>
                            <div className="skeleton h-4"></div>
                            <div className="font-semibold flex item-center h-6 w-20 skeleton">
                                <span className="text-lg"></span>
                                <span className="line-through text-lg place-self-center text-gray-400"></span>
                            </div>
                            <div className="card-actions action justify-end md:justify-start mt-3 h-6 w-20 skeleton rounded-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularCategoriesSkeleton