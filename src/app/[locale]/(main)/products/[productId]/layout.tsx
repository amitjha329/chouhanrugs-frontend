import { ProductDataContextProvider } from '@/app/providers'
import { getSession } from '@/lib/auth-server'
import { getProductWithSlug } from '@/backend/serverActions/getProductWithSlug'
import getSiteData from '@/backend/serverActions/getSiteData'
import generateProductBreadCrumbs from '@/utils/generateProductBreadCrumbs'
import generateProductJsonLd from '@/utils/generateProductJsonLd'
import { notFound } from 'next/navigation'
import React from 'react'
import { type Locale } from '@/i18n/routing'

const ProductLayout = async (
    props: { params: Promise<{ productId: string, locale: string }>, children: React.ReactNode }
) => {
    const params = await props.params;

    const {
        productId,
        locale: loc
    } = params;

    const locale = loc as Locale

    const {
        children
    } = props;

    const [productObj, siteData, session] = await Promise.all([getProductWithSlug(productId), getSiteData(), getSession()])
    if (productObj == undefined) notFound()
    return (
        <>
            {
                productObj && <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={generateProductJsonLd(productObj, locale)}
                        key="product-jsonld"></script>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={generateProductBreadCrumbs(productObj, siteData, locale)}
                        key="product-breadcrumbs"></script>
                </>
            }
            <input value={session?.user?.id ?? ""} id='session_user' className='hidden' readOnly />
            <ProductDataContextProvider product={productObj}>
                {
                    children
                }
            </ProductDataContextProvider>
        </>
    )
}

export default ProductLayout