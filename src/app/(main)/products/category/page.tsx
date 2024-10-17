import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import getSiteData from '@/backend/serverActions/getSiteData'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    const title = "Categories | Chouhan Rugs"
    const description = "Browse all the categories and find the product that you love."
    const keywords = ""
    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: dataAdditional.logoSrc
        },
        twitter: {
            title,
            card: "summary",
            description,
            images: dataAdditional.logoSrc,
        },
        alternates: {
            canonical: `${dataAdditional.url}products/category`
        }
    }
}

const MobileCategoryListPage = async () => {
    const showCategories = headers().get('user-agent')?.includes("Mobile")
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
                                <Link key={category._id} href={`/products/category/${category.name}`}>
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