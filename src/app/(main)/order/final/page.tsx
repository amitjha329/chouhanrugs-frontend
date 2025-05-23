import { auth } from '@/auth'
import getProductWithId from '@/backend/serverActions/getProductWithId'
import getUserAddressWithId from '@/backend/serverActions/getUserAddressWithId'
import getUserOrderWithId from '@/backend/serverActions/getUserOrderWithId'
import { randomInt } from 'crypto'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import GtagEvent from './GtagEvent'

const OrderFinalPage = async (props: { searchParams: Promise<{ [key: string]: string }> }) => {
    const searchParams = await props.searchParams;
    const orderData = await getUserOrderWithId(searchParams.order)
    if (orderData == undefined) return notFound()
    const shippingAddress = await getUserAddressWithId(orderData.shippingAddress)
    const session = await auth()
    if ((session?.user as { id: string }).id !== orderData.userId) {
        redirect('/')
    }
    const orderPorductsPromise = orderData.products.map(product => getProductWithId(product.productId))
    const orderedProducts = await Promise.all(orderPorductsPromise)
    return (
        <>
            <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                {
                    orderData && orderData != null ? (
                        <>
                            <div className="flex justify-start item-start space-y-2 flex-col ">
                                <h1 className="text-xl font-semibold leading-7 lg:leading-9  text-gray-800">Order {orderData._id}</h1>
                                <p className="text-sm font-medium leading-6 text-gray-600">{new Date(orderData.orderPlacedOn).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
                            </div>
                            <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                                    <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                        <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">Order Items</p>
                                        {
                                            orderedProducts.length > 0 ? orderedProducts.map((product, index) => product ? <div key={product._id?.toString()} className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                                <div className="pb-4 md:pb-8 w-full relative flex flex-row items-center">
                                                    <Image src={product.images[product.productPrimaryImageIndex]} alt="dress" height={100} width={100} />
                                                    <h3 className="text-lg ml-3 leading-6 text-gray-800">{product.productName}</h3>
                                                </div>
                                                <div className="md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                                    <div className="flex justify-between space-x-8 items-start w-full">
                                                        <p className="text-base xl:text-lg leading-6">
                                                            {orderData.userCurrency.currencySymbol}{(orderData.products[index].productPrice * (orderData.userCurrency.exchangeRates ?? 1)).toFixed(2)} <span className="text-red-300 line-through"> {orderData.userCurrency.currencySymbol}{(orderData.products[index].productMSRP * (orderData.userCurrency.exchangeRates ?? 1)).toFixed(2)}</span>
                                                        </p>
                                                        <p className="text-base xl:text-lg leading-6 text-gray-800">{orderData.products[index].quantity}</p>
                                                        <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">{orderData.userCurrency.currencySymbol}{(Number(orderData.products[index].productPrice) * Number(orderData.products[index].quantity) * (orderData.userCurrency.exchangeRates ?? 1)).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div> : <div key={product ?? "" + index.toString() + randomInt(999).toString()} className='card bordered card-body card-title p-14'>Product Not Available</div>
                                            ) : <div className="w-full flex items-center justify-center"><span className="loading loading-dots loading-lg"></span></div>
                                        }
                                    </div>
                                    <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
                                            <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                                <div className="flex justify-between  w-full">
                                                    <p className="text-base leading-4 text-gray-800">Subtotal</p>
                                                    <p className="text-base leading-4 text-gray-600">{orderData.userCurrency.currencySymbol}{orderData.subtotal}</p>
                                                </div>
                                                <div className="flex justify-between items-center w-full">
                                                    <p className="text-base leading-4 text-gray-800">
                                                        Discount
                                                    </p>
                                                    <p className="text-base leading-4 text-gray-600">-{orderData.couponApplied?.value ?? 0}%</p>
                                                </div>
                                                <div className="flex justify-between items-center w-full">
                                                    <p className="text-base leading-4 text-gray-800">Shipping</p>
                                                    <p className="text-base leading-4 text-gray-600">Free</p>
                                                </div>
                                                <div className="flex justify-between items-center w-full">
                                                    <p className="text-base leading-4 text-gray-800">Tax</p>
                                                    <p className="text-base leading-4 text-gray-600">{orderData.userCurrency.currencySymbol}{Number(orderData.taxation).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center w-full">
                                                <p className="text-base font-semibold leading-4 text-gray-800">Total</p>
                                                <p className="text-base font-semibold leading-4 text-gray-600">{orderData.userCurrency.currencySymbol}{orderData.orderValue}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Shipping</h3>
                                            <div className="flex justify-between items-start w-full">
                                                <div className="flex justify-center items-center space-x-4">
                                                    <div className="w-8 h-8">
                                                        <Image height={32} width={32} alt="logo" src="/image-3.png" />
                                                    </div>
                                                    <div className="flex flex-col justify-start items-center">
                                                        <p className="text-lg leading-6 font-semibold text-gray-800">
                                                            DHL Delivery
                                                            <br />
                                                            <span className="font-normal">Fastest Delivery Possible</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-semibold leading-6 text-gray-800">{orderData.userCurrency.currencySymbol}0.00</p>
                                            </div>
                                            <div className="w-full flex justify-center items-center">
                                                <button className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">View Carrier Details</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                                    <h3 className="text-xl font-semibold leading-5 text-gray-800">Customer</h3>
                                    <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                                            <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                                <Image height={56} width={56} src={session?.user?.image ?? ""} alt="avatar" />
                                                <div className=" flex justify-start items-start flex-col space-y-2">
                                                    <p className="text-base font-semibold leading-4 text-left text-gray-800">{session?.user?.name ?? ""}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{session?.user?.email ?? ""}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8">
                                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                                        {shippingAddress?.streetAddress ?? ""}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br /> {shippingAddress.country}
                                                    </p>
                                                </div>
                                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 ">
                                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Billing Address</p>
                                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{shippingAddress.streetAddress}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br /> {shippingAddress.country}</p>
                                                </div>
                                            </div>
                                            {/* <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                                    <button className="mt-6 md:mt-0 py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base leading-4 text-gray-800">Edit Details</button>
                                </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : <div className="w-full md:min-h-[400px] text-5xl flex justify-center items-center opacity-75">Order not Found</div>
                }
            </div>
            <GtagEvent />
        </>
    )
}

export default OrderFinalPage