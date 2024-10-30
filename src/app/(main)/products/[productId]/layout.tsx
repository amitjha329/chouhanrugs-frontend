import { ProductDataContextProvider } from '@/app/providers'
import { getProductWithSlug } from '@/backend/serverActions/getProductWithSlug'
import getSiteData from '@/backend/serverActions/getSiteData'
import generateProductBreadCrumbs from '@/utils/generateProductBreadCrumbs'
import generateProductJsonLd from '@/utils/generateProductJsonLd'
import { notFound } from 'next/navigation'
import React from 'react'

const ProductLayout = async (
    props: { params: Promise<{ productId: string }>, children: React.ReactNode }
) => {
    const params = await props.params;

    const {
        productId
    } = params;

    const {
        children
    } = props;

    const [productObj, siteData] = await Promise.all([getProductWithSlug(productId), getSiteData()])
    if (productObj == undefined) notFound()
    return (
        <>
            {
                productObj && <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={generateProductJsonLd(productObj)}
                        key="product-jsonld"></script>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={generateProductBreadCrumbs(productObj, siteData)}
                        key="product-breadcrumbs"></script>
                </>
            }
            <ProductDataContextProvider product={productObj}>
                {
                    children
                }
            </ProductDataContextProvider>
        </>
    )
}

export default ProductLayout