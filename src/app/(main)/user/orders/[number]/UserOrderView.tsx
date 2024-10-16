import React from 'react'
import Image from 'next/image'
import { randomInt } from 'crypto'
import OrderDataModel from '@/types/OrderDataModel'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import UserAddressDataModel from '@/types/UserAddressDataModel'
import DownloadInvoiceButton from '../DownloadInvoiceButton'
import OrderTrackingProgressbar from '../OrderTrackingProgressbar'

const UserOrderView = ({ orderItem, productsList, shippingAddress }: { orderItem: OrderDataModel, productsList: (ProductDataModelWithColorMap | null)[], shippingAddress: UserAddressDataModel }) => {

    return (
        <div className="basis-full lg:basis-3/4">
            <div className="mx-auto px-4 sm:px-6">
                <div className="container mx-auto my-8 drop-shadow-lg card card-bordered bg-white card-body">
                    <div className='card-title justify-between'>
                        <span>Order # {orderItem._id}</span>
                        <DownloadInvoiceButton orderId={orderItem._id} className='btn btn-sm btn-outline' text='Invoice' />
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div><span className='text-gray-500'>Order Date:</span> {new Date(orderItem.orderPlacedOn).toLocaleDateString("en-US", {
                            dateStyle: "medium"
                        })}</div>
                        <div><span className='text-gray-500'>Est. Delivery:</span> {new Date(orderItem.orderPlacedOn).toLocaleDateString("en-US", {
                            dateStyle: "medium"
                        })}</div>
                    </div>
                    <div className='divider'></div>
                    {
                        productsList.map((product, index) => product ? <div key={product._id?.toString()} className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-center md:items-center md:space-x-6 xl:space-x-8 w-full border-gray-200 border-b">
                            <figure className='w-24 hidden md:block relative'>
                                <Image className="!w-full !h-auto !relative" sizes='10vw' quality={20} src={product.images[product.productPrimaryImageIndex]} alt="dress" fill />
                            </figure>
                            <div className="md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                <div className="w-full flex flex-col justify-start items-start space-y-8">
                                    <h3 className="leading-6 text-gray-800 mr-2">{product.productName}</h3>
                                    <div className='flex gap-2'>
                                        {
                                            orderItem.products[index].variation && <>
                                                {product.variations.find(varItem => varItem.variationCode == orderItem.products[index].variation)?.variationSize != null && <span className="opacity-80 text-xs">Size: {product.variations.find(varItem => varItem.variationCode == orderItem.products[index].variation)?.variationSize}</span>}
                                                {product.variations.find(varItem => varItem.variationCode == orderItem.products[index].variation)?.variationColor != null && <span className="opacity-80 text-xs">Color: {product.variations.find(varItem => varItem.variationCode == orderItem.products[index].variation)?.variationColor}</span>}
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-8 items-start w-full">
                                    <p className="text-base xl:text-lg leading-6">
                                        {orderItem.userCurrency.currencySymbol}{(orderItem.products[index].productPrice * (orderItem.userCurrency.exchangeRates ?? 1)).toFixed(2)} <span className="text-red-300 line-through"> {orderItem.userCurrency.currencySymbol}{(orderItem.products[index].productMSRP * (orderItem.userCurrency.exchangeRates ?? 1)).toFixed(2)}</span>
                                    </p>
                                    <p className="text-base xl:text-lg leading-6 text-gray-800">{orderItem.products[index].quantity}</p>
                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">{orderItem.userCurrency.currencySymbol}{(Number(orderItem.products[index].productPrice) * Number(orderItem.products[index].quantity) * (orderItem.userCurrency.exchangeRates ?? 1)).toFixed(2)}</p>
                                </div>
                            </div>
                        </div> : <div key={product ?? "" + index.toString() + randomInt(999).toString()} className='card bordered card-body card-title p-14'>Product Not Available</div>
                        )
                    }
                    <OrderTrackingProgressbar orderStatus={orderItem.orderStatus} className="felx flex-col !pt-8" />
                    <div className='divider'></div>
                    <div className='flex justify-between items-stretch gap-x-7 max-md:flex-col-reverse'>
                        <div className='md:basis-1/2'>
                            <div className='card-title mb-3'>Order Summary</div>
                            <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-300 border-b pb-4">
                                <div className="flex justify-between w-full">
                                    <p className="text-base leading-4 text-gray-800 text-left">Subtotal</p>
                                    <p className="text-base leading-4 text-gray-600 text-right">{orderItem.userCurrency.currencySymbol}{orderItem.subtotal}</p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base leading-4 text-gray-800 text-left">
                                        Discount
                                    </p>
                                    <p className="text-base leading-4 text-gray-600 text-right">-{orderItem.couponApplied?.value ?? 0}%</p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base leading-4 text-gray-800 text-left">Shipping</p>
                                    <p className="text-base leading-4 text-gray-600 text-right">Free</p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base leading-4 text-gray-800 text-left">Tax</p>
                                    <p className="text-base leading-4 text-gray-600 text-right">{orderItem.userCurrency.currencySymbol}{Number(orderItem.taxation).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center w-full mt-5">
                                <p className="text-base font-semibold leading-4 text-gray-800 text-left">Total</p>
                                <p className="text-base font-semibold leading-4 text-gray-600 text-right">{orderItem.userCurrency.currencySymbol}{orderItem.orderValue.toFixed(0)}</p>
                            </div>
                        </div>
                        <div className='flex justify-between items-center md:basis-1/2 max-[482px]:flex-col max-md:mb-5 max-[482px]:gap-5'>
                            <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4">
                                <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Delivery Address</p>
                                <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                    {shippingAddress.streetAddress}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br /> {shippingAddress.country}
                                </p>
                            </div>
                            <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 ">
                                <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Billing Address</p>
                                <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{shippingAddress.streetAddress}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br /> {shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserOrderView