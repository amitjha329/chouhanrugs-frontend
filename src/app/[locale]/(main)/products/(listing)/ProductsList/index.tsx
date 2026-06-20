'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import React, { useEffect, useMemo, useState } from 'react'
import { Configure, useHits, useInstantSearch, usePagination, useSearchBox, useHierarchicalMenu } from 'react-instantsearch'
import { buildProductAlgoliaParams, PRODUCT_SEARCH_ATTRIBUTES } from '@/lib/algoliaProductFilters'

const ProductPagination = () => {
    const {
        pages,
        currentRefinement,
        nbPages,
        isFirstPage,
        isLastPage,
        refine,
    } = usePagination({
        padding: 2,
    })

    if (nbPages <= 1) {
        return null
    }

    const handlePageChange = (page: number) => {
        refine(page)
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <nav aria-label="Product pagination" className="mt-6 flex items-center justify-end gap-2">
            <button
                type="button"
                aria-label="Previous page"
                className="btn max-sm:btn-sm btn-outline btn-primary"
                disabled={isFirstPage}
                onClick={() => handlePageChange(currentRefinement - 1)}
            >
                Prev
            </button>
            <div className="join">
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        aria-label={`Page ${page + 1}`}
                        aria-current={page === currentRefinement ? 'page' : undefined}
                        className={`btn max-sm:btn-sm btn-outline btn-primary join-item ${page === currentRefinement ? 'btn-disabled' : ''}`}
                        disabled={page === currentRefinement}
                        onClick={() => handlePageChange(page)}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>
            <button
                type="button"
                aria-label="Next page"
                className="btn max-sm:btn-sm btn-outline btn-primary"
                disabled={isLastPage}
                onClick={() => handlePageChange(currentRefinement + 1)}
            >
                Next
            </button>
        </nav>
    )
}

const ProductList = ({ className = "lg:basis-5/6 mx-auto", searchQuery, searchParams, categoryParam, categoryPath, predefinedProducts = [] }: { className?: string, searchQuery?: string, categoryParam?: string, categoryPath?: string, searchParams?: { [key: string]: string | undefined }, predefinedProducts?: ProductDataModelWithColorMap[] }) => {
    const { items: hits } = useHits({
    })
    const { status } = useInstantSearch()
    const { refine } = useSearchBox()
    const { refine: refineHierarchical } = useHierarchicalMenu({
        attributes: [
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
            'hierarchicalCategories.lvl3',
        ],
    })
    const [hasSearchSettled, setHasSearchSettled] = useState(false)

    const algoliaParams = useMemo(() => buildProductAlgoliaParams({
        searchQuery,
        searchParams,
        categoryParam,
        categoryPath,
    }), [searchQuery, searchParams, categoryParam, categoryPath])

    useEffect(() => {
        if (categoryPath) {
            refineHierarchical(categoryPath)
        }
    }, [categoryPath, refineHierarchical])

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
        (<div className={className}>
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
                // status == "stalled" && !shouldShowPredefinedProducts && (
                //     <div className='w-full py-8 flex items-center justify-center'>
                //         <span className="loading loading-dots loading-md text-primary" aria-label="Loading products" />
                //     </div>
                // )
            }
            {hits.length > 0 && <ProductPagination />}
            {/* <div ref={ref} className='w-full flex items-center justify-center'>{onScreenIntersection && isLoading && <PuffLoader />}</div> */}
        </div>)
    );
}

export default ProductList
