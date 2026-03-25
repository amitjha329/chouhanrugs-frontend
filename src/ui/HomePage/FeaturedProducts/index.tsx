import SectionTitle from '@/ui/SectionTitle'
import getDevice from '@/utils/getDevice'
import { serializeForClient } from '@/utils/serializeForClient'
import { headers } from 'next/headers'
import React from 'react'
import { ProductListHotFeatured, ProductListHotFeaturedMobile } from './ProductList'
import { getFeaturedProducts } from '@/backend/serverActions/getFeaturedProducts'
import { getTranslations } from 'next-intl/server'

const FeaturedProducts = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"

    const trendingProducts = serializeForClient(await getFeaturedProducts({ limit: 8 }))
    const t = await getTranslations('homepage')

    return trendingProducts.length > 0 ? <div className='fluid_container  ~py-5/14 ~px-5/0'>
        <SectionTitle title={t('featuredTitle')} className='text-center py-5' />
        {
            isMobile ? <ProductListHotFeaturedMobile trendingProducts={trendingProducts} /> : <ProductListHotFeatured trendingProducts={trendingProducts} />
        }
    </div> : <></>
}

export default FeaturedProducts