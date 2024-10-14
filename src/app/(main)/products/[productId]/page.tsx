import React from 'react'
import { getProductWithSlug } from '@/backend/serverActions/getProductWithSlug'
import getSiteData from '@/backend/serverActions/getSiteData'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ImageSection from '@/ui/Layout/ProductPage/ImageSection'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import PriceAndVariation from '@/ui/Layout/ProductPage/PricingAndVariations'
import ProductCarouselBasic from '@/ui/ProductCarouselBasic'

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    const data = await getProductWithSlug(params.productId)
    if (data == undefined) return {}
    const dataAdditional = await getSiteData()
    return {
        title: data.productName,
        description: data.productDescriptionShort,
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

const ProductPage = async ({ params: { productId } }: { params: { productId: string } }) => {
    const data = await getProductWithSlug(productId)
    if (data == undefined) return notFound();
    const header = headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    return (
        <div className='fluid_container'>
            <div className='flex max-md:flex-col'>
                <ImageSection imageArray={data.images} mobile={isMobile} className='md:basis-1/2 overflow-hidden' />
                <PriceAndVariation product={data} />
            </div>
            <ProductCarouselBasic products={[]} />
        </div>
    )
}

export default ProductPage