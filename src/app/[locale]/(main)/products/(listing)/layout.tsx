import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import StructureListing from './ProductsList/Structure'
import { connection } from 'next/server'
import { DEFAULT_USD_CURRENCY } from '@/lib/defaultCurrency'
import { getPublicAlgoliaConfig } from '@/lib/algoliaConfig'

const ProductListingLayout = async ({ children }: { children: React.ReactNode }) => {
    await connection()
    const algolia = await getPublicAlgoliaConfig()
    return (
        <AlgoliaSearchProvider APPID={algolia.ALGOLIA_APPID} KEY={algolia.ALGOLIA_KEY_CLIENT} INDEX={algolia.ALGOLIA_INDEX}>
            <StructureListing userCurrency={DEFAULT_USD_CURRENCY}>
                {children}
            </StructureListing>
        </AlgoliaSearchProvider>
    )
}

export default ProductListingLayout
