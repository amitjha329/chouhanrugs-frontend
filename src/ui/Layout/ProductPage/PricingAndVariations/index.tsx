"use client"
import { ProductDataModel } from '@/types/ProductDataModel'
import React, { useMemo } from 'react'
import dhl from '../../../../../static_assets/dhl.svg'
import free_delivery from '../../../../../static_assets/free_deliveries.svg'
import hand_crafted from '../../../../../static_assets/hand_crafted.svg'
import returns_replacements from '../../../../../static_assets/return_replacements.svg'
import Image from 'next/image'
import ColorDataModel from '@/types/ColorDataModel'
import SizeDataModel from '@/types/SizeDataModel'
import PriceAndVariationClient from './PriceAndVariationClient'



const PriceAndVariation = ({ product,
    colorList, sizeList
}: {
    product: ProductDataModel,
    colorList: ColorDataModel[],
    sizeList: SizeDataModel[]
}) => {
    const showCalculatedPrice = useMemo(()=>{
        
    },[])
    return (
        <div className='basis-1/2'>
            <div className="p-6 max-w-xl mx-auto">
                <div className="mb-4">
                    <button className="border border-gray-500 text-gray-500 px-3 py-1 rounded-md ~text-sm/base">By Chouhan Rugs</button>
                </div>
                <h1 className="~text-lg/2xl font-bold mb-2">{product.productName}</h1>
                <div className="flex items-center mb-4 text-gray-500 text-sm">
                    <div className="rating rating-sm">
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                        <input
                            type="radio"
                            name="rating-7"
                            className="mask mask-star-2 bg-orange-400"
                            defaultChecked />
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                        <input type="radio" name="rating-7" className="mask mask-star-2 bg-orange-400" />
                    </div>
                    <span className="ml-2">1 Reviews</span>
                    <span className="mx-2">/</span>
                    <a href="#">Write A Review</a>
                </div>
                <PriceAndVariationClient product={product} />
                <div className="flex items-center mb-4 text-brown-700">
                    {product.productDescriptionShort}
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={dhl} alt="DHL logo" />
                        <span>Delivery Partner</span>
                    </div>
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={returns_replacements} alt="Returns & Replacements icon" />
                        <span>Returns & Replacements</span>
                    </div>
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={free_delivery} alt="Free Deliveries icon" />
                        <span>Free Deliveries</span>
                    </div>
                    <div className='flex items-center justify-start gap-3'>
                        <Image src={hand_crafted} alt="Hand Crafted icon" />
                        <span>Hand Crafted</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PriceAndVariation