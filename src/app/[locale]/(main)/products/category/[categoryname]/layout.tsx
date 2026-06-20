import React from 'react'
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName'
import { getPublicAlgoliaConfig } from '@/lib/algoliaConfig'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import CategorySearchProvider from './CategorySearchProvider'

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
        <CategorySearchProvider
            APPID={algolia.ALGOLIA_APPID}
            KEY={algolia.ALGOLIA_KEY_CLIENT}
            INDEX={algolia.ALGOLIA_INDEX}
            initialUiState={initialUiState}
            categories={categories}
            crumbs={crumbs}
        >
            {children}
        </CategorySearchProvider>
    )
}

export default ProductListingLayout
