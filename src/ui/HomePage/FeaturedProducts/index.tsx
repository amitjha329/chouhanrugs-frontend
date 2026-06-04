import SectionTitle from '@/ui/SectionTitle'
import { serializeForClient } from '@/utils/serializeForClient'
import React from 'react'
import { ProductListHotFeatured, ProductListHotFeaturedMobile } from './ProductList'
import { getFeaturedProducts } from '@/backend/serverActions/getFeaturedProducts'
import { getTranslations } from 'next-intl/server'
import { serializeProductCardList } from '@/lib/productCardSerialization'

const FeaturedProducts = async () => {
    const trendingProducts = serializeProductCardList(serializeForClient(await getFeaturedProducts({ limit: 8 })))
    const t = await getTranslations('homepage')

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
