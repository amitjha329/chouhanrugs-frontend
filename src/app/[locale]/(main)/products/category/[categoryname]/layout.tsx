import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import StructureListing from '../../(listing)/ProductsList/Structure'
import CategorySeoBlock from '@/ui/Category/CategorySeoBlock'
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName'
import { DEFAULT_USD_CURRENCY } from '@/lib/defaultCurrency'
import { getPublicAlgoliaConfig } from '@/lib/algoliaConfig'

const ProductListingLayout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ categoryname: string }> }) => {
    const { categoryname } = await params;
    const category = await getCategoriesWithName(decodeURIComponent(categoryname));
    const algolia = await getPublicAlgoliaConfig()
    return (
        <>
            <CategorySeoBlock category={category} />
            <AlgoliaSearchProvider APPID={algolia.ALGOLIA_APPID} KEY={algolia.ALGOLIA_KEY_CLIENT} INDEX={algolia.ALGOLIA_INDEX}>
                <StructureListing userCurrency={DEFAULT_USD_CURRENCY}>
                    {children}
                </StructureListing>
            </AlgoliaSearchProvider>
        </>
    )
}

export default ProductListingLayout
