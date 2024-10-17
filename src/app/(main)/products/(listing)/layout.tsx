import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import StructureListing from './ProductsList/Structure'
import { cookies } from 'next/headers'
import getCurrencyList from '@/backend/serverActions/getCurrencyList'

const ProductListingLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookie = cookies()
    const currencies = await getCurrencyList()
    const userCurrency = cookie.get('userCurrency')?.value ? JSON.parse(cookie.get('userCurrency')!.value) : currencies[0]
    return (
        <AlgoliaSearchProvider APPID={process.env.ALGOLIA_APPID ?? ""} KEY={process.env.ALGOLIA_KEY_CLIENT ?? ""} INDEX={process.env.ALGOLIA_INDEX ?? ""}>
            <StructureListing userCurrency={userCurrency}>
                {children}
            </StructureListing>
        </AlgoliaSearchProvider>
    )
}

export default ProductListingLayout