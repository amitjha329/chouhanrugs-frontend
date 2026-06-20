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
import { FaChevronRight } from 'react-icons/fa'

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

    const sectionHeadingTag = (dynamicSection?.sectionHeadingTag || 'div') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';

    return (
        <section className="w-full py-16 bg-[#FAF6F0]/40">
            {/* Header Title with Subtitle Tag and Gold Underline */}
            <div className="text-center mb-12">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a76f3c] mb-2 block">
                    Artisanal Gallery
                </span>
                <SectionTitle 
                    title={t('ourPopularCategories')} 
                    className="text-center font-serif text-3xl md:text-4xl font-extrabold text-[#5d3c1e] tracking-tight leading-tight mb-4" 
                    headingTag={sectionHeadingTag} 
                />
                <div className="h-0.5 w-16 bg-[#e5ccb5] mx-auto" />
            </div>

            {/* Circular Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 max-w-[1600px] mx-auto px-4 md:px-8">
                {popularCategories.map((category) => {
                    const isImgString = typeof category.image === 'string'
                    return (
                        <div
                            key={category.title + category.href}
                            className="group flex flex-col items-center text-center bg-white border border-[#e5ccb5]/20 rounded-3xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#6c4624]/20"
                        >
                            {/* Double-gold circular image frame */}
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#e5ccb5] p-1 bg-white ring-4 ring-offset-2 ring-[#e5ccb5]/20 transition-all duration-300 group-hover:ring-[#6c4624]/30 mb-5">
                                <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-108"
                                        sizes="(max-width: 768px) 112px, 128px"
                                        placeholder={isImgString ? undefined : 'blur'}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-center flex-grow">
                                <div>
                                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#5d3c1e] mb-2 leading-snug">
                                        {category.title.replace('Popular in ', '')}
                                    </h3>
                                    <p className="text-[11px] text-[#7a6452] leading-relaxed line-clamp-2 mb-4 px-1">
                                        {category.desc}
                                    </p>
                                </div>

                                <Link 
                                    href={category.href}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6c4624] hover:text-[#5d3c1e] transition-colors"
                                >
                                    <span>{tCommon('viewAll')}</span>
                                    <FaChevronRight className="w-2 h-2" />
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default OurPopularCategories
