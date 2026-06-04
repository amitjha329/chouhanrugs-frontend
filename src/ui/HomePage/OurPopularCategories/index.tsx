import React from 'react'
import Image from '@/ui/components/OptimizedImage'
import type { StaticImageData } from 'next/image'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import cushion_pop from '../../../../static_assets/cushion_popular.webp'
import rugs_pop from '../../../../static_assets/rugs_pop.webp'
import bags_pop from '../../../../static_assets/bags_pop.webp'
import { getHomePagePopularCategories } from '@/backend/serverActions/getHomePagePopularCategories'
import { type Locale } from '@/i18n/routing'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import SectionTitle from '@/ui/SectionTitle'

type PopularCategory = {
    title: string
    desc: string
    href: string
    image: string | StaticImageData
    lgspan: number
    span: number
}

const fallbackCategories: PopularCategory[] = [
    {
        title: 'Popular in Cushion & Pillow',
        desc: 'Explore our wide range of comfortable and stylish cushions and pillows.',
        href: '/products/category/cushion-pillow',
        image: cushion_pop,
        lgspan: 1,
        span: 2,
    },
    {
        title: 'Popular in Rugs & Runners',
        desc: 'Discover premium quality rugs and runners to enhance your home decor.',
        href: '/products/category/rugs-runners',
        image: rugs_pop,
        lgspan: 2,
        span: 2,
    },
    {
        title: 'Popular in Hemp Rugs',
        desc: 'Bring natural texture home with durable hemp rugs handcrafted for relaxed, everyday spaces.',
        href: '/products/category/hemp-rugs',
        image: rugs_pop,
        lgspan: 1,
        span: 4,
    },
    {
        title: 'Popular in Braided Jute Rugs',
        desc: 'Explore braided jute rugs made with sturdy natural fibers, rich texture, and timeless handmade character for living rooms, bedrooms, and entryways.',
        href: '/products/category/braided-jute-rugs',
        image: rugs_pop,
        lgspan: 2,
        span: 2,
    },
    {
        title: 'Popular in Bags',
        desc: 'Browse our collection of versatile and trendy bags for every occasion.',
        href: '/products/category/bags',
        image: bags_pop,
        lgspan: 2,
        span: 2,
    },
]

function normalizeCategoryHref(link?: string) {
    if (!link) return '/products'
    if (link.startsWith('/')) return link
    return `/products/category/${link}`
}

function getMobileSpanClass(span: number) {
    return span === 4 ? 'col-span-4' : 'col-span-2'
}

function getDesktopSpanClass(span: number) {
    return span === 2 ? 'md:col-span-2' : 'md:col-span-1'
}

const OurPopularCategories = async () => {
    const [t, tCommon, loc, dynamicSection] = await Promise.all([
        getTranslations('homepage'),
        getTranslations('common'),
        getLocale(),
        getHomePagePopularCategories(),
    ])
    const locale = loc as Locale

    const popularCategories = dynamicSection?.items?.length
        ? dynamicSection.items.map((category, index): PopularCategory => {
            const fallback = fallbackCategories[index] ?? fallbackCategories[1]
            const title = resolveLocalizedString(category.title, locale) || fallback.title
            return {
                title,
                desc: resolveLocalizedString(category.desc, locale) || fallback.desc,
                href: normalizeCategoryHref(category.link),
                image: category.image || fallback.image,
                lgspan: category.lgspan ?? fallback.lgspan,
                span: category.span ?? fallback.span,
            }
        })
        : fallbackCategories

    return (<>
        <SectionTitle title={t('ourPopularCategories')} className='text-center pt-10 pb-5' />
        <div className='grid grid-cols-4 gap-5 fluid_container ~py-5/14 ~px-5/0'>
            {
                popularCategories.map(category => {
                    const imageProps = typeof category.image === 'string' ? {} : { placeholder: 'blur' as const }

                    return (
                        (<div key={category.title + category.href} className={`${getMobileSpanClass(category.span)} ${getDesktopSpanClass(category.lgspan)} min-h-60 ${category.lgspan === 1 ? "md:bg-accent" : "md:bg-secondary/50"} ${category.span === 2 ? "bg-accent" : "bg-secondary/50"} card card-body relative overflow-hidden flex flex-col gap-5 items-start w-full p-5 md:p-8`}>
                            <Image
                                src={category.image}
                                alt={category.title}
                                height={400}
                                width={400}
                                className={`absolute z-10 ${category.span == 2 ? "-bottom-16 -right-16" : "-bottom-28 -right-28"} ${category.lgspan == 2 ? "md:-bottom-40 md:-right-40" : "md:-bottom-28 md:-right-28"} opacity-50`}
                                loading="lazy"
                                {...imageProps}
                            />
                            <h2 className='~text-base/2xl font-semibold z-20'>
                                {category.title}
                            </h2>
                            <div className={`text-xs z-20 max-w-xl ${category.span === 4 ? "block" : "hidden md:block"}`}>
                                {category.desc}
                            </div>
                            <Link href={category.href} className="btn btn-sm md:btn-md z-20">
                                {tCommon('viewAll')}
                            </Link>
                        </div>)
                    )
                })
            }
        </div>
    </>)
}

export default OurPopularCategories
