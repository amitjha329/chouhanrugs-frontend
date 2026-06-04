import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import { type Locale } from '@/i18n/routing'
import { getStaticPageMetadata } from '@/lib/pageMetadata'
import { Metadata } from 'next'
import Image from '@/ui/components/OptimizedImage'
import type { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FiArrowRight, FiFeather, FiGrid, FiHome, FiShoppingBag, FiSquare } from 'react-icons/fi'
import cushionFallback from '../../../../../../static_assets/cushion_popular.webp'
import rugsFallback from '../../../../../../static_assets/rugs_pop.webp'
import bagsFallback from '../../../../../../static_assets/bags_pop.webp'

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
    const preferredOrder = [
        'cushion & pillow',
        'hemp rugs',
        'rugs & runners',
        'door mats',
        'jute rugs',
        'bags',
        'wool rugs',
        'braided jute',
        'cotton rugs',
    ]
    const activeCategories = categories
        .filter((category) => category.active)
        .sort((a, b) => {
            const aIndex = preferredOrder.findIndex((name) => a.name.toLowerCase().includes(name))
            const bIndex = preferredOrder.findIndex((name) => b.name.toLowerCase().includes(name))

            if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name)
            if (aIndex === -1) return 1
            if (bIndex === -1) return -1
            return aIndex - bIndex
        })

    const getCategoryIcon = (categoryName: string) => {
        const name = categoryName.toLowerCase()
        if (name.includes('bag')) return FiShoppingBag
        if (name.includes('mat')) return FiHome
        if (name.includes('hemp') || name.includes('cotton')) return FiFeather
        if (name.includes('jute') || name.includes('wool')) return FiGrid
        return FiSquare
    }

    const getCategoryImage = (categoryName: string, imgSrc?: string): string | StaticImageData => {
        if (imgSrc) return imgSrc
        const name = categoryName.toLowerCase()
        if (name.includes('bag')) return bagsFallback
        if (name.includes('cushion') || name.includes('pillow')) return cushionFallback
        return rugsFallback
    }

    return (
        <section className="min-h-screen bg-[#fbf7f1] px-4 pb-14 pt-7 text-[#24170f] sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-7 text-center sm:mb-9">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#82766d] sm:text-[0.7rem]">
                        Explore Our Collection
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#20130c] sm:text-4xl lg:text-5xl">
                        Shop by Categories
                    </h1>
                    <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-[#746960] sm:text-sm">
                        Browse handcrafted rugs, cushions, bags, and home decor collections made with natural textures and timeless detail.
                    </p>
                    <div className="mx-auto mt-4 flex w-20 items-center justify-center gap-2 text-[#a87543]" aria-hidden="true">
                        <span className="h-px flex-1 bg-[#d8c6b4]" />
                        <span className="h-1.5 w-1.5 rotate-45 rounded-sm bg-[#a87543]" />
                        <span className="h-px flex-1 bg-[#d8c6b4]" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                    {activeCategories.map((category) => {
                        const href = `/products/category/${encodeURIComponent(category.slug ?? category.name)}`
                        const Icon = getCategoryIcon(category.name)
                        return (
                            <Link
                                key={category._id}
                                href={href}
                                className="group overflow-hidden rounded-2xl border border-[#eadfd4] bg-[#fffdfb] shadow-[0_5px_14px_rgba(71,47,31,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(71,47,31,0.15)]"
                            >
                                <div className="relative aspect-[1.03/0.95] overflow-hidden bg-[#eaded1]">
                                    <Image
                                        fill
                                        alt={category.name}
                                        src={getCategoryImage(category.name, category.imgSrc)}
                                        sizes="(max-width: 1024px) 31vw, 300px"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="relative min-h-12 bg-[#fffaf6] px-2.5 pb-2.5 pt-5 sm:min-h-14 sm:px-3 sm:pb-3 sm:pt-6">
                                    <span className="absolute -top-5 left-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fffdfb] text-[#9b6536] shadow-[0_4px_10px_rgba(71,47,31,0.12)] sm:left-3 sm:h-10 sm:w-10">
                                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="line-clamp-2 font-serif text-[0.74rem] font-semibold leading-4 text-[#21150e] sm:text-sm lg:text-base">
                                            {category.name}
                                        </h2>
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#875323] transition group-hover:bg-[#875323] group-hover:text-white sm:h-6 sm:w-6">
                                            <FiArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
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
