import { ProductDataModel } from '@/types/ProductDataModel'
import React from 'react'

const PriceAndVariation = ({ product }: { product: ProductDataModel }) => {
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
                <div className="flex items-center mb-4">
                    <button className="bg-brown-700 text-white px-4 py-2 rounded-full mr-2">Buy Now</button>
                    <button className="bg-white text-black px-4 py-2 rounded-full border border-gray-400">Add to Cart</button>
                    <button className="ml-2 text-white"><i className="far fa-heart"></i></button>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <img src="https://placehold.co/50x50" alt="DHL logo" className="mx-auto mb-2" />
                        <span>Delivery Partner</span>
                    </div>
                    <div>
                        <img src="https://placehold.co/50x50" alt="Returns & Replacements icon" className="mx-auto mb-2" />
                        <span>Returns & Replacements</span>
                    </div>
                    <div>
                        <img src="https://placehold.co/50x50" alt="Free Deliveries icon" className="mx-auto mb-2" />
                        <span>Free Deliveries</span>
                    </div>
                    <div>
                        <img src="https://placehold.co/50x50" alt="Hand Crafted icon" className="mx-auto mb-2" />
                        <span>Hand Crafted</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PriceAndVariation