import ColorDataModel from '@/types/ColorDataModel'
import { ProductDataModel } from '@/types/ProductDataModel'
import SizeDataModel from '@/types/SizeDataModel'
import Script from 'next/script'
import React from 'react'

interface VariationExtraDataModel extends ProductDataModel{
    colorData:ColorDataModel[],
    sizeData:SizeDataModel[]
}

const PriceAndVariationClient = ({ product }: { product: VariationExtraDataModel }) => {
    return (
        <>
            <div className="flex items-center mb-4">
                <span className="~text-xl/3xl font-bold text-brown-700">${product.productSellingPrice}</span>
                <span className="line-through ml-2 text-gray-500">${product.productMSRP}</span>
                <button className="bg-green-500 text-white ~px-1/3 py-1 rounded ml-4 ~text-sm/base">Save {product.productDiscountPercentage}</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
                {product.colorData.length > 0 && <div>
                    <label className="block mb-1">Color</label>
                    <div className="relative">
                        <select
                            id="color-select"
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 ~px-3/4 ~py-1/2 ~pr-6/8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                            name="color"
                        >
                            {product.colorData.map((color) => (
                                <option key={color.colorCode.hex} value={color.colorCode.hex}>
                                    {color.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span
                                className="inline-block w-4 h-4 rounded-sm"
                                id='display-color'
                                style={{ backgroundColor: "transparent" }}
                            ></span>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>}
                {product.sizeData.length > 0 && <div>
                    <label className="block mb-1">Size</label>
                    <div className="relative">
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 ~px-3/4 ~py-1/2 ~pr-6/8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id='selected_size'>
                        {
                            product.sizeData.map((size) => (
                                <option key={size.sizeCode} value={size.sizeCode}>
                                    {size.sizeCode}
                                </option>
                            ))
                        }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>}
                <div>
                    <label className="block mb-1">Quantity</label>
                    <div className="relative">
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 ~px-3/4 ~py-1/2 ~pr-6/8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id='product_quantity'>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-5 mb-4">
                <div className="btn btn-accent ~px-10/20" id='buy_now_btn'>Buy Now</div>
                <div className="btn btn-outline btn-accent ~px-10/20" id='add_to_cart_btn'>Add to Cart</div>
            </div>
            <input className='hidden' type='hidden' value={JSON.stringify(product)} id='prod_data' />
            <Script id='color_Selector_logic' src='/variationHandler.js' />
        </>
    )
}

export default PriceAndVariationClient