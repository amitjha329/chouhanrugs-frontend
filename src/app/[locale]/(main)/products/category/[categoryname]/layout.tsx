import { AlgoliaSearchProvider } from '@/app/providers'
import React from 'react'
import { cookies } from 'next/headers'
import getCurrencyList from '@/backend/serverActions/getCurrencyList'
import { getConfigBulk } from '@/lib/services/ConfigService'
import StructureListing from '../../(listing)/ProductsList/Structure'
import CategorySeoBlock from '@/ui/Category/CategorySeoBlock'
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName'

const ProductListingLayout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ categoryname: string }> }) => {
    const { categoryname } = await params;
    const category = await getCategoriesWithName(decodeURIComponent(categoryname));
    const cookie = await cookies()
    const currencies = await getCurrencyList()
    const userCurrency = cookie.get('userCurrency')?.value ? JSON.parse(cookie.get('userCurrency')!.value) : currencies[0]
    const algolia = await getConfigBulk(['ALGOLIA_APPID', 'ALGOLIA_KEY_CLIENT', 'ALGOLIA_INDEX'])
    return (
        <>
            <CategorySeoBlock category={category} />
            <AlgoliaSearchProvider APPID={algolia.ALGOLIA_APPID} KEY={algolia.ALGOLIA_KEY_CLIENT} INDEX={algolia.ALGOLIA_INDEX}>
                <StructureListing userCurrency={userCurrency}>
                    {children}
                </StructureListing>
            </AlgoliaSearchProvider>
        </>
    )
}

export default ProductListingLayout