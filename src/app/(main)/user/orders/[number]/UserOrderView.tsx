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
        <div className="basis-full lg:basis-3/4 w-full min-w-0">
            <div className="mx-auto px-2 sm:px-4 max-w-6xl">
                {/* Header Section with Gradient */}
                <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-t-xl shadow-lg p-3 sm:p-4 md:p-5 mt-4 sm:mt-6">
                    <div className="flex flex-col gap-3">
                        <div className="text-white">
                            <h1 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 break-all sm:break-normal">Order #{orderItem._id}</h1>
                            <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs md:text-sm opacity-90">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Ordered: {new Date(orderItem.orderPlacedOn).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Payment: {orderItem.paymentMode}</span>
                                </div>
                            </div>
                        </div>
                        <DownloadInvoiceButton 
                            orderId={orderItem._id} 
                            className="btn btn-xs sm:btn-sm bg-white text-amber-900 hover:bg-amber-50 border-0 shadow font-semibold text-[11px] sm:text-xs w-fit" 
                            text="Invoice" 
                        />
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
                    {/* Order Tracking */}
                    <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-b from-amber-50 to-white border-b border-amber-100 overflow-x-auto">
                        <OrderTrackingProgressbar orderStatus={orderItem.orderStatus} className="flex flex-col min-w-[280px]" />
                    </div>

                    {/* Products Section */}
                    <div className="p-3 sm:p-4 md:p-5">
                        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span>Order Items</span>
                        </h2>
                        <div className="space-y-2 sm:space-y-3">
                            {productsList.map((product, index) => product ? (
                                <div 
                                    key={product._id?.toString()} 
                                    className="group bg-gradient-to-r from-gray-50 to-white hover:from-amber-50 hover:to-orange-50 rounded-lg p-2.5 sm:p-3 md:p-4 border border-gray-200 hover:border-amber-300 transition-all duration-300 shadow-sm hover:shadow"
                                >
                                    <div className="flex gap-2.5 sm:gap-3 md:gap-4">
                                        {/* Product Image */}
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-white shadow-sm flex-shrink-0">
                                            <Image 
                                                className="object-cover hover:scale-110 transition-transform duration-300" 
                                                sizes="(max-width: 640px) 64px, 80px" 
                                                quality={60} 
                                                src={product.images[product.productPrimaryImageIndex]} 
                                                alt={product.productName} 
                                                fill 
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                                            <div className="min-w-0">
                                                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-1 sm:mb-1.5 group-hover:text-amber-900 transition-colors line-clamp-2">
                                                    {product.productName}
                                                </h3>
                                                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                                    {orderItem.products[index].variation && orderItem.products[index].variation !== "customSize" && (
                                                        <>
                                                            {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationSize && (
                                                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                                    </svg>
                                                                    {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationSize}
                                                                </span>
                                                            )}
                                                            {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationColor && (
                                                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                                                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0112 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 00-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 012.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" />
                                                                    </svg>
                                                                    {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationColor}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                    {orderItem.products[index].customSize && (
                                                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                                            </svg>
                                                            <span className="truncate max-w-[100px] sm:max-w-none">Custom: {orderItem.products[index].customSize.shape}
                                                            {orderItem.products[index].customSize.dimensions.length && ` ${orderItem.products[index].customSize.dimensions.length}×${orderItem.products[index].customSize.dimensions.width}`}
                                                            {orderItem.products[index].customSize.dimensions.diameter && ` Ø${orderItem.products[index].customSize.dimensions.diameter}`}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price and Quantity - Mobile optimized */}
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Qty:</span>
                                                    <span className="inline-flex items-center justify-center min-w-[20px] sm:min-w-[24px] h-5 sm:h-6 px-1.5 sm:px-2 rounded-full bg-amber-100 text-amber-900 font-semibold">
                                                        {orderItem.products[index].quantity}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">@</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {orderItem.userCurrency.currencySymbol}
                                                        {(Number(orderItem.products[index].productPrice) * (orderItem.userCurrency.exchangeRates ?? 1)).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 ml-auto">
                                                    <span className="text-gray-600">Total:</span>
                                                    <span className="text-xs sm:text-sm md:text-base font-bold text-amber-900">
                                                        {orderItem.userCurrency.currencySymbol}
                                                        {(Number(orderItem.products[index].productPrice) * Number(orderItem.products[index].quantity) * (orderItem.userCurrency.exchangeRates ?? 1)).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div key={product ?? "" + index.toString() + randomInt(999).toString()} className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                    <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-red-900">Product Not Available</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary and Address Section */}
                    <div className="bg-gradient-to-b from-gray-50 to-white p-3 sm:p-4 md:p-5 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {/* Order Summary */}
                            <div>
                                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-2.5 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Order Summary
                                </h3>
                                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-[11px] sm:text-xs md:text-sm">
                                            <span className="text-gray-700">Subtotal</span>
                                            <span className="font-semibold text-gray-900">{orderItem.userCurrency.currencySymbol}{orderItem.subtotal}</span>
                                        </div>
                                        {orderItem.couponApplied && (
                                            <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-[11px] sm:text-xs md:text-sm">
                                                <span className="text-gray-700">Discount</span>
                                                <span className="font-semibold text-green-600">-{orderItem.couponApplied.value}%</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-[11px] sm:text-xs md:text-sm">
                                            <span className="text-gray-700">Shipping</span>
                                            <span className="font-semibold text-green-600">Free</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-[11px] sm:text-xs md:text-sm">
                                            <span className="text-gray-700">Tax</span>
                                            <span className="font-semibold text-gray-900">{orderItem.userCurrency.currencySymbol}{Number(orderItem.taxation).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-amber-50 to-orange-50 -mx-3 sm:-mx-4 -mb-3 sm:-mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-b-lg">
                                            <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900">Total</span>
                                            <span className="text-base sm:text-lg md:text-xl font-bold text-amber-900">{orderItem.userCurrency.currencySymbol}{orderItem.orderValue.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Addresses */}
                            <div>
                                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-2.5 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Delivery Info
                                </h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="bg-white rounded-lg p-2.5 sm:p-3.5 shadow-sm border border-gray-200">
                                        <div className="flex items-start gap-2 sm:gap-2.5">
                                            <div className="p-1 sm:p-1.5 bg-amber-100 rounded-md flex-shrink-0">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1">Delivery Address</h4>
                                                <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed break-words">
                                                    {shippingAddress.streetAddress}<br />
                                                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br />
                                                    {shippingAddress.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-2.5 sm:p-3.5 shadow-sm border border-gray-200">
                                        <div className="flex items-start gap-2 sm:gap-2.5">
                                            <div className="p-1 sm:p-1.5 bg-orange-100 rounded-md flex-shrink-0">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1">Billing Address</h4>
                                                <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed break-words">
                                                    {shippingAddress.streetAddress}<br />
                                                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br />
                                                    {shippingAddress.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserOrderView