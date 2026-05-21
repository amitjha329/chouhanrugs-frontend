import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import { type Locale } from '@/i18n/routing'
import { getStaticPageMetadata } from '@/lib/pageMetadata'
import { Metadata } from 'next'
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
    const categories = await getCategoriesList()
    const activeCategories = categories.filter((category) => category.active)

    return (
        <section className="min-h-screen bg-[#fffaf7] px-4 pb-28 pt-6 text-[#25170e] sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">

                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 sm:gap-5 lg:grid-cols-5 xl:grid-cols-6">
                    {activeCategories.map((category) => {
                        const href = `/products/category/${encodeURIComponent(category.slug ?? category.name)}`
                        return (
                            <Link
                                key={category._id}
                                href={href}
                                className="group rounded-2xl border border-[#e6ded6] bg-white p-1 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f0e8]">
                                    <Image
                                        fill
                                        alt={category.name}
                                        src={category.imgSrc}
                                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex items-end justify-between gap-2 pb-3 pt-4 relative">
                                    <div className="min-w-0">
                                        <h2 className="line-clamp-1 font-serif text-sm font-semibold leading-5 text-[#25170e] sm:text-lg">
                                            {category.name}
                                        </h2>
                                        <p className="mt-1 line-clamp-1 text-xs font-medium leading-4 text-[#6d625b] sm:text-sm">
                                            {/* {category.description || 'Explore handcrafted style'} */}&nbsp;
                                        </p>
                                    </div>
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[#4d2a12] transition group-hover:bg-[#4d2a12] group-hover:text-white absolute right-0 bottom-0">
                                        <span className="text-xl leading-none" aria-hidden="true">&gt;</span>
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default MobileCategoryListPage
