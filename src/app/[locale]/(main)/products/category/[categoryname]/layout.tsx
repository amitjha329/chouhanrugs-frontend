import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import StructureListing from '../../(listing)/ProductsList/Structure'
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName'
import { DEFAULT_USD_CURRENCY } from '@/lib/defaultCurrency'
import { getPublicAlgoliaConfig } from '@/lib/algoliaConfig'
import BreadCrumbs from '@/ui/BreadCrumbs'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'

const ProductListingLayout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ categoryname: string, locale: string }> }) => {
    const { categoryname } = await params
    const category = await getCategoriesWithName(decodeURIComponent(categoryname));
    const algolia = await getPublicAlgoliaConfig()
    const categories = await getCategoriesList()
    const categoryAncestors = category.parent?.split(">").filter(Boolean) ?? []
    const categoryPath = [...categoryAncestors, category.name].join(" > ")
    const initialUiState = categoryPath ? {
        [algolia.ALGOLIA_INDEX]: {
            hierarchicalMenu: {
                'hierarchicalCategories.lvl0': [categoryPath],
            },
        },
    } : undefined

    const crumbs = [
        { name: 'Home', link: '/' },
        { name: 'Shop', link: '/products' },
        { name: category.name, link: `/products/category/${category.slug || categoryname}` }
    ]

    return (
        <>
            <div className="container mx-auto px-3 sm:px-0">
                <BreadCrumbs crumbs={crumbs} />
            </div>
            <AlgoliaSearchProvider APPID={algolia.ALGOLIA_APPID} KEY={algolia.ALGOLIA_KEY_CLIENT} INDEX={algolia.ALGOLIA_INDEX} initialUiState={initialUiState}>
                <StructureListing userCurrency={DEFAULT_USD_CURRENCY} categories={categories}>
                    {children}
                </StructureListing>
            </AlgoliaSearchProvider>
        </>
    )
}

export default ProductListingLayout
