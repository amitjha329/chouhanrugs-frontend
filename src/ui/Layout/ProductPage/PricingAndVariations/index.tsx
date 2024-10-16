import { ProductDataModel } from '@/types/ProductDataModel'
import React from 'react'
import dhl from '../../../../../static_assets/dhl.svg'
import free_delivery from '../../../../../static_assets/free_deliveries.svg'
import hand_crafted from '../../../../../static_assets/hand_crafted.svg'
import returns_replacements from '../../../../../static_assets/return_replacements.svg'
import Image from 'next/image'



const PriceAndVariation = ({ product,
    // colorList, sizeList 
}: {
    product: ProductDataModel,
    // colorList: ColorDataModel[],
    // sizeList: SizeDataModel[]
}) => {
    return (
        <div className='basis-1/2'>
            <div className="p-6 max-w-xl mx-auto">
                <div className="mb-4">
                    <button className="border border-gray-500 text-gray-500 px-3 py-1 rounded-md">By Chouhan Rugs</button>
                </div>
                <h1 className="text-2xl font-bold mb-2">{product.productName}</h1>
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
                <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-brown-700">₹4488.86</span>
                    <span className="line-through ml-2 text-gray-500">₹4987</span>
                    <button className="bg-green-500 text-white px-3 py-1 rounded ml-4">Save 10%</button>
                </div>
                <div className="flex items-center mb-4 text-brown-700">
                    {product.productDescriptionShort}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block mb-1">Color</label>
                        <div className="relative">
                            <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option>Gray</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1">Material</label>
                        <div className="relative">
                            <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option>Jute</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1">Quantity</label>
                        <div className="relative">
                            <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option>2</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-5 mb-4">
                    <button className="btn btn-accent ~px-10/20">Buy Now</button>
                    <button className="btn btn-outline btn-accent ~px-10/20">Add to Cart</button>
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