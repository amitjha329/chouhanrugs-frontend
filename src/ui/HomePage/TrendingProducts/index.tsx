import SectionTitle from '@/ui/SectionTitle'
import getDevice from '@/utils/getDevice'
import { headers } from 'next/headers'
import React from 'react'
import { ProductListHotTrending, ProductListHotTrendingMobile } from './ProductList'
import { getTranslations } from 'next-intl/server'

const TrendingProducts = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    const t = await getTranslations('homepage')

    return (
        <div className='fluid_container  ~py-5/14 ~px-5/0'>
            <SectionTitle title={t('trendingTitle')} className='text-center py-5' />
            {
                isMobile ? <ProductListHotTrendingMobile /> : <ProductListHotTrending />
            }
        </div>
    )
}

export default TrendingProducts