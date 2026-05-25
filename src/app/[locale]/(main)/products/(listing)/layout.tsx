import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import StructureListing from './ProductsList/Structure'
import { getConfigBulk } from '@/lib/services/ConfigService'
import { connection } from 'next/server'
import { DEFAULT_USD_CURRENCY } from '@/lib/defaultCurrency'

const ProductListingLayout = async ({ children }: { children: React.ReactNode }) => {
    await connection()
    const algolia = await getConfigBulk(['ALGOLIA_APPID', 'ALGOLIA_KEY_CLIENT', 'ALGOLIA_INDEX'])
    return (
        <AlgoliaSearchProvider APPID={algolia.ALGOLIA_APPID} KEY={algolia.ALGOLIA_KEY_CLIENT} INDEX={algolia.ALGOLIA_INDEX}>
            <StructureListing userCurrency={DEFAULT_USD_CURRENCY}>
                {children}
            </StructureListing>
        </AlgoliaSearchProvider>
    )
}

export default ProductListingLayout
