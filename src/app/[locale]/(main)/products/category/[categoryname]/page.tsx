import React from 'react'
import { Metadata } from 'next';
import getSiteData from '@/backend/serverActions/getSiteData';
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName';
import getProductPromoted from '@/backend/serverActions/getProductPromoted';
import getCategoriesList from '@/backend/serverActions/getCategoriesList';
import { type Locale } from '@/i18n/routing';
import { searchAlgoliaProductsServerSide } from '@/lib/algoliaProducts';
import { localizedAbsoluteUrl, localizedLanguages } from '@/lib/seoCatalog';
import CategorySeoBlock from '@/ui/Category/CategorySeoBlock';
import { serializeProductCardList } from '@/lib/productCardSerialization';
import ProductListingContainer from '../../(listing)/ProductListingContainer';

function stripHtml(value?: string) {
    return String(value ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}


export async function generateMetadata(props: { params: Promise<{ categoryname: string, locale: string }> }): Promise<Metadata> {
    const params = await props.params;
    const categorySlug = decodeURIComponent(params.categoryname)
    const data = await getCategoriesWithName(categorySlug)
    const dataAdditional = await getSiteData()
    const title = data.seoTitle || data.name
    const description = stripHtml(data.seoDescription) || data.description
    const locale = params.locale as Locale
    const path = `/products/category/${encodeURIComponent(data.slug ?? categorySlug)}`
    return {
        title,
        description,
        // keywords: data.pageKeywords,
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: data.imgSrc
        },
        twitter: {
            title,
            description,
            card: "summary",
            images: dataAdditional.logoSrc,
            // site: "@chouhanrugs",
        },
        alternates: {
            canonical: localizedAbsoluteUrl(dataAdditional.url, path, locale),
            languages: localizedLanguages(dataAdditional.url, () => path),
        }
    }
}

const CategoryProcutListPage = async (props: {
    params: Promise<{ categoryname: string }>,
    searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
    const { categoryname } = await props.params;
    const searchParams = await props.searchParams;

    const category = await getCategoriesWithName(decodeURIComponent(categoryname))
    const categoryAncestors = category.parent?.split(">").filter(Boolean) ?? []
    const categoryPath = [...categoryAncestors, category.name].join(" > ")

    const promotedProductsPromise = getProductPromoted(category.name)
    const categoriesPromise = getCategoriesList()
    const searchResultPromise = searchAlgoliaProductsServerSide({
        categoryParam: category.name,
        categoryPath,
        searchParams,
    })

    const [promotedProducts, categories, searchResult] = await Promise.all([
        promotedProductsPromise,
        categoriesPromise,
        searchResultPromise,
    ])

    const isFiltered = Object.keys(searchParams).filter(k => k !== 'page').length > 0;
    const products = (searchResult.hits.length > 0 || isFiltered) ? searchResult.hits : promotedProducts

    return (
        <ProductListingContainer
            products={serializeProductCardList(products)}
            facets={searchResult.facets}
            totalHits={searchResult.nbHits}
            totalPages={searchResult.nbPages}
            currentPage={searchResult.page}
            categories={categories}
            categoryPath={categoryPath}
        >
            <CategorySeoBlock category={category} />
        </ProductListingContainer>
    )
}

export default CategoryProcutListPage
