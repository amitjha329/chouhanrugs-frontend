'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import Loader from '@/ui/Loader'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import React, { useEffect } from 'react'
import { Configure, Pagination, useHits, useInstantSearch, useSearchBox } from 'react-instantsearch'

/**
 * Sets the HierarchicalMenu refinement programmatically when a category page is opened.
 * Using setIndexUiState (the same mechanism HierarchicalMenu uses internally) means Algolia
 * still returns sibling category facet counts — unlike Configure filters which hard-restricts
 * all facets and breaks the sidebar.
 */
function CategoryRefiner({ hierarchyPath }: { hierarchyPath: string }) {
    const { setIndexUiState } = useInstantSearch()
    useEffect(() => {
        setIndexUiState(prev => ({
            ...prev,
            hierarchicalMenu: {
                'hierarchicalCategories.lvl0': [hierarchyPath]
            }
        }))
    }, [hierarchyPath])
    return null
}

const ProductList = ({ searchQuery, searchParams, categoryParam, hierarchyPath, predefinedProducts = [] }: { searchQuery?: string, categoryParam?: string, hierarchyPath?: string, searchParams?: { [key: string]: string | undefined }, predefinedProducts?: ProductDataModelWithColorMap[] }) => {
    const { items: hits } = useHits({
    })
    const { status } = useInstantSearch()
    const { refine } = useSearchBox()

    useEffect(() => {
        refine(searchQuery ?? "")
    }, [searchQuery])

    return (
        (<div className="lg:basis-5/6 mx-auto">
            {/* Apply category filter via HierarchicalMenu refinement (not Configure filters) */}
            {hierarchyPath && <CategoryRefiner hierarchyPath={hierarchyPath} />}
            {
                searchParams?.color && <Configure facetFilters={[['variations.variationColor:' + decodeURIComponent(searchParams.color)]]} />
            }
            {
                searchParams?.size && <Configure facetFilters={[['variations.variationSize:' + decodeURIComponent(searchParams.size)]]} />
            }
            {
                searchQuery && <div className='w-full text-start font-semibold text-lg'>Showing Results for &quot;{searchQuery}&quot;</div>
            }
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
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
            </div>
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