import { AlgoliaSearchProvider } from '@/app/providers'
import StructureListing from '@/ui/frontend/Sections/ProductsList/Structure'
import React from 'react'

const ProductListingLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <AlgoliaSearchProvider APPID={process.env.ALGOLIA_APPID ?? ""} KEY={process.env.ALGOLIA_KEY_CLIENT ?? ""} INDEX={process.env.ALGOLIA_INDEX ?? ""}>
            <StructureListing>
                {children}
            </StructureListing>
        </AlgoliaSearchProvider>
    )
}

export default ProductListingLayout