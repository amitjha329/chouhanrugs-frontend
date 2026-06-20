import { type Locale } from '@/i18n/routing'
import { getStaticPageMetadata } from '@/lib/pageMetadata'
import { Metadata } from 'next'
import { connection } from 'next/server'
import React from 'react'
import { searchAlgoliaProductsServerSide } from '@/lib/algoliaProducts'
import { serializeProductCardList } from '@/lib/productCardSerialization'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import ProductListingContainer from './ProductListingContainer'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    await connection()
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
    await connection()
    const searchParams = await props.searchParams;
    
    const searchResultPromise = searchAlgoliaProductsServerSide({
        searchQuery: searchParams.search?.toString(),
        searchParams,
    })
    const categoriesPromise = getCategoriesList()

    const [searchResult, categories] = await Promise.all([
        searchResultPromise,
        categoriesPromise
    ])

    return (
        <ProductListingContainer 
            products={serializeProductCardList(searchResult.hits)} 
            facets={searchResult.facets} 
            totalHits={searchResult.nbHits}
            totalPages={searchResult.nbPages}
            currentPage={searchResult.page}
            categories={categories}
        />
    )
}

export default ProductsListPage
