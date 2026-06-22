import SectionTitle from '@/ui/SectionTitle'
import { serializeForClient } from '@/utils/serializeForClient'
import React from 'react'
import { ProductListHotFeatured, ProductListHotFeaturedMobile } from './ProductList'
import { getFeaturedProducts } from '@/backend/serverActions/getFeaturedProducts'
import { getTranslations } from 'next-intl/server'
import { serializeProductCardList } from '@/lib/productCardSerialization'

const FeaturedProducts = async () => {
    const [featuredProducts, t] = await Promise.all([
        getFeaturedProducts({ limit: 10 }),
        getTranslations('homepage'),
    ])
    const trendingProducts = serializeProductCardList(serializeForClient(featuredProducts))

    return trendingProducts.length > 0 ? <div className='fluid_container  ~py-5/14 ~px-3.5/0'>
        <SectionTitle title={t('featuredTitle')} className='text-center py-5' />
        <div className="hidden md:block">
            <ProductListHotFeatured trendingProducts={trendingProducts} />
        </div>
        <div className="md:hidden">
            <ProductListHotFeaturedMobile trendingProducts={trendingProducts} />
        </div>
    </div> : <></>
}

export default FeaturedProducts
