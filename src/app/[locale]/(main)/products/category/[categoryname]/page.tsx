import React from 'react'
import { Metadata } from 'next';
import getSiteData from '@/backend/serverActions/getSiteData';
import ProductList from '../../(listing)/ProductsList';
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName';
import getProductPromoted from '@/backend/serverActions/getProductPromoted';

function stripHtml(value?: string) {
    return String(value ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}


export async function generateMetadata(props: { params: Promise<{ categoryname: string }> }): Promise<Metadata> {
    const params = await props.params;
    const categorySlug = decodeURIComponent(params.categoryname)
    const data = await getCategoriesWithName(categorySlug)
    const dataAdditional = await getSiteData()
    const title = data.seoTitle || data.name
    const description = stripHtml(data.seoDescription) || data.description
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
            canonical: `${dataAdditional.url}products/category/${encodeURIComponent(data.slug ?? categorySlug)}`
        }
    }
}

const CategoryProcutListPage = async (props: { params: Promise<{ categoryname: string }> }) => {
    const {categoryname} = await props.params;
    const category = await getCategoriesWithName(decodeURIComponent(categoryname))
    const promotedProducts = await getProductPromoted(category.name)
    return (
        <>
            <ProductList categoryParam={category.name} predefinedProducts={promotedProducts} />
        </>
    )
}

export default CategoryProcutListPage
