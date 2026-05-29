import React from 'react'
import { Metadata } from 'next';
import getSiteData from '@/backend/serverActions/getSiteData';
import ProductList from '../../(listing)/ProductsList';
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName';
import getProductPromoted from '@/backend/serverActions/getProductPromoted';
import { type Locale } from '@/i18n/routing';
import { getInitialAlgoliaProducts } from '@/lib/algoliaProducts';
import { localizedAbsoluteUrl, localizedLanguages } from '@/lib/seoCatalog';
import CategorySeoBlock from '@/ui/Category/CategorySeoBlock';

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
    const { categoryname } = await props.params;
    const category = await getCategoriesWithName(decodeURIComponent(categoryname))
    const categoryAncestors = category.parent?.split(">").filter(Boolean) ?? []
    const categoryPath = [...categoryAncestors, category.name].join(" > ")
    const promotedProducts = await getProductPromoted(category.name)
    const initialProducts = await getInitialAlgoliaProducts({
        categoryParam: category.name,
        categoryPath,
    })
    return (
        <div className="lg:basis-5/6 w-full flex flex-col gap-6">
            <CategorySeoBlock category={category} />
            <ProductList className="w-full" categoryParam={category.name} categoryPath={categoryPath} predefinedProducts={initialProducts.length ? initialProducts : promotedProducts} />
        </div>
    )
}

export default CategoryProcutListPage
