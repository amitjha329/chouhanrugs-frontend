import SectionTitle from '@/ui/SectionTitle'
import getDevice from '@/utils/getDevice'
import { headers } from 'next/headers'
import React from 'react'
import { ProductListHotFeatured, ProductListHotFeaturedMobile } from './ProductList'
import { getFeaturedProducts } from '@/backend/serverActions/getFeaturedProducts'

const FeaturedProducts = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"

    const trendingProducts = await getFeaturedProducts({ limit: 8 })

    return trendingProducts.length > 0 ? <div className='fluid_container  ~py-5/14 ~px-5/0'>
        <SectionTitle title='Hot &amp; Trending Products' className='text-center py-5' />
        {
            isMobile ? <ProductListHotFeaturedMobile trendingProducts={trendingProducts} /> : <ProductListHotFeatured trendingProducts={trendingProducts} />
        }
    </div> : <></>
}

export default FeaturedProducts