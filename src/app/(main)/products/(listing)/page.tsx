import getSiteData from '@/backend/serverActions/getSiteData'
import { Metadata } from 'next'
import React from 'react'
import ProductList from './ProductsList'

export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    const title = "Products | Chouhan Rugs"
    const description = "Browse all the categories and products, find the product that you love."
    const keywords = "jute rugs, jute hand bags, jute basket, cotton rugs, thrown blanket, wall hanging macrame"
    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: dataAdditional.logoSrc
        },
        twitter: {
            title,
            card: "summary",
            description,
            images: dataAdditional.logoSrc,
        },
        alternates: {
            canonical: `${dataAdditional.url}products/`
        }
    }
}

const ProductsListPage = async (props: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
    const searchParams = await props.searchParams;
    return (
        <ProductList searchQuery={searchParams.search?.toString()} searchParams={searchParams} />
    )
}

export default ProductsListPage