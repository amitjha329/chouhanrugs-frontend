import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import StructureListing from './ProductsList/Structure'
import { connection } from 'next/server'
import { DEFAULT_USD_CURRENCY } from '@/lib/defaultCurrency'
import { getPublicAlgoliaConfig } from '@/lib/algoliaConfig'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'

const ProductListingLayout = async ({ children }: { children: React.ReactNode }) => {
    await connection()
    const algolia = await getPublicAlgoliaConfig()
    const categories = await getCategoriesList()
    return (
        <AlgoliaSearchProvider APPID={algolia.ALGOLIA_APPID} KEY={algolia.ALGOLIA_KEY_CLIENT} INDEX={algolia.ALGOLIA_INDEX}>
            <StructureListing userCurrency={DEFAULT_USD_CURRENCY} categories={categories}>
                {children}
            </StructureListing>
        </AlgoliaSearchProvider>
    )
}

export default ProductListingLayout
