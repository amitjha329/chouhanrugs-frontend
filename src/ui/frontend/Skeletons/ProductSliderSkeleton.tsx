import React from 'react'
import ProductCardSkeleton from './ProductCardSkeleton'

function ProductSliderSkeleton() {
    return (
        <div className='flex gap-x-4 items-center justify-center'>
            <ProductCardSkeleton/>
            <ProductCardSkeleton/>
            <ProductCardSkeleton className='max-md:hidden' />
            <ProductCardSkeleton className='max-xl:hidden' />
        </div>
    )
}

export default ProductSliderSkeleton