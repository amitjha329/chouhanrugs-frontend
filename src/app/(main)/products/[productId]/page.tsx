import React, { Suspense } from 'react'
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
import { ProductDataModel } from '@/types/ProductDataModel'

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

// Skeleton for related products while loading
function RelatedProductsSkeleton() {
    return (
        <div className="fluid_container mx-auto ~py-10/20 ~px-5/0">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-10" />
            <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[calc(25%-12px)] min-w-[200px]">
                        <div className="space-y-3">
                            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Async component for related products with its own data fetching
async function RelatedProductsSection({ product, isMobile }: { product: ProductDataModel, isMobile: boolean }) {
    const relatedProducts = await getRelatedProducts(product)
    if (!relatedProducts || relatedProducts.length === 0) return null
    return <ProductCarouselBasic products={relatedProducts} sectionHeading='Related Products' isMobile={isMobile} />
}

const ProductPage = async (props: { params: Promise<{ productId: string }> }) => {
    const params = await props.params;

    const {
        productId
    } = params;

    // Fetch product data
    const data = await getProductWithSlug(productId)
    if (data == undefined) return notFound();
    
    // Get device type for responsive rendering
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    
    return (
        <div className='fluid_container'>
            <div className='flex max-md:flex-col gap-10 ~px-5/0'>
                <ImageSection mobile={isMobile} className='md:basis-1/2 overflow-hidden' />
                <PriceAndVariation product={data} />
            </div>
            <InformationTabs product={data} />
            {/* Related products loaded with Suspense for streaming */}
            <Suspense fallback={<RelatedProductsSkeleton />}>
                <RelatedProductsSection product={data} isMobile={isMobile} />
            </Suspense>
        </div>
    )
}

export default ProductPage