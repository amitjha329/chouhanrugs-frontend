'use client'
import Link from "next/link"
import OrderDataModel from "@/types/OrderDataModel"
import OrderTrackingProgressbar from "./OrderTrackingProgressbar"
import OrderProductShippingDisclosure from "./OrderProductShippingDisclosure"
import DownloadInvoiceButton from "./DownloadInvoiceButton"
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle, FaUndoAlt, FaClock, FaChevronRight, FaFileInvoice, FaEye } from "react-icons/fa"

type OrderItemProps = {
    orderItem: OrderDataModel
}

// Status configuration for different order states
const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: FaClock,
        bgGradient: 'from-amber-50/50 to-white',
        borderColor: 'border-amber-100',
        accentColor: 'text-amber-600'
    },
    placed: {
        label: 'Placed',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: FaBoxOpen,
        bgGradient: 'from-blue-50/50 to-white',
        borderColor: 'border-blue-100',
        accentColor: 'text-blue-600'
    },
    dispatched: {
        label: 'Dispatched',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        icon: FaTruck,
        bgGradient: 'from-indigo-50/50 to-white',
        borderColor: 'border-indigo-100',
        accentColor: 'text-indigo-600'
    },
    transit: {
        label: 'In Transit',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: FaTruck,
        bgGradient: 'from-purple-50/50 to-white',
        borderColor: 'border-purple-100',
        accentColor: 'text-purple-600'
    },
    'out-for-delivery': {
        label: 'Out for Delivery',
        color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        icon: FaTruck,
        bgGradient: 'from-cyan-50/50 to-white',
        borderColor: 'border-cyan-100',
        accentColor: 'text-cyan-600'
    },
    delivered: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: FaCheckCircle,
        bgGradient: 'from-green-50/50 to-white',
        borderColor: 'border-green-100',
        accentColor: 'text-green-600'
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: FaTimesCircle,
        bgGradient: 'from-red-50/50 to-white',
        borderColor: 'border-red-100',
        accentColor: 'text-red-600'
    },
    returned: {
        label: 'Returned',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: FaUndoAlt,
        bgGradient: 'from-gray-50/50 to-white',
        borderColor: 'border-gray-100',
        accentColor: 'text-gray-600'
    }
}

const OrderItemCard = ({ orderItem }: OrderItemProps) => {
    const status = orderItem.orderStatus as keyof typeof statusConfig
    const config = statusConfig[status] || statusConfig.pending
    const StatusIcon = config.icon
    const isCancelled = status === 'cancelled'
    const isReturned = status === 'returned'
    const isDelivered = status === 'delivered'
    const isPending = status === 'pending'
    const isInactive = isCancelled || isReturned
    // Invoice only available after order is accepted (not pending/cancelled)
    const showInvoice = !isPending && !isCancelled

    return (
        <div className={`bg-gradient-to-r ${config.bgGradient} rounded-lg shadow-sm border ${config.borderColor} overflow-hidden transition-all hover:shadow ${isInactive ? 'opacity-70' : ''}`}>
            {/* Main Card Content - Clickable */}
            <Link href={`/user/orders/${orderItem._id}`} className="block">
                {/* Top Header with Status */}
                <div className={`px-3 py-2 border-b ${config.borderColor} bg-white/60`}>
                    <div className="flex items-center justify-between gap-2">
                        {/* Order ID and Date */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-400 uppercase">Order</span>
                                <span className="font-mono text-xs font-semibold text-gray-700 truncate">
                                    #{orderItem._id.slice(-8)}
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                                {new Date(orderItem.orderPlacedOn).toLocaleDateString("en-IN", { 
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium ${config.color}`}>
                            <StatusIcon className="w-2.5 h-2.5" />
                            <span>{config.label}</span>
                        </div>
                    </div>
                </div>

                {/* Order Details Section */}
                <div className="p-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* Order Summary - Horizontal on mobile */}
                        <div className="flex items-center gap-3 sm:gap-4 text-xs">
                            {/* Total Amount */}
                            <div>
                                <div className="text-[10px] text-gray-400">Total</div>
                                <div className="font-bold text-sm text-gray-900">
                                    {orderItem.userCurrency.currencySymbol}{orderItem.orderValue.toFixed(0)}
                                </div>
                            </div>
                            
                            {/* Items Count */}
                            <div className="border-l border-gray-200 pl-3 sm:pl-4">
                                <div className="text-[10px] text-gray-400">Items</div>
                                <div className="font-medium text-gray-700">
                                    {orderItem.products?.length || 0}
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="border-l border-gray-200 pl-3 sm:pl-4 hidden sm:block">
                                <div className="text-[10px] text-gray-400">Payment</div>
                                <div className={`font-medium text-xs ${
                                    orderItem.paymentStatus === 'paid' 
                                        ? 'text-green-600' 
                                        : orderItem.paymentStatus === 'failed'
                                            ? 'text-red-600'
                                            : 'text-amber-600'
                                }`}>
                                    {orderItem.paymentStatus?.charAt(0).toUpperCase() + orderItem.paymentStatus?.slice(1) || 'Pending'}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Compact */}
                        <div className="flex items-center gap-1.5">
                            {showInvoice && (
                                <DownloadInvoiceButton 
                                    className="inline-flex items-center justify-center p-1.5 text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                    orderId={orderItem._id} 
                                    text={<FaFileInvoice className="w-3 h-3" />}
                                />
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium text-white bg-primary rounded hover:bg-primary/90 transition-colors">
                                <FaEye className="w-3 h-3" />
                                <span className="hidden sm:inline text-xs">View</span>
                                <FaChevronRight className="w-2.5 h-2.5 sm:hidden" />
                            </span>
                        </div>
                    </div>

                    {/* Cancelled Order Notice - Compact */}
                    {isCancelled && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded flex items-center gap-2">
                            <FaTimesCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                            <p className="text-[10px] text-red-700">
                                Order cancelled. Refund within 5-7 days if applicable.
                            </p>
                        </div>
                    )}

                    {/* Returned Order Notice - Compact */}
                    {isReturned && (
                        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded flex items-center gap-2">
                            <FaUndoAlt className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <p className="text-[10px] text-gray-600">
                                Order returned. Refund processing in 5-7 days.
                            </p>
                        </div>
                    )}

                    {/* Delivered Order Notice - Compact */}
                    {isDelivered && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded flex items-center gap-2">
                            <FaCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <p className="text-[10px] text-green-700">
                                Delivered successfully. Thank you!
                            </p>
                        </div>
                    )}
                </div>

                {/* Progress Bar - Only for active orders - Compact */}
                {!isInactive && !isDelivered && (
                    <div className="px-3 pb-3">
                        <OrderTrackingProgressbar orderStatus={orderItem.orderStatus} className="bg-white/80 rounded p-2 border border-gray-100" />
                    </div>
                )}
            </Link>

            {/* Shipping Disclosure - Outside Link to prevent nested interactivity */}
            {!isCancelled && orderItem.tracking?.trackingNum && (
                <div className="border-t border-gray-100">
                    <OrderProductShippingDisclosure orderItem={orderItem} />
                </div>
            )}
        </div>
    )
}

export default OrderItemCard