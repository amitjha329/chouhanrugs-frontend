import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import { type Locale } from '@/i18n/routing'
import { getStaticPageMetadata } from '@/lib/pageMetadata'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: loc } = await props.params
    return getStaticPageMetadata({
        pageKey: "categories",
        locale: loc as Locale,
        path: "products/category",
        fallbackTitle: "Categories | Chouhan Rugs",
        fallbackDescription: "Browse all Chouhan Rugs categories and find the product you love.",
    })
}

const MobileCategoryListPage = async () => {
    const showCategories = (await headers()).get('user-agent')?.includes("Mobile")
    const categories = await getCategoriesList()
    return (
        <>
            {
                showCategories ? <>
                    <div className='p-5 text-xl'>
                        All Categories
                    </div>
                    <div className='flex flex-row flex-wrap gap-5 items-center justify-center pt-4 pb-10'>
                        {categories.map(category => {
                            return (
                                category.active && <Link key={category._id} href={`/products/category/${encodeURIComponent(category.slug ?? category.name)}`}>
                                    <div className="card rounded-none w-[150px] carousel-item flex flex-col items-center shadow-md border-[1px] border-gray-200">
                                        <div className="bg-[#fcfaf6] min-w-full">
                                            {
                                                <Image height={128} width={100} alt={category.name} src={category.imgSrc} className="h-32 my-2 mx-auto object-contain drop-shadow" />
                                            }
                                        </div>
                                        <div className="border-t border-gray-500 text-center w-full py-2">
                                            <span className="text-neutral capitalize">{category.name}</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </> : <div className='w-full min-h-[700px]'>
                    <span className='text-9xl font-extrabold opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Nothing to see here!</span>
                </div>
            }
        </>
    )
}

export default MobileCategoryListPage
