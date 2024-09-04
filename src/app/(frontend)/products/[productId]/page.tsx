import getColorsList from '@/lib/actions/getColorsList'
import getSizeList from '@/lib/actions/getSizeList'
import ProductImageGallery from '@/ui/frontend/Product/ProductImageGallery'
import ProductPriceAndVariation from '@/ui/frontend/Product/ProductPriceAndVariation'
import React from 'react'
import StickyBox from 'react-sticky-box'
import ProductDetailTabs from '@/ui/frontend/Product/ProductDetailTabs'
import BulkPurchase from '@/ui/frontend/Product/BulkPurchase'
import { Metadata } from 'next';
import getProductWithSlug from '@/lib/actions/getProductWithSlug'
import getSiteData from '@/lib/actions/getSiteData'
import { notFound, redirect } from 'next/navigation'
import ProductSliderClient from '@/ui/frontend/Sections/Home/ProductSliderClient'
import { headers } from 'next/headers'
import BreadCrumb from '@/ui/frontend/Product/BreadCrumb'
import SpecialFeatures from '@/ui/frontend/Product/SpecialFeatures'
import ProductNameBrand from '@/ui/frontend/Product/ProductNameBrand'


export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    const data = await getProductWithSlug(params.productId)
    if (data == undefined) return {}
    const dataAdditional = await getSiteData()
    return {
        title: data.productName,
        description: data.productDescriptionShort,
        // keywords: data.pageKeywords,
        openGraph: {
            title: data.productName,
            description: data.productDescriptionShort,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: data.images.map((image: string) => {
                return { url: image }
            })
        },
        twitter: {
            title: data.productName,
            description: data.productDescriptionShort,
            card: "summary",
            images: dataAdditional.logoSrc,
        },
        alternates: {
            canonical: `${dataAdditional.url}products/${params.productId}`
        }
    }
}

const ProductPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const [colors, sizes] = await Promise.all([getColorsList(), getSizeList()])
    const isMobile = headers().get('user-agent')!.includes("Mobile")
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <BreadCrumb />
            <div className="flex flex-col md:flex-row -mx-4 items-start">
                <StickyBox className="md:basis-1/2 px-4 hidden sm:block">
                    <ProductImageGallery mobile={isMobile} className='flex ' />
                </StickyBox>
                <ProductImageGallery className="sm:hidden w-full" mobile={isMobile} />
                <div className="md:basis-1/2 px-4">
                    <ProductNameBrand />
                    <ProductPriceAndVariation searchParams={searchParams} colorList={colors} sizeList={sizes} />
                    <SpecialFeatures />
                    <BulkPurchase colorVaration={colors} sizeVariation={sizes} />
                </div>
            </div>
            <ProductDetailTabs />
            <ProductSliderClient title="Related Products" />
        </div>
    )
}

export default ProductPage