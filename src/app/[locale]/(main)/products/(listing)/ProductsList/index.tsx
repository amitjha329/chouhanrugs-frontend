'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import Loader from '@/ui/Loader'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import React, { useEffect, useMemo, useState } from 'react'
import { Configure, Pagination, useHits, useInstantSearch, useSearchBox } from 'react-instantsearch'
import { buildProductAlgoliaParams, PRODUCT_SEARCH_ATTRIBUTES } from '@/lib/algoliaProductFilters'

const ProductList = ({ searchQuery, searchParams, categoryParam, predefinedProducts = [] }: { searchQuery?: string, categoryParam?: string, searchParams?: { [key: string]: string | undefined }, predefinedProducts?: ProductDataModelWithColorMap[] }) => {
    const { items: hits } = useHits({
    })
    const { status } = useInstantSearch()
    const { refine } = useSearchBox()
    const [hasSearchSettled, setHasSearchSettled] = useState(false)

    const algoliaParams = useMemo(() => buildProductAlgoliaParams({
        searchQuery,
        searchParams,
        categoryParam,
    }), [searchQuery, searchParams, categoryParam])

    useEffect(() => {
        refine(searchQuery ?? "")
        setHasSearchSettled(false)
    }, [searchQuery, refine])

    useEffect(() => {
        if (status === "idle") setHasSearchSettled(true)
    }, [status])

    const shouldShowPredefinedProducts = predefinedProducts.length > 0 && hits.length === 0 && !hasSearchSettled
    const visibleProducts = shouldShowPredefinedProducts
        ? predefinedProducts
        : (hits as unknown as ProductDataModelWithColorMap[])

    return (
        (<div className="lg:basis-5/6 mx-auto">
            <Configure
                filters={algoliaParams.filters}
                facetFilters={algoliaParams.facetFilters}
                hitsPerPage={16}
                attributesToRetrieve={PRODUCT_SEARCH_ATTRIBUTES}
            />
            {
                searchQuery && <div className='w-full text-start font-semibold text-lg'>Showing Results for &quot;{searchQuery}&quot;</div>
            }
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ~gap-3/7'>
                {/* {
                    predefinedProducts.map(product => {
                        return (
                            <ProductCardItem key={(product._id ?? product.objectID).toString()} {...(product as unknown as ProductDataModelWithColorMap)} sponsered />
                        )
                    })
                } */}
                {
                    visibleProducts.map((product, index) => {
                        return (
                            <ProductCardItem key={(product._id ?? product.objectID).toString()} index={index} {...(product as unknown as ProductDataModelWithColorMap)} />
                        )
                    })
                }
            </div>
            {
                visibleProducts.length == 0 && status != "stalled" && status != "loading" && <div className='w-full min-h-[700px]'>
                    <span className='text-2xl sm:text-9xl font-extrabold opacity-50'>OOPS! <br /> Nothing Found.</span>
                </div>
            }
            {
                status == "stalled" && !shouldShowPredefinedProducts && <Loader />
            }
            {hits.length > 0 && <Pagination classNames={{
                root: "flex",
                list: "flex flex-row join ml-auto",
                link: "btn max-sm:btn-sm btn-outline btn-primary join-item",
                selectedItem: "btn-disabled"
            }} padding={2} />}
            {/* <div ref={ref} className='w-full flex items-center justify-center'>{onScreenIntersection && isLoading && <PuffLoader />}</div> */}
        </div>)
    );
}

export default ProductList
