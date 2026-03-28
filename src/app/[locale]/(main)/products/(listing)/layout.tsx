import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import StructureListing from './ProductsList/Structure'
import { cookies } from 'next/headers'
import getCurrencyList from '@/backend/serverActions/getCurrencyList'
import { getConfigBulk } from '@/lib/services/ConfigService'

const ProductListingLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookie = await cookies()
    const currencies = await getCurrencyList()
    const userCurrency = cookie.get('userCurrency')?.value ? JSON.parse(cookie.get('userCurrency')!.value) : currencies[0]
    const algolia = await getConfigBulk(['ALGOLIA_APPID', 'ALGOLIA_KEY_CLIENT', 'ALGOLIA_INDEX'])
    return (
        <AlgoliaSearchProvider APPID={algolia.ALGOLIA_APPID} KEY={algolia.ALGOLIA_KEY_CLIENT} INDEX={algolia.ALGOLIA_INDEX}>
            <StructureListing userCurrency={userCurrency}>
                {children}
            </StructureListing>
        </AlgoliaSearchProvider>
    )
}

export default ProductListingLayout