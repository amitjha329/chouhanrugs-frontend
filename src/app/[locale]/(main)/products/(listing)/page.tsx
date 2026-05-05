import { type Locale } from '@/i18n/routing'
import { getStaticPageMetadata } from '@/lib/pageMetadata'
import { Metadata } from 'next'
import React from 'react'
import ProductList from './ProductsList'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: loc } = await props.params
    return getStaticPageMetadata({
        pageKey: "products",
        locale: loc as Locale,
        path: "products",
        fallbackTitle: "Products | Chouhan Rugs",
        fallbackDescription: "Browse all categories and products from Chouhan Rugs.",
        fallbackKeywords: "jute rugs, jute hand bags, jute basket, cotton rugs, throw blanket, wall hanging macrame",
    })
}

const ProductsListPage = async (props: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
    const searchParams = await props.searchParams;
    return (
        <ProductList searchQuery={searchParams.search?.toString()} searchParams={searchParams} />
    )
}

export default ProductsListPage
