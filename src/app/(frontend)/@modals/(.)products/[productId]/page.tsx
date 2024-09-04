import getColorsList from '@/lib/actions/getColorsList'
import getProductWithSlug from '@/lib/actions/getProductWithSlug'
import getSizeList from '@/lib/actions/getSizeList'
import ProductQuickViewViewMoreBtn from '@/ui/frontend/Buttons/ProductQuickViewViewMoreBtn'
import ProductImageGallery from '@/ui/frontend/Product/ProductImageGallery'
import ProductPriceAndVariation from '@/ui/frontend/Product/ProductPriceAndVariation'
import RouteModal from '@/ui/frontend/RouteModal'
import { notFound } from 'next/navigation'
import React from 'react'

const ProductModal = async ({ params, searchParams }: { params: { productId: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {
    const productData = await getProductWithSlug(params.productId)
    const colors = await getColorsList()
    const sizes = await getSizeList()
    if (productData == undefined) return notFound()
    return (
        <RouteModal className='min-w-[900px] flex flex-row gap-5'>
            <div className='basis-1/2'>
                <ProductImageGallery mobile={true} />
            </div>
            <div className='basis-1/2'>
                <h2 className="mb-2 leading-tight tracking-tight font-semibold text-gray-800 text-xl md:text-3xl">{productData?.productName}</h2>
                <p className="text-gray-500 text-sm">By <a href="#" className="text-primary hover:underline">{productData?.productBrand}</a></p>
                <ProductPriceAndVariation searchParams={searchParams} colorList={colors} sizeList={sizes} />
                <ProductQuickViewViewMoreBtn className='btn-primary btn-outline w-full'>Know More</ProductQuickViewViewMoreBtn>
            </div>
        </RouteModal>
    )
}

export default ProductModal