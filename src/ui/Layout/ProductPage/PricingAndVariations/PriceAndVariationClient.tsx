import { ProductDataModel } from '@/types/ProductDataModel'
import React from 'react'

const PriceAndVariationClient = ({ product }: { product: ProductDataModel }) => {
    return (
        <>
            <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-brown-700">${product.productSellingPrice}</span>
                <span className="line-through ml-2 text-gray-500">${product.productMSRP}</span>
                <button className="bg-green-500 text-white ~px-1/3 py-1 rounded ml-4 ~text-sm/base">Save {product.productDiscountPercentage}</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block mb-1">Color</label>
                    <div className="relative">
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option><span className='bg-gray-50 h-5 w-5'></span>Gray</option>
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
        </>
    )
}

export default PriceAndVariationClient