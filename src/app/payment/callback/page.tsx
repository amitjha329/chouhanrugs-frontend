'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PaymentCallbackPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'cancelled'>('loading')
    const [orderId, setOrderId] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [orderNumber, setOrderNumber] = useState<string>('')

    useEffect(() => {
        const handleCallback = async () => {
            // Get parameters from URL
            const statusParam = searchParams.get('status')
            const orderIdParam = searchParams.get('orderId') || searchParams.get('transactionId')
            const longId = searchParams.get('longId')
            const resultCode = searchParams.get('resultCode')
            const interactionCode = searchParams.get('interactionCode')
            const interactionReason = searchParams.get('interactionReason')

            console.log('Payment callback params:', {
                statusParam,
                orderIdParam,
                resultCode,
                interactionCode,
                interactionReason,
                longId
            })

            // Get order number from sessionStorage (order was already created before redirect)
            const storedOrderNumber = sessionStorage.getItem('payoneerOrderNumber')
            
            if (storedOrderNumber) {
                setOrderNumber(storedOrderNumber)
                setOrderId(storedOrderNumber)
            } else {
                setOrderId(orderIdParam || '')
            }

            // Determine payment status based on Payoneer response
            // Success conditions:
            // - resultCode starts with "00000" or "000.000" (Payoneer success codes)
            // - interactionCode is "PROCEED" with interactionReason "OK"
            // - statusParam is "success"
            const isSuccess = 
                statusParam === 'success' ||
                resultCode?.startsWith('00000') ||
                resultCode?.startsWith('000.000') ||
                (interactionCode === 'PROCEED' && interactionReason === 'OK')

            const isCancelled = 
                statusParam === 'cancelled' ||
                interactionCode === 'ABORT' ||
                resultCode?.includes('cancelled')

            if (isSuccess) {
                setStatus('success')
                setMessage('Your payment has been processed successfully!')
                
                if (storedOrderNumber) {
                    // Order already exists, just clean up and redirect
                    sessionStorage.removeItem('payoneerOrderNumber')
                    
                    // Redirect to order confirmation after 3 seconds
                    setTimeout(() => {
                        router.push(`/user/orders/${storedOrderNumber}`)
                    }, 3000)
                } else {
                    // Fallback: redirect to orders list
                    setTimeout(() => {
                        router.push('/user/orders')
                    }, 3000)
                }
            } else if (isCancelled) {
                setStatus('cancelled')
                setMessage('Payment was cancelled. You can try again.')
                sessionStorage.removeItem('payoneerOrderNumber')
            } else if (statusParam === 'failed' || resultCode?.includes('failed')) {
                setStatus('failed')
                setMessage('Payment failed. Please try again or use a different payment method.')
                sessionStorage.removeItem('payoneerOrderNumber')
            } else {
                // Unknown status - might be pending
                setStatus('loading')
                setMessage('Verifying your payment...')
                
                // Check status after a delay
                setTimeout(() => {
                    setStatus('failed')
                    setMessage('Unable to verify payment status. Please contact support if amount was deducted.')
                }, 5000)
            }
        }

        handleCallback()
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Processing Payment</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 text-green-500 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        {(orderNumber || orderId) && (
                            <p className="text-sm text-gray-500 mb-4">
                                Order ID: {orderNumber || orderId}
                            </p>
                        )}
                        <p className="text-sm text-gray-500">Redirecting to your order...</p>
                        <div className="mt-6">
                            <Link
                                href={orderNumber ? `/user/orders/${orderNumber}` : orderId ? `/user/orders/${orderId}` : '/user/orders'}
                                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                View Order
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 text-red-500 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/checkout"
                                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </Link>
                            <Link
                                href="/contact-us"
                                className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'cancelled' && (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 text-yellow-500 mx-auto"
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
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Cancelled</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/checkout"
                                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Return to Checkout
                            </Link>
                            <Link
                                href="/cart"
                                className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                View Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
