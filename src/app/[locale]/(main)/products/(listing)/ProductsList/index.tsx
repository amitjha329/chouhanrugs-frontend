'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import Loader from '@/ui/Loader'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import React, { useEffect } from 'react'
import { Configure, Pagination, useHits, useInstantSearch, useSearchBox } from 'react-instantsearch'

const ProductList = ({ searchQuery, searchParams, categoryParam, predefinedProducts = [] }: { searchQuery?: string, categoryParam?: string, searchParams?: { [key: string]: string | undefined }, predefinedProducts?: ProductDataModelWithColorMap[] }) => {
    const { items: hits } = useHits({
    })
    const { status } = useInstantSearch()
    const { refine } = useSearchBox()

    const decodedCategory = decodeURIComponent(categoryParam ?? '')
    const configureFilters: string[] = []
    const configureFacetFilters: string[][] = []

    if (decodedCategory) {
        configureFilters.push(decodedCategory === 'Rugs & Runners'
            ? '(productCategory:"Hemp Rugs" OR productCategory:"Wool Jute Kilim Rugs" OR productCategory:"Braided Jute Rug")'
            : `productCategory:"${decodedCategory}"`)
    }

    if (searchParams?.color) {
        configureFacetFilters.push([`variations.variationColor:${decodeURIComponent(searchParams.color)}`])
    }

    if (searchParams?.size) {
        configureFacetFilters.push([`variations.variationSize:${decodeURIComponent(searchParams.size)}`])
    }

    const normalizedTag = decodeURIComponent(searchParams?.tags ?? '').trim().toLowerCase()
    const normalizedCollection = decodeURIComponent(searchParams?.collection ?? '').trim().toLowerCase()
    const normalizedSort = decodeURIComponent(searchParams?.sort ?? '').trim().toLowerCase()

    if (normalizedSort === 'new' || normalizedCollection === 'new-arrivals' || normalizedTag === 'new-arrivals') {
        configureFilters.push('tags:"New Arrivals"')
    }

    if (
        normalizedCollection === 'best-sellers'
        || normalizedTag === 'best-seller'
        || normalizedTag === 'best-sellers'
        || normalizedTag === 'top-selling'
        || normalizedTag === 'top selling'
    ) {
        configureFilters.push('tags:"Top Selling"')
    }

    useEffect(() => {
        refine(searchQuery ?? "")
    }, [searchQuery])

    return (
        (<div className="lg:basis-5/6 mx-auto">
            <Configure
                filters={configureFilters.length > 0 ? configureFilters.join(' AND ') : undefined}
                facetFilters={configureFacetFilters.length > 0 ? configureFacetFilters : undefined}
            />
            {
                searchQuery && <div className='w-full text-start font-semibold text-lg'>Showing Results for &quot;{searchQuery}&quot;</div>
            }
            <div className='grid grid-cols-3 lg:grid-cols-4 ~gap-3/7'>
                {/* {
                    predefinedProducts.map(product => {
                        return (
                            <ProductCardItem key={(product._id ?? product.objectID).toString()} {...(product as unknown as ProductDataModelWithColorMap)} sponsered />
                        )
                    })
                } */}
                {
                    hits.map(product => {
                        return (
                            <ProductCardItem key={(product._id ?? product.objectID).toString()} {...(product as unknown as ProductDataModelWithColorMap)} />
                        )
                    })
                }
            </div> z
            {
                hits.length == 0 && status != "stalled" && status != "loading" && <div className='w-full min-h-[700px]'>
                    <span className='text-2xl sm:text-9xl font-extrabold opacity-50'>OOPS! <br /> Nothing Found.</span>
                </div>
            }
            {
                status == "stalled" && <Loader />
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
