'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaChevronRight } from 'react-icons/fa'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import cushion_pop from '../../../../static_assets/cushion_popular.webp'
import rugs_pop from '../../../../static_assets/rugs_pop.webp'
import bags_pop from '../../../../static_assets/bags_pop.webp'
import clsx from 'clsx'

interface CategoryOptionsSwitcherProps {
    dynamicSection: any
    tHomepage: {
        ourPopularCategories: string
    }
    tCommon: {
        viewAll: string
    }
    locale: string
}

type PopularCategory = {
    title: string
    desc: string
    href: string
    image: any
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

// ==========================================
// --- OPTION 0: Original/Current Live Layout (Baseline) ---
// ==========================================
function CategoriesLayoutCurrent({ categories, tCommon, tHomepage }: { categories: PopularCategory[]; tCommon: any; tHomepage: any }) {
    return (
        <div className="w-full py-10 bg-white">
            <div className="text-center pt-5 pb-5">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    {tHomepage.ourPopularCategories}
                </h2>
            </div>
            <div className="grid grid-cols-4 gap-5 max-w-[1600px] mx-auto px-4 md:px-8">
                {categories.map((category) => {
                    const isImgString = typeof category.image === 'string'
                    return (
                        <div
                            key={category.title + category.href}
                            className={clsx(
                                getMobileSpanClass(category.span),
                                getDesktopSpanClass(category.lgspan),
                                'min-h-60 card card-body relative overflow-hidden flex flex-col gap-5 items-start w-full p-5 md:p-8',
                                category.lgspan === 1 ? 'md:bg-accent' : 'md:bg-secondary/50',
                                category.span === 2 ? 'bg-accent' : 'bg-secondary/50'
                            )}
                        >
                            <Image
                                src={category.image}
                                alt={category.title}
                                height={250}
                                width={250}
                                className={clsx(
                                    'absolute z-10 opacity-40 object-contain pointer-events-none',
                                    category.span === 2 ? '-bottom-10 -right-10' : '-bottom-16 -right-16',
                                    category.lgspan === 2 ? 'md:-bottom-24 md:-right-24' : 'md:-bottom-16 md:-right-16'
                                )}
                                placeholder={isImgString ? undefined : 'blur'}
                            />
                            <h3 className="text-base md:text-xl font-bold z-20 text-[#5d3c1e]">
                                {category.title}
                            </h3>
                            <div className={clsx(
                                'text-xs z-20 max-w-xl text-[#7a6452] leading-relaxed',
                                category.span === 4 ? 'block' : 'hidden md:block'
                            )}>
                                {category.desc}
                            </div>
                            <Link href={category.href} className="btn btn-sm md:btn-md z-20 bg-[#6c4624] border-[#6c4624] text-white hover:bg-[#5d3c1e] hover:border-[#5d3c1e]">
                                {tCommon.viewAll}
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 1: Modern Editorial Masonry (Asymmetrical Cards) ---
// ==========================================
function CategoriesLayout1({ categories, tCommon, tHomepage }: { categories: PopularCategory[]; tCommon: any; tHomepage: any }) {
    return (
        <div className="w-full py-16 bg-[#fdfbf7]">
            <div className="text-center mb-12">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a76f3c] mb-2 block">Our Collections</span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#5d3c1e] tracking-tight">
                    {tHomepage.ourPopularCategories}
                </h2>
                <div className="h-1 w-12 bg-[#a76f3c] mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-[1600px] mx-auto px-4 md:px-8">
                {categories.map((category, idx) => {
                    const isLarge = category.lgspan === 2
                    return (
                        <div
                            key={category.title + category.href}
                            className={clsx(
                                isLarge ? 'md:col-span-2' : 'md:col-span-1',
                                'group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#e5ccb5]/40 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-6 md:p-8 min-h-[340px]'
                            )}
                        >
                            {/* Decorative Arch Image Frame */}
                            <div className="absolute right-4 bottom-4 w-40 h-40 md:w-48 md:h-48 rounded-t-full overflow-hidden border border-[#e5ccb5]/30 bg-[#fdfaf4] transition-all duration-500 group-hover:scale-105 z-10 shadow-inner">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:rotate-1"
                                />
                            </div>

                            <div className="relative z-20 flex flex-col h-full justify-between items-start">
                                <div className="max-w-[70%]">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#a76f3c] mb-1.5 block">Collection</span>
                                    <h3 className="font-serif text-lg md:text-xl font-bold text-[#5d3c1e] mb-3 leading-snug">
                                        {category.title.replace('Popular in ', '')}
                                    </h3>
                                    <p className="text-xs text-[#7a6452] leading-relaxed line-clamp-3">
                                        {category.desc}
                                    </p>
                                </div>

                                <Link 
                                    href={category.href}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-[#6c4624] hover:text-[#5d3c1e] transition-colors border-b border-[#e5ccb5] pb-1 group-hover:border-[#6c4624]"
                                >
                                    <span>{tCommon.viewAll}</span>
                                    <FaArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 2: Golden Grid Arches & Glassmorphism ---
// ==========================================
function CategoriesLayout2({ categories, tCommon, tHomepage }: { categories: PopularCategory[]; tCommon: any; tHomepage: any }) {
    return (
        <div className="w-full py-16 bg-[#faf6f0]">
            <div className="text-center mb-12">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a76f3c] mb-2 block">Boutique</span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#5d3c1e] tracking-tight">
                    {tHomepage.ourPopularCategories}
                </h2>
                <p className="mt-2 text-xs font-semibold text-[#8b7868]">Handcrafted spaces demand custom design.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-[1600px] mx-auto px-4 md:px-8">
                {categories.map((category, idx) => {
                    // Distribute layout spans: 1st card gets span 2, others span 1.
                    const isBig = idx === 0 || idx === 3
                    return (
                        <div
                            key={category.title + category.href}
                            className={clsx(
                                isBig ? 'md:col-span-2' : 'md:col-span-1',
                                'group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[#e5ccb5]/50 bg-white p-6 min-h-[360px] transition-all duration-300 shadow-sm hover:shadow-lg'
                            )}
                        >
                            {/* Full arch backdrop block */}
                            <div className="absolute inset-x-4 top-4 bottom-24 rounded-t-full overflow-hidden bg-[#faf6f0] border border-[#e5ccb5]/20">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Glassmorphic overlay details block */}
                            <div className="absolute inset-x-4 bottom-4 bg-white/90 backdrop-blur-md border border-[#e5ccb5]/40 rounded-2xl p-4.5 z-20 shadow-sm flex flex-col justify-between items-start transition-all duration-300 group-hover:bg-white group-hover:shadow-md">
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-sm text-[#5d3c1e] truncate pr-2">
                                            {category.title.replace('Popular in ', '')}
                                        </h3>
                                        <FaChevronRight className="w-2.5 h-2.5 text-[#a76f3c] transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                    <p className="text-[10px] text-[#7a6452] line-clamp-1">
                                        {category.desc}
                                    </p>
                                </div>
                                <Link 
                                    href={category.href} 
                                    className="text-[11px] font-bold text-[#6c4624] hover:underline mt-2 inline-block"
                                >
                                    {tCommon.viewAll}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 3: Minimalist Scandinavian Split (Image Left, Content Right) ---
// ==========================================
function CategoriesLayout3({ categories, tCommon, tHomepage }: { categories: PopularCategory[]; tCommon: any; tHomepage: any }) {
    return (
        <div className="w-full py-16 bg-white">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a76f3c] mb-1.5 block">Shop Handloom</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#5d3c1e] tracking-tight leading-none">
                        {tHomepage.ourPopularCategories}
                    </h2>
                </div>
                <p className="text-xs text-[#8b7868] max-w-xs font-semibold leading-relaxed">
                    Premium fibers crafted with generations of heritage weaving techniques.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1600px] mx-auto px-4 md:px-8">
                {categories.map((category) => (
                    <div
                        key={category.title + category.href}
                        className="group flex flex-col rounded-2xl overflow-hidden border border-[#e5ccb5]/40 bg-white transition-all duration-300 hover:shadow-md hover:border-[#6c4624]/20"
                    >
                        {/* Upper image half */}
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#fdfaf4]">
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-103"
                            />
                        </div>

                        {/* Lower text half */}
                        <div className="p-6 flex flex-col justify-between items-start flex-grow gap-4">
                            <div>
                                <h3 className="font-serif text-base font-bold text-[#5d3c1e] mb-2 leading-snug">
                                    {category.title.replace('Popular in ', '')}
                                </h3>
                                <p className="text-xs text-[#7a6452] leading-relaxed line-clamp-2">
                                    {category.desc}
                                </p>
                            </div>

                            <Link 
                                href={category.href}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6c4624] hover:text-[#5d3c1e] transition-colors group-hover:underline"
                            >
                                <span>{tCommon.viewAll}</span>
                                <FaArrowRight className="w-2.5 h-2.5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 4: Luxury Gallery Circles ---
// ==========================================
function CategoriesLayout4({ categories, tCommon, tHomepage }: { categories: PopularCategory[]; tCommon: any; tHomepage: any }) {
    return (
        <div className="w-full py-16 bg-[#FAF6F0]/50">
            <div className="text-center mb-12">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a76f3c] mb-2 block">Artisanal Gallery</span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#5d3c1e] tracking-tight">
                    {tHomepage.ourPopularCategories}
                </h2>
                <div className="h-0.5 w-16 bg-[#e5ccb5] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-[1600px] mx-auto px-4 md:px-8">
                {categories.map((category) => (
                    <div
                        key={category.title + category.href}
                        className="group flex flex-col items-center text-center bg-white border border-[#e5ccb5]/20 rounded-3xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#6c4624]/20"
                    >
                        {/* Circular Image Frame */}
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#e5ccb5] p-1 bg-white ring-4 ring-offset-2 ring-[#e5ccb5]/20 transition-all duration-300 group-hover:ring-[#6c4624]/30 mb-5">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between items-center flex-grow">
                            <div>
                                <h3 className="font-serif text-sm sm:text-base font-bold text-[#5d3c1e] mb-2">
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
                                <span>{tCommon.viewAll}</span>
                                <FaChevronRight className="w-2 h-2" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 5: High-Impact Full-Bleed Overlay ---
// ==========================================
function CategoriesLayout5({ categories, tCommon, tHomepage }: { categories: PopularCategory[]; tCommon: any; tHomepage: any }) {
    return (
        <div className="w-full py-16 bg-[#fdfdfd]">
            <div className="text-center mb-12">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a76f3c] mb-2 block">Catalog Grid</span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#5d3c1e] tracking-tight">
                    {tHomepage.ourPopularCategories}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1600px] mx-auto px-4 md:px-8">
                {categories.map((category, idx) => {
                    const isWide = idx === 0 || idx === 4
                    return (
                        <div
                            key={category.title + category.href}
                            className={clsx(
                                isWide ? 'md:col-span-2' : 'md:col-span-1',
                                'group relative rounded-3xl overflow-hidden min-h-[380px] flex flex-col justify-end p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-xl'
                            )}
                        >
                            {/* Full-bleed background image */}
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                            />

                            {/* Warm dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10" />

                            {/* Content */}
                            <div className="relative z-20 text-white max-w-xl">
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#e5ccb5] mb-2 block">
                                    Shop Handloom
                                </span>
                                <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 tracking-wide">
                                    {category.title.replace('Popular in ', '')}
                                </h3>
                                <p className="text-xs text-white/80 leading-relaxed line-clamp-2 mb-5">
                                    {category.desc}
                                </p>
                                <Link 
                                    href={category.href} 
                                    className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full border border-white text-white hover:bg-white hover:text-black transition-all duration-300 shadow-sm"
                                >
                                    {tCommon.viewAll}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ==========================================
// --- Categories Options Switcher (Main Component) ---
// ==========================================
export default function CategoryOptionsSwitcher({
    dynamicSection,
    tHomepage,
    tCommon,
    locale,
}: CategoryOptionsSwitcherProps) {
    const [selectedLayout, setSelectedLayout] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

    const popularCategories = dynamicSection?.items?.length
        ? dynamicSection.items.map((category: any, index: number): PopularCategory => {
            const fallback = fallbackCategories[index] ?? fallbackCategories[1]
            return {
                title: resolveLocalizedString(category.title, locale as any) || fallback.title,
                desc: resolveLocalizedString(category.desc, locale as any) || fallback.desc,
                href: normalizeCategoryHref(category.link),
                image: category.image || fallback.image,
                lgspan: category.lgspan ?? fallback.lgspan,
                span: category.span ?? fallback.span,
            }
        })
        : fallbackCategories

    return (
        <div className="w-full">
            {/* Switcher Controls Bar */}
            <div className="w-full bg-[#1b2326] text-white py-3.5 px-6 flex flex-wrap items-center justify-between gap-4 shadow-md z-[1000] relative border-b border-[#29363a]">
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-3 w-3 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#b5cbd4]">
                        Popular Categories Layout Switcher:
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setSelectedLayout(0)}
                        className={clsx(
                            'px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-150 border',
                            selectedLayout === 0
                                ? 'bg-cyan-700 text-white border-cyan-600 shadow-md scale-105'
                                : 'bg-white/10 text-white/80 hover:bg-white/20 border-transparent'
                        )}
                    >
                        0. Live Layout (Baseline)
                    </button>
                    {[1, 2, 3, 4, 5].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setSelectedLayout(opt as any)}
                            className={clsx(
                                'px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-150 border',
                                selectedLayout === opt
                                    ? 'bg-cyan-700 text-white border-cyan-600 shadow-md scale-105'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20 border-transparent'
                            )}
                        >
                            Layout {opt}
                        </button>
                    ))}
                </div>

                <div className="text-xs font-bold text-[#abc2cc] bg-white/5 px-3 py-1 rounded border border-white/10">
                    Active Style: {
                        selectedLayout === 0 ? 'Live Layout (Baseline)' :
                        selectedLayout === 1 ? 'Editorial Masonry' :
                        selectedLayout === 2 ? 'Golden Grid Arches' :
                        selectedLayout === 3 ? 'Scandinavian Split' :
                        selectedLayout === 4 ? 'Gallery Circles' :
                        'Full-Bleed Overlay'
                    }
                </div>
            </div>

            {/* Layout Rendering */}
            <div className="w-full">
                {selectedLayout === 0 && (
                    <CategoriesLayoutCurrent
                        categories={popularCategories}
                        tCommon={tCommon}
                        tHomepage={tHomepage}
                    />
                )}
                {selectedLayout === 1 && (
                    <CategoriesLayout1
                        categories={popularCategories}
                        tCommon={tCommon}
                        tHomepage={tHomepage}
                    />
                )}
                {selectedLayout === 2 && (
                    <CategoriesLayout2
                        categories={popularCategories}
                        tCommon={tCommon}
                        tHomepage={tHomepage}
                    />
                )}
                {selectedLayout === 3 && (
                    <CategoriesLayout3
                        categories={popularCategories}
                        tCommon={tCommon}
                        tHomepage={tHomepage}
                    />
                )}
                {selectedLayout === 4 && (
                    <CategoriesLayout4
                        categories={popularCategories}
                        tCommon={tCommon}
                        tHomepage={tHomepage}
                    />
                )}
                {selectedLayout === 5 && (
                    <CategoriesLayout5
                        categories={popularCategories}
                        tCommon={tCommon}
                        tHomepage={tHomepage}
                    />
                )}
            </div>
        </div>
    )
}
