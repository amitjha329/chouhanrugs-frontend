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
import getRelatedProducts from '@/backend/serverActions/getRelatedProduct'
import InformationTabs from '@/ui/Layout/ProductPage/InformationTabs'
import { getColorsList } from '@/backend/serverActions/getColorsList'
import { getSizesList } from '@/backend/serverActions/getSizesList'

export async function generateMetadata(props: { params: Promise<{ productId: string }> }): Promise<Metadata> {
    const params = await props.params;
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

const ProductPage = async (props: { params: Promise<{ productId: string }> }) => {
    const params = await props.params;

    const {
        productId
    } = params;

    const dataPromise = getProductWithSlug(productId)
    const colorListPromise = getColorsList()
    const sizeListPromise = getSizesList()
    const [data, colorList, sizeList] = await Promise.all([dataPromise, colorListPromise, sizeListPromise])
    if (data == undefined) return notFound();
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    const relatedProdcust = await getRelatedProducts(data)
    return (
        <div className='fluid_container'>
            <div className='flex max-md:flex-col gap-10'>
                <ImageSection imageArray={data.images} mobile={isMobile} className='md:basis-1/2 overflow-hidden' />
                <PriceAndVariation product={data} />
            </div>
            <InformationTabs product={data} />
            <ProductCarouselBasic products={relatedProdcust} sectionHeading='Related Products' />
        </div>
    )
}

export default ProductPage