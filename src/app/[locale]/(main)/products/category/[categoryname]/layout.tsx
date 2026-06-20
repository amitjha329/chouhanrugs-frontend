import React from 'react'
import getCategoriesWithName from '@/backend/serverActions/getCategoriesWithName'
import BreadCrumbs from '@/ui/BreadCrumbs'

const ProductListingLayout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ categoryname: string, locale: string }> }) => {
    const { categoryname } = await params
    const category = await getCategoriesWithName(decodeURIComponent(categoryname));

    const crumbs = [
        { name: 'Home', link: '/' },
        { name: 'Shop', link: '/products' },
        { name: category.name, link: `/products/category/${category.slug || categoryname}` }
    ]

    return (
        <>
            <div className="container mx-auto px-3 sm:px-0">
                <BreadCrumbs crumbs={crumbs} />
            </div>
            {children}
        </>
    )
}

export default ProductListingLayout
