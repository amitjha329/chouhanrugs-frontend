'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PaymentCancelledPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [orderNumber, setOrderNumber] = useState<string>('')
    const [reason, setReason] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState(true)

    useEffect(() => {
        const handleCancellation = async () => {
            // Get order number from sessionStorage
            const storedOrderNumber = sessionStorage.getItem('payoneerOrderNumber')
            
            // Get reason from URL params if available
            const interactionReason = searchParams.get('interactionReason')
            const resultCode = searchParams.get('resultCode')
            
            if (interactionReason) {
                setReason(interactionReason)
            } else if (resultCode) {
                setReason(`Code: ${resultCode}`)
            }

            if (storedOrderNumber) {
                setOrderNumber(storedOrderNumber)
                
                // Call API to cancel the order
                try {
                    const response = await fetch('/api/payoneer/cancel', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            orderId: storedOrderNumber,
                            status: 'cancelled',
                            reason: interactionReason || 'Payment cancelled by user'
                        })
                    })

                    const result = await response.json()
                    
                    if (result.success) {
                        console.log('✅ Order cancelled successfully:', storedOrderNumber)
                    } else {
                        console.error('❌ Failed to cancel order:', result.error)
                    }
                } catch (error) {
                    console.error('❌ Error cancelling order:', error)
                }
                
                // Clean up session storage
                sessionStorage.removeItem('payoneerOrderNumber')
            }
            
            setIsProcessing(false)
        }

        handleCancellation()
    }, [searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {isProcessing ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Cancellation</h2>
                        <p className="text-gray-600">Please wait while we update your order...</p>
                    </div>
                ) : (
                <div className="text-center">
                    {/* Cancelled Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                            <svg
                                className="w-12 h-12 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Payment Cancelled
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 mb-4">
                        Your payment was cancelled and has not been processed.
                    </p>

                    {reason && (
                        <p className="text-sm text-gray-500 mb-4">
                            Reason: {reason}
                        </p>
                    )}

                    {orderNumber && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-amber-800">
                                <span className="font-semibold">Order Reference:</span> {orderNumber}
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                This order has been marked as cancelled. You can place a new order.
                            </p>
                        </div>
                    )}

                    {/* Information Box */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-800 mb-2">What happened?</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• You cancelled the payment before completion</li>
                            <li>• No amount has been deducted from your account</li>
                            <li>• Your cart items are still saved</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/cart/checkout"
                            className="block w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </Link>
                        
                        <Link
                            href="/cart"
                            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Return to Cart
                        </Link>

                        <Link
                            href="/"
                            className="block w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need help? Contact our support team at{' '}
                            <a href="mailto:support@chouhanrugs.com" className="text-primary hover:underline">
                                support@chouhanrugs.com
                            </a>
                        </p>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}
