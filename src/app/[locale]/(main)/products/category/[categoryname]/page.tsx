import React from 'react'
import { Metadata } from 'next';
import getSiteData from '@/backend/serverActions/getSiteData';
import ProductList from '../../(listing)/ProductsList';
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName';
import getProductPromoted from '@/backend/serverActions/getProductPromoted';
import { type Locale } from '@/i18n/routing';
import { getInitialAlgoliaProducts } from '@/lib/algoliaProducts';
import { localizedAbsoluteUrl, localizedLanguages } from '@/lib/seoCatalog';

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
        },
        alternates: {
            canonical: localizedAbsoluteUrl(dataAdditional.url, path, locale),
            languages: localizedLanguages(dataAdditional.url, () => path),
        }
    }
}

const CategoryProcutListPage = async (props: { params: Promise<{ categoryname: string }> }) => {
    const {categoryname} = await props.params;
    const category = await getCategoriesWithName(decodeURIComponent(categoryname))
    const promotedProducts = await getProductPromoted(category.name)
    const initialProducts = await getInitialAlgoliaProducts({
        categoryParam: category.name,
    })
    return (
        <>
            <ProductList categoryParam={category.name} predefinedProducts={initialProducts.length ? initialProducts : promotedProducts} />
        </>
    )
}

export default CategoryProcutListPage
