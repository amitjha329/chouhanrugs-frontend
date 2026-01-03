import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { randomInt } from 'crypto'
import OrderDataModel from '@/types/OrderDataModel'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import UserAddressDataModel from '@/types/UserAddressDataModel'
import DownloadInvoiceButton from '../DownloadInvoiceButton'
import OrderTrackingProgressbar from '../OrderTrackingProgressbar'
import { HiOutlineCube, HiOutlineTruck, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowPath, HiOutlineClock, HiOutlineArrowLeft, HiOutlineDocumentText, HiOutlineShoppingBag, HiOutlineMapPin, HiOutlineReceiptPercent, HiOutlineExclamationTriangle } from 'react-icons/hi2'

// Status configuration for different order states
const statusConfig = {
    pending: {
        label: 'Pending Review',
        color: 'badge-warning',
        icon: HiOutlineClock,
    },
    placed: {
        label: 'Order Placed',
        color: 'badge-info',
        icon: HiOutlineCube,
    },
    dispatched: {
        label: 'Dispatched',
        color: 'badge-primary',
        icon: HiOutlineTruck,
    },
    transit: {
        label: 'In Transit',
        color: 'badge-secondary',
        icon: HiOutlineTruck,
    },
    'out-for-delivery': {
        label: 'Out for Delivery',
        color: 'badge-accent',
        icon: HiOutlineTruck,
    },
    delivered: {
        label: 'Delivered',
        color: 'badge-success',
        icon: HiOutlineCheckCircle,
    },
    cancelled: {
        label: 'Cancelled',
        color: 'badge-error',
        icon: HiOutlineXCircle,
    },
    returned: {
        label: 'Returned',
        color: 'badge-neutral',
        icon: HiOutlineArrowPath,
    }
}

const UserOrderView = ({ orderItem, productsList, shippingAddress }: { orderItem: OrderDataModel, productsList: (ProductDataModelWithColorMap | null)[], shippingAddress: UserAddressDataModel }) => {
    const status = orderItem.orderStatus as keyof typeof statusConfig
    const config = statusConfig[status] || statusConfig.pending
    const StatusIcon = config.icon
    const isCancelled = status === 'cancelled'
    const isPending = status === 'pending'
    const isReturned = status === 'returned'
    const isDelivered = status === 'delivered'
    const showInvoice = !isPending && !isCancelled

    return (
        <div className="w-full">
            {/* Back Button */}
            <Link href="/user/orders" className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors mb-4">
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to Orders
            </Link>

            {/* Order Header Card */}
            <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden mb-6">
                <div className="px-6 py-5 bg-gradient-to-r from-primary/10 to-transparent border-b border-base-300/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-base-content mb-2">
                                Order #{orderItem._id}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                                <span className="flex items-center gap-1.5">
                                    <HiOutlineClock className="w-4 h-4" />
                                    {new Date(orderItem.orderPlacedOn).toLocaleDateString("en-US", { dateStyle: "long" })}
                                </span>
                                <span className="w-1 h-1 bg-base-content/30 rounded-full"></span>
                                <span>Payment: {orderItem.paymentMode}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`badge ${config.color} badge-lg gap-2`}>
                                <StatusIcon className="w-4 h-4" />
                                {config.label}
                            </div>
                            {showInvoice && (
                                <DownloadInvoiceButton 
                                    orderId={orderItem._id} 
                                    className="btn btn-outline btn-sm gap-2" 
                                    text={<><HiOutlineDocumentText className="w-4 h-4" /> Invoice</>} 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Cancelled/Returned Notice */}
                {(isCancelled || isReturned) && (
                    <div className={`px-6 py-4 ${isCancelled ? 'bg-error/5' : 'bg-neutral/5'}`}>
                        <div className="flex items-center gap-3">
                            {isCancelled ? (
                                <HiOutlineXCircle className="w-5 h-5 text-error flex-shrink-0" />
                            ) : (
                                <HiOutlineArrowPath className="w-5 h-5 text-neutral flex-shrink-0" />
                            )}
                            <div>
                                <p className={`font-medium ${isCancelled ? 'text-error' : 'text-base-content'}`}>
                                    {isCancelled ? 'This order has been cancelled' : 'This order has been returned'}
                                </p>
                                <p className="text-sm text-base-content/60">
                                    {isCancelled 
                                        ? 'If any amount was deducted, it will be refunded within 5-7 business days.'
                                        : 'Refund will be processed within 5-7 business days.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Tracking */}
                {!isCancelled && !isReturned && (
                    <div className="p-6 bg-gradient-to-b from-base-200/30 to-transparent">
                        <OrderTrackingProgressbar orderStatus={orderItem.orderStatus} className="flex flex-col" />
                    </div>
                )}
            </div>

            {/* Products Section */}
            <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent">
                    <h2 className="font-semibold text-base-content flex items-center gap-2">
                        <HiOutlineShoppingBag className="w-5 h-5 text-primary" />
                        Order Items ({productsList.length})
                    </h2>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    {productsList.map((product, index) => product ? (
                        <div 
                            key={product._id?.toString()} 
                            className="group flex flex-col sm:flex-row gap-4 p-4 bg-base-100 rounded-xl border border-base-300/50 hover:border-primary/30 hover:shadow-md transition-all"
                        >
                            {/* Product Image */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-base-200 flex-shrink-0">
                                <Image 
                                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                    sizes="(max-width: 640px) 80px, 96px" 
                                    quality={60} 
                                    src={product.images[product.productPrimaryImageIndex]} 
                                    alt={product.productName} 
                                    fill 
                                />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {product.productName}
                                </h3>
                                
                                {/* Variation Badges */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {orderItem.products[index].variation && orderItem.products[index].variation !== "customSize" && (
                                        <>
                                            {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationSize && (
                                                <span className="badge badge-outline badge-sm">
                                                    Size: {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationSize}
                                                </span>
                                            )}
                                            {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationColor && (
                                                <span className="badge badge-outline badge-sm">
                                                    Color: {product.variations.find(varItem => varItem.variationCode === orderItem.products[index].variation)?.variationColor}
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {orderItem.products[index].customSize && (
                                        <span className="badge badge-primary badge-sm">
                                            Custom: {orderItem.products[index].customSize.shape}
                                            {orderItem.products[index].customSize.dimensions.length && ` ${orderItem.products[index].customSize.dimensions.length}×${orderItem.products[index].customSize.dimensions.width}`}
                                            {orderItem.products[index].customSize.dimensions.diameter && ` Ø${orderItem.products[index].customSize.dimensions.diameter}`}
                                        </span>
                                    )}
                                </div>

                                {/* Price Info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="text-base-content/70">
                                        Qty: <span className="font-semibold text-base-content">{orderItem.products[index].quantity}</span>
                                    </span>
                                    <span className="text-base-content/70">
                                        @ <span className="font-semibold text-base-content">
                                            {orderItem.userCurrency.currencySymbol}
                                            {(Number(orderItem.products[index].productPrice) * (orderItem.userCurrency.exchangeRates ?? 1)).toFixed(2)}
                                        </span>
                                    </span>
                                    <span className="ml-auto text-lg font-bold text-primary">
                                        {orderItem.userCurrency.currencySymbol}
                                        {(Number(orderItem.products[index].productPrice) * Number(orderItem.products[index].quantity) * (orderItem.userCurrency.exchangeRates ?? 1)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div key={product ?? "" + index.toString() + randomInt(999).toString()} className="flex items-center gap-4 p-4 bg-error/5 border border-error/20 rounded-xl">
                            <div className="w-16 h-16 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <HiOutlineExclamationTriangle className="w-8 h-8 text-error" />
                            </div>
                            <div>
                                <p className="font-medium text-error">Product Not Available</p>
                                <p className="text-sm text-base-content/60">This product is no longer in our catalog</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary and Address Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent">
                        <h2 className="font-semibold text-base-content flex items-center gap-2">
                            <HiOutlineReceiptPercent className="w-5 h-5 text-primary" />
                            Order Summary
                        </h2>
                    </div>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center text-base-content/70">
                            <span>Subtotal</span>
                            <span className="font-medium text-base-content">{orderItem.userCurrency.currencySymbol}{orderItem.subtotal}</span>
                        </div>
                        {orderItem.couponApplied && (
                            <div className="flex justify-between items-center text-base-content/70">
                                <span>Discount</span>
                                <span className="font-medium text-success">-{orderItem.couponApplied.value}%</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-base-content/70">
                            <span>Shipping</span>
                            <span className="font-medium text-success">Free</span>
                        </div>
                        <div className="flex justify-between items-center text-base-content/70">
                            <span>Tax</span>
                            <span className="font-medium text-base-content">{orderItem.userCurrency.currencySymbol}{Number(orderItem.taxation).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-base-300/50 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-base-content">Total</span>
                                <span className="text-xl font-bold text-primary">{orderItem.userCurrency.currencySymbol}{orderItem.orderValue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent">
                        <h2 className="font-semibold text-base-content flex items-center gap-2">
                            <HiOutlineMapPin className="w-5 h-5 text-primary" />
                            Delivery Address
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-primary">
                                    {shippingAddress.fname[0]}{shippingAddress.lname[0]}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-base-content mb-1">
                                    {shippingAddress.fname} {shippingAddress.lname}
                                </h4>
                                <p className="text-sm text-base-content/70 leading-relaxed">
                                    {shippingAddress.streetAddress}<br />
                                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br />
                                    {shippingAddress.country}
                                </p>
                                {shippingAddress.email && (
                                    <p className="text-sm text-base-content/60 mt-2">{shippingAddress.email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserOrderView