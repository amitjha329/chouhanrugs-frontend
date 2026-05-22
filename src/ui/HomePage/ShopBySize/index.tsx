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
