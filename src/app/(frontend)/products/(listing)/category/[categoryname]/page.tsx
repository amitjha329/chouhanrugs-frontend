import getCategoriesWithId from '@/lib/actions/getCategoriesWithId'
import getProductsList from '@/lib/actions/getProductsList'
import ProductList from '@/ui/frontend/Sections/ProductsList'
import React from 'react'
import { Metadata } from 'next';
import getSiteData from '@/lib/actions/getSiteData';
import getCategoriesWithName from '@/lib/actions/getCategoriesWithName';


export async function generateMetadata({ params }: { params: { categoryname: string } }): Promise<Metadata> {
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

const CategoryProcutListPage = async ({ params }: { params: { categoryname: string } }) => {

    return (
        <ProductList categoryParam={params.categoryname} />
    )
}

export default CategoryProcutListPage