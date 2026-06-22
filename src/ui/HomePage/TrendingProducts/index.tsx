import SectionTitle from '@/ui/SectionTitle'
import React from 'react'
import { ProductListHotTrending, ProductListHotTrendingMobile } from './ProductList'
import { getTranslations } from 'next-intl/server'
import { getHotTrendingProducts } from '@/backend/serverActions/getHotTrendingProducts'
import { serializeForClient } from '@/utils/serializeForClient'
import { serializeProductCardList } from '@/lib/productCardSerialization'

const TrendingProducts = async () => {
    const [t, trendingProducts] = await Promise.all([
        getTranslations('homepage'),
        getHotTrendingProducts({ limit: 10 }),
    ])
    const products = serializeProductCardList(serializeForClient(trendingProducts))

    if (products.length === 0) return null

    return (
        <div className='fluid_container  ~py-5/14 ~px-3.5/0'>
            <SectionTitle title={t('trendingTitle')} className='text-center py-5' />
            <div className="hidden md:block">
                <ProductListHotTrending trendingProducts={products} />
            </div>
            <div className="md:hidden">
                <ProductListHotTrendingMobile trendingProducts={products} />
            </div>
        </div>
    )
}

export default TrendingProducts
