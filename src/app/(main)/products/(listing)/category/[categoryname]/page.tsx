import React from 'react'
import { Metadata } from 'next';
import getSiteData from '@/backend/serverActions/getSiteData';
import ProductList from '../../ProductsList';
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName';
import getProductPromoted from '@/backend/serverActions/getProductPromoted';


export async function generateMetadata(props: { params: Promise<{ categoryname: string }> }): Promise<Metadata> {
    const params = await props.params;
    const data = await getCategoriesWithName(decodeURIComponent(params.categoryname))
    const dataAdditional = await getSiteData()
    return {
        title: data.name,
        description: data.description,
        // keywords: data.pageKeywords,
        openGraph: {
            title: data.name,
            description: data.description,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: data.imgSrc
        },
        twitter: {
            title: data.name,
            description: data.description,
            card: "summary",
            images: dataAdditional.logoSrc,
        },
        alternates: {
            canonical: `${dataAdditional.url}products/category/${params.categoryname}`
        }
    }
}

const CategoryProcutListPage = async (props: { params: Promise<{ categoryname: string }> }) => {
    const params = await props.params;
    const promotedProducts = await getProductPromoted(decodeURIComponent(params.categoryname))
    console.log(promotedProducts)
    return (
        <ProductList categoryParam={params.categoryname} predefinedProducts={promotedProducts} />
    )
}

export default CategoryProcutListPage