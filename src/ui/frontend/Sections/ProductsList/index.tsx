'use client'
import React, { useEffect } from 'react'
import ProductsCard from '../../Cards/ProductsCard'
import { ProductDataModelWithColorMap } from '@/lib/types/ProductDataModel'
import { Configure, Pagination, useHits, useSearchBox } from 'react-instantsearch'

const ProductList = ({ searchQuery, searchParams, categoryParam }: { searchQuery?: string, categoryParam?: string, searchParams?: { [key: string]: string | undefined } }) => {
    const { hits } = useHits()
    const { refine } = useSearchBox()

    useEffect(() => {
        searchQuery && refine(searchQuery ?? "")
    }, [searchQuery])

    return (
        <div className="lg:basis-5/6 mx-auto">
            {
                categoryParam && <Configure facetFilters={[['productCategory:' + decodeURIComponent(categoryParam ?? ""), ...(decodeURIComponent(categoryParam ?? "") == "Rugs & Runners") ? ['productCategory:Hemp Rugs', 'productCategory:Wool Jute Kilim Rugs', 'productCategory:Braided Jute Rug'] : []]]} />
            }
            {
                searchParams?.color && <Configure facetFilters={[['variations.variationColor:' + decodeURIComponent(searchParams.color)]]} />
            }
            {
                searchParams?.size && <Configure facetFilters={[['variations.variationSize:' + decodeURIComponent(searchParams.size)]]} />
            }
            {
                searchQuery && <div className='w-full text-start font-semibold text-lg'>Showing Results for &quot;{searchQuery}&quot;</div>
            }
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-10'>
                {
                    hits.map(product => {
                        return (
                            <ProductsCard key={(product._id ?? product.objectID).toString()} productDetails={product as unknown as ProductDataModelWithColorMap} />
                        )
                    })
                }
            </div>
            {
                hits.length == 0 && <div className='w-full min-h-[700px]'>
                    <span className='text-2xl sm:text-9xl font-extrabold opacity-50 absolute top-1/2 left-1/2 -translate-x-1/4'>OOPS! <br /> Nothing Found.</span>
                </div>
            }
            <Pagination classNames={{
                root: "flex",
                list: "flex flex-row join ml-auto",
                link: "btn max-sm:btn-sm btn-outline btn-primary join-item",
                selectedItem: "btn-disabled"
            }} padding={2} />
            {/* <div ref={ref} className='w-full flex items-center justify-center'>{onScreenIntersection && isLoading && <PuffLoader />}</div> */}
        </div>
    )
}

export default ProductList