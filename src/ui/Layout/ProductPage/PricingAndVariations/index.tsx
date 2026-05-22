// "use client"
import { ProductDataModel } from '@/types/ProductDataModel'
import React from 'react'
import dhl from '../../../../../static_assets/dhl.svg'
import free_delivery from '../../../../../static_assets/free_deliveries.svg'
import hand_crafted from '../../../../../static_assets/hand_crafted.svg'
import returns_replacements from '../../../../../static_assets/return_replacements.svg'
import Image from 'next/image'
import ColorDataModel from '@/types/ColorDataModel'
import SizeDataModel from '@/types/SizeDataModel'
import PriceAndVariationClient from './PriceAndVariationClient'
import getSiteData from '@/backend/serverActions/getSiteData'
import { getTranslations, getLocale } from 'next-intl/server'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { type Locale } from '@/i18n/routing'
import InformationTabs from '../InformationTabs'

interface returnProps extends ProductDataModel {
    colorData: ColorDataModel[],
    sizeData: SizeDataModel[]
}

const PriceAndVariation = async ({ product }: { product: returnProps }) => {
    const siteData = await getSiteData()
    const t = await getTranslations('product')
    const locale = await getLocale() as Locale
    const name = resolveLocalizedString(product.productName, locale)
    const title = resolveLocalizedString(product.productTitle, locale)
    const shortDesc = resolveLocalizedString(product.productDescriptionShort, locale)
    const category = product.productCategory?.trim() || 'Rug'
    return (
        <aside className='lg:sticky lg:top-24'>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_16px_48px_rgba(37,30,20,0.07)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex max-w-full items-center gap-1.5 uppercase tracking-[0.12em] text-primary">
                        <span className="text-neutral-500 font-thin text-xs">Category: </span>
                        <span className="truncate normal-case tracking-normal text-neutral-950 ~text-sm/base">{category}</span>
                    </span>
                    <span className="rounded-full border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        In stock
                    </span>
                </div>
                <div className="mt-2 border-b border-neutral-200 pb-3">
                    <p id="product-name-label" className="mb-1 uppercase gap-1.5 tracking-[0.14em] text-neutral-500 ~text-base/xl">
                        {/* <span className="text-neutral-500 font-thin text-xs">Product name:</span> */}
                        <span className="truncate normal-case tracking-normal text-neutral-950 font-semibold">{name}</span>
                    </p>
                    <h1 aria-describedby="product-name-label" className="leading-snug text-neutral-950 ~text-sm/base">
                        {title}
                    </h1>
                </div>
                <div className="mb-3 mt-3 flex items-center text-[11px] text-neutral-500">
                    <div className="rating rating-sm pointer-events-none">
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                        <input
                            type="radio"
                            name="rating-7"
                            className="mask mask-star-2 bg-orange-400"
                            defaultChecked />
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                    </div>
                    <span className="ml-2">{t('reviewCount')}</span>
                    <span className="mx-2">/</span>
                    <a href="#">Write A Review</a>
                </div>
                <PriceAndVariationClient product={product} siteData={siteData} />
                <p className="border-t border-neutral-200 pt-3 text-[13px] leading-5 text-neutral-600">
                    {shortDesc}
                </p>
                <div className="grid gap-x-4 gap-y-2 border-b border-neutral-200 py-5 text-[11px] text-neutral-700 grid-cols-2">
                    <div className='flex items-center gap-2'>
                        <Image src={dhl} alt="DHL logo" className='h-5 w-5 object-contain' />
                        <span className='font-medium'>{t('deliveryPartner')}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Image src={returns_replacements} alt="Returns & Replacements icon" className='h-5 w-5 object-contain' />
                        <span className='font-medium'>{t('returnsReplacements')}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Image src={free_delivery} alt="Free Deliveries icon" className='h-5 w-5 object-contain' />
                        <span className='font-medium'>{t('freeDeliveries')}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Image src={hand_crafted} alt="Hand Crafted icon" className='h-5 w-5 object-contain' />
                        <span className='font-medium'>{t('handCrafted')}</span>
                    </div>
                </div>
                <div className="pt-3">
                    <InformationTabs product={product} compact />
                </div>
            </div>
        </aside>
    )
}

export default PriceAndVariation
