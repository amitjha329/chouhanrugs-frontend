import { getSizesList } from '@/backend/serverActions/getSizesList'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SizeItems from './SizeItems'
import { getTranslations } from 'next-intl/server'
import { HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineTruck, HiOutlineWrenchScrewdriver } from 'react-icons/hi2'

const formatSizeName = (name: string) => {
    const cleanedName = name.replace(/\s+/g, ' ').trim()
    return cleanedName.replace(/\b(feet|foot)\b/gi, 'FT')
}

const sizeBenefits = [
    {
        label: 'Premium quality',
        text: 'Crafted with carefully selected materials',
        Icon: HiOutlineSparkles,
    },
    {
        label: 'Custom sizing',
        text: 'Made to fit your room and layout',
        Icon: HiOutlineWrenchScrewdriver,
    },
    {
        label: 'Long lasting',
        text: 'Built for everyday living spaces',
        Icon: HiOutlineShieldCheck,
    },
    {
        label: 'Reliable shipping',
        text: 'Packed and delivered with care',
        Icon: HiOutlineTruck,
    },
]

const ShopBySize = async () => {
    const sizesList = await getSizesList()
    const t = await getTranslations('homepage')
    const visibleSizes = sizesList.slice(0, 5)
    const featuredSize = visibleSizes[0]

    if (!featuredSize) {
        return null
    }

    return (
        <section className="bg-[#fbf7ef] px-4 py-8 sm:px-0 sm:py-14 lg:py-16">
            <div className="fluid_container">
                <div className="overflow-hidden rounded-2xl border border-primary/10 bg-base-100 shadow-[0_12px_36px_rgba(69,42,22,0.10)] sm:rounded-[22px] sm:shadow-[0_18px_60px_rgba(69,42,22,0.10)]">
                    <div className="grid lg:grid-cols-[1.6fr_0.9fr]">
                        <div className="relative min-h-[13rem] overflow-hidden sm:min-h-[24rem] lg:min-h-[27rem]">
                            <Image
                                src={featuredSize.sizeBanner}
                                alt={`${featuredSize.name} rug size guide`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 62vw"
                                priority={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                            <div className="absolute inset-x-4 bottom-4 text-white sm:inset-x-10 sm:bottom-7">
                                <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5 sm:gap-5">
                                    <div className="h-px flex-1 border-t border-dashed border-white/75" />
                                    <span className="font-serif text-2xl font-semibold leading-none sm:text-5xl">
                                        {formatSizeName(featuredSize.name)}
                                    </span>
                                    <div className="h-px flex-1 border-t border-dashed border-white/75" />
                                </div>
                                <div className="ml-auto flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] sm:gap-3 sm:text-sm sm:tracking-[0.16em]">
                                    <span className="h-8 border-l border-dashed border-white/75 sm:h-12" />
                                    <span>Measured for real rooms</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center bg-[#fffaf5] px-4 py-5 text-center sm:px-10 sm:py-8 lg:px-12">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80 sm:text-sm sm:tracking-[0.18em]">
                                Perfect for compact spaces
                            </p>
                            <div className="mx-auto my-3 h-px w-12 bg-primary/35 sm:my-4 sm:w-16" />
                            <h2 className="font-serif text-4xl leading-none text-primary sm:text-7xl">
                                {formatSizeName(featuredSize.name)}
                            </h2>
                            <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-base-content/65 sm:mt-5 sm:text-sm sm:leading-6">
                                Choose rug dimensions with confidence. Start with our most requested room-ready sizes, then browse every available option.
                            </p>
                            <div className="my-4 grid grid-cols-3 divide-x divide-primary/15 border-y border-primary/10 py-3 text-[10px] uppercase tracking-[0.04em] text-base-content/70 sm:my-7 sm:py-4 sm:text-xs sm:tracking-[0.08em]">
                                <span>Living room</span>
                                <span>Reading nook</span>
                                <span>Kids room</span>
                            </div>
                            <Link
                                href={`/products?size=${featuredSize.sizeCode}`}
                                className="btn btn-primary btn-sm mx-auto min-h-0 h-9 rounded-md px-5 text-xs uppercase tracking-[0.06em] sm:h-11 sm:px-7 sm:text-sm sm:tracking-[0.08em]"
                            >
                                Shop {formatSizeName(featuredSize.name)} rugs <span aria-hidden="true">-&gt;</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="my-6 flex items-center justify-center gap-3 sm:my-10 sm:gap-4">
                    <div className="h-px flex-1 bg-primary/15" />
                    <h2 className="text-center font-serif text-2xl uppercase tracking-[0.06em] text-primary sm:text-4xl sm:tracking-[0.08em]">
                        {t('shopBySize')}
                    </h2>
                    <div className="h-px flex-1 bg-primary/15" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5 lg:gap-5">
                    {visibleSizes.map((size, index) => (
                        <SizeItems key={size._id} {...size} index={index} />
                    ))}
                </div>

                <div className="mt-6 grid overflow-hidden rounded-xl border border-primary/10 bg-[#fffaf5] shadow-sm sm:mt-8 sm:grid-cols-2 sm:rounded-2xl lg:grid-cols-4">
                    {sizeBenefits.map(({ label, text, Icon }) => (
                        <div key={label} className="flex items-center gap-3 border-b border-primary/10 px-4 py-3 last:border-b-0 sm:gap-4 sm:border-b-0 sm:border-r sm:px-5 sm:py-5 last:border-r-0">
                            <Icon className="h-7 w-7 shrink-0 text-primary sm:h-9 sm:w-9" aria-hidden="true" />
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content sm:text-sm sm:tracking-[0.08em]">
                                    {label}
                                </div>
                                <p className="mt-1 text-xs leading-4 text-base-content/60 sm:text-sm sm:leading-5">
                                    {text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ShopBySize
