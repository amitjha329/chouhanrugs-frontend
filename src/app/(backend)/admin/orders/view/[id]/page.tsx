import getProductWithId from '@/lib/actions/getProductWithId'
import getUserAddressWithId from '@/lib/actions/getUserAddressWithId'
import getUserInfo from '@/lib/actions/getUserInfo'
import getUserOrderWithId from '@/lib/actions/getUserOrderWithId'
import { OrderProduct } from '@/lib/types/OrderDataModel'
import { ProductDataModel, ProductDataModelWithColorMap } from '@/lib/types/ProductDataModel'
import OrderViewActionButtons from '@/ui/backend/OrderViewActionButtons'
import OrderProductShippingDisclosure from '@/ui/frontend/Sections/OrderProductShippingDisclosure'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import StickyBox from 'react-sticky-box'

const AdminViewOrderpage = async ({ params }: { params: { id: string } }) => {
    function getCustomSizePrice(item: OrderProduct, productPriceSqFt: number, quantity: number = 1) {
        switch (item.customSize?.shape) {
            case "Rectangle":
            case "Runner":
            case "Square":
                return productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1)
            case "Round":
                return productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI)
            default:
                return 0
        }
    }
    function printprice(price: number, discountpercent: number, exchangerate: number, quantity: number = 1) {
        return ((price - (price * (discountpercent / 100))) * exchangerate) * quantity >> 0
    }
    const [orderData] = await Promise.all([getUserOrderWithId(params.id)])
    if (orderData == undefined) return notFound()
    const orderPorductsPromise: Promise<ProductDataModelWithColorMap | null>[] = orderData.products.map(product => getProductWithId(product.productId))
    const productsList = await Promise.all(orderPorductsPromise)
    const [customerDetails, shippingAddress] = await Promise.all([getUserInfo(orderData.userId), getUserAddressWithId(orderData.shippingAddress)])
    return (
        <div className='flex flex-row gap-3 items-start'>
            <div className='flex flex-col gap-3 basis-2/3'>
                <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                    <div className='card-body'>
                        <div className='card-title'>Ordered Products</div>
                        {
                            productsList.map((product, index) => product!=null?<Link href={`/products/${product.productURL}`} key={product._id?.toString()} className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-center md:items-center md:space-x-6 xl:space-x-8 w-full border-gray-200 border-b">
                                <Image className="w-24 hidden md:block" src={product.images[product.productPrimaryImageIndex]} alt="dress" height={100} width={100} />
                                <div className="md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                                        <h3 className="leading-6 text-gray-800 mr-5">{product.productName}</h3>
                                        <div className='flex gap-2'>
                                            {
                                                orderData.products[index].variation && <>
                                                    {product.variations.find(varItem => varItem.variationCode == orderData.products[index].variation)?.variationSize != null && <span className="opacity-80 text-xs">Size: {product.variations.find(varItem => varItem.variationCode == orderData.products[index].variation)?.variationSize}</span>}
                                                    {product.variations.find(varItem => varItem.variationCode == orderData.products[index].variation)?.variationColor != null && <span className="opacity-80 text-xs">Color: {product.variations.find(varItem => varItem.variationCode == orderData.products[index].variation)?.variationColor}</span>}
                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between space-x-8 items-start w-full">
                                        <p className="text-base xl:text-lg leading-6 text-gray-800">Quantity: {orderData.products[index].quantity}</p>
                                        <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                            {orderData.userCurrency.currencySymbol}&nbsp;{
                                                orderData.products[index].variation == "customSize" && getCustomSizePrice(orderData.products[index], productsList[index]!.productPriceSqFt, orderData.products[index].quantity)
                                            }
                                            {
                                                orderData.products[index].variation && orderData.products[index].variation != "customSize" && printprice(parseInt(product.variations.find(varItem => varItem.variationCode == orderData.products[index].variation)?.variationPrice ?? '0'), parseInt(product.variations.find(varItem => varItem.variationCode == orderData.products[index].variation)?.variationDiscount ?? '0'), 1, orderData.products[index].quantity)
                                            }
                                        </p>
                                    </div>
                                </div>
                            </Link>:<div key={index} className='card card-body card-title p-14 bordered bg-gray-200'>Product Deleted</div>)
                        }
                    </div>
                </div>
                {(orderData.orderStatus == "delivered" || orderData.orderStatus == "dispatched" || orderData.orderStatus == "transit" || orderData.orderStatus == "out-for-delivery") && <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                    <div className='card-body'>
                        <div className='card-title'>Order Tracking</div>
                        <OrderProductShippingDisclosure orderItem={orderData} />
                    </div>
                </div>}
                <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                    <div className='card-body'>
                        <div className='card-title'>Payment Details</div>
                        <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                            <div className="flex justify-between  w-full">
                                <p className="text-base leading-4 text-gray-800 text-left">Subtotal</p>
                                <p className="text-base leading-4 text-gray-600 text-right">{orderData.userCurrency.currencySymbol}{orderData.subtotal}</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="text-base leading-4 text-gray-800 text-left">
                                    Discount
                                </p>
                                <p className="text-base leading-4 text-gray-600 text-right">-{orderData.couponApplied?.code ?? 0}%</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="text-base leading-4 text-gray-800 text-left">Shipping</p>
                                <p className="text-base leading-4 text-gray-600 text-right">Free</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="text-base leading-4 text-gray-800 text-left">Tax</p>
                                <p className="text-base leading-4 text-gray-600 text-right">{orderData.userCurrency.currencySymbol}{Number(orderData.taxation).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-base font-semibold leading-4 text-gray-800 text-left">Total</p>
                            <p className="text-base font-semibold leading-4 text-gray-600 text-right">{orderData.userCurrency.currencySymbol}{orderData.orderValue}</p>
                        </div>
                    </div>
                </div>
            </div>
            <StickyBox offsetBottom={0} offsetTop={0} className='basis-1/3'>
                <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white '>
                    <div className='card-body items-center'>
                        <div className='card-title'>Customer Details</div>
                        <div className="flex flex-col justify-start items-start w-full">
                            <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 border-b border-gray-200">
                                <Image height={56} width={56} src={customerDetails?.image ?? ""} alt="avatar" />
                                <div className=" flex justify-start items-start flex-col space-y-2">
                                    <p className="text-base font-semibold leading-4 text-left text-gray-800">{customerDetails?.name}</p>
                                </div>
                            </div>

                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{customerDetails?.email}</p>
                            </div>
                        </div>
                        <div className='card-title mt-5'>Shipping Details</div>
                        <div className="flex justify-between items-stretch w-full flex-col mt-6 md:mt-0">
                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
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
                        <div className='card-actions w-full'>
                            <OrderViewActionButtons orderData={orderData} />
                        </div>
                    </div>
                </div>
            </StickyBox>

        </div>
    )
}

export default AdminViewOrderpage