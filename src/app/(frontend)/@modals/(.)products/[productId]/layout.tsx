import { ProductDataContextProvider } from '@/app/providers'
import getProductWithSlug from '@/lib/actions/getProductWithSlug'
import getSiteData from '@/lib/actions/getSiteData'
import generateProductBreadCrumbs from '@/lib/utilities/generateProductBreadCrumbs'
import generateProductJsonLd from '@/lib/utilities/generateProductJsonLd'
import { notFound } from 'next/navigation'
import React from 'react'

async function ProductLayout({ children, params }: Readonly<{ params: { productId: string }, children: React.ReactNode }>) {
    const [productObj, siteData] = await Promise.all([getProductWithSlug(params.productId), getSiteData()])
    if (productObj == undefined) return notFound()

    return <>
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
            {children}
        </ProductDataContextProvider>
    </>
}

export default ProductLayout