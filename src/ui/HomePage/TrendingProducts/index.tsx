import SectionTitle from '@/ui/SectionTitle'
import getDevice from '@/utils/getDevice'
import { headers } from 'next/headers'
import React from 'react'
import { ProductListHotTrending, ProductListHotTrendingMobile } from './ProductList'

const TrendingProducts = async () => {
    const header = headers()
    const isMobile = getDevice({ headers: header }) == "mobile"

    return (
        <div className='fluid_container  ~py-5/14 ~px-5/0'>
            <SectionTitle title='Hot &amp; Trending Products' className='text-center py-5' />
            {
                isMobile ? <ProductListHotTrendingMobile /> : <ProductListHotTrending />
            }
        </div>
    )
}

export default TrendingProducts