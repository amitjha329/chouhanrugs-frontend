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

interface returnProps extends ProductDataModel {
    colorData: ColorDataModel[],
    sizeData: SizeDataModel[]
}

const PriceAndVariation = async ({ product }: { product: returnProps }) => {
    const siteData = await getSiteData()
    return (
        <div className='basis-1/2'>
            <div className="p-6 max-w-xl mx-auto">
                <div className="mb-4">
                    <button className="border border-gray-500 text-gray-500 px-3 py-1 rounded-md ~text-sm/base">By Chouhan Rugs</button>
                </div>
                <h1 className="~text-lg/2xl font-bold mb-2">{product.productName}</h1>
                <div className="flex items-center mb-4 text-gray-500 text-sm">
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
                    <span className="ml-2">99+ Reviews</span>
                    <span className="mx-2">/</span>
                    {/* <a href="#">Write A Review</a> */}
                </div>
                <PriceAndVariationClient product={product} siteData={siteData} />
                <div className="flex items-center mb-4 text-brown-700 ~text-xs/base">
                    {product.productDescriptionShort}
                </div>
                <div className="grid grid-cols-2 gap-4 text-center ~text-xs/base">
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={dhl} alt="DHL logo" className='~w-7/10 ~h-7/10' />
                        <span>Delivery Partner</span>
                    </div>
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={returns_replacements} alt="Returns & Replacements icon" className='w-7 h-7' />
                        <span>Returns & Replacements</span>
                    </div>
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={free_delivery} alt="Free Deliveries icon" className='~w-7/10 ~h-7/10' />
                        <span>Free Deliveries</span>
                    </div>
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={hand_crafted} alt="Hand Crafted icon" className='w-7 h-7' />
                        <span>Hand Crafted</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PriceAndVariation