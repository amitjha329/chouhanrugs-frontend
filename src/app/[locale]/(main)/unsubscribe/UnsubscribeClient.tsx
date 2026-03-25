'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { HiOutlineMail, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi'
import unsubscribe from '@/lib/actions/unsubscribe'

type UnsubscribeClientProps = {
    email: string
    token: string
}

export default function UnsubscribeClient({ email, token }: UnsubscribeClientProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleUnsubscribe = async () => {
        if (!email || !token) {
            setStatus('error')
            setMessage('Invalid unsubscribe link. Please use the link from your email.')
            return
        }

        setStatus('loading')

        try {
            const result = await unsubscribe(email, token)

            if (result.ack) {
                setStatus('success')
                setMessage(result.result.message)
            } else {
                setStatus('error')
                setMessage(result.result.message)
            }
        } catch (error) {
            setStatus('error')
            setMessage('Something went wrong. Please try again.')
        }
    }

    // Invalid link state
    if (!email || !token) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiOutlineExclamationCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Link</h1>
                <p className="text-gray-600 mb-6">
                    This unsubscribe link is invalid or incomplete. Please use the unsubscribe link from your email.
                </p>
                <Link 
                    href="/"
                    className="inline-block px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                >
                    Go to Homepage
                </Link>
            </div>
        )
    }

    // Success state
    if (status === 'success') {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiOutlineCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Unsubscribed Successfully</h1>
                <p className="text-gray-600 mb-2">{message}</p>
                <p className="text-sm text-gray-500 mb-6">
                    You will no longer receive marketing emails from us.
                </p>
                <div className="space-y-3">
                    <Link 
                        href="/"
                        className="block w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    <p className="text-sm text-gray-500">
                        Changed your mind?{' '}
                        <Link href="/" className="text-amber-700 hover:text-amber-800 underline">
                            Subscribe again
                        </Link>
                    </p>
                </div>
            </div>
        )
    }

    // Error state
    if (status === 'error') {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiOutlineExclamationCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Unsubscribe Failed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                    <button 
                        onClick={() => setStatus('idle')}
                        className="block w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                    >
                        Try Again
                    </button>
                    <Link 
                        href="/"
                        className="block text-sm text-gray-500 hover:text-amber-700"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        )
    }

    // Initial/Loading state
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineMail className="w-8 h-8 text-amber-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Unsubscribe from Emails</h1>
            <p className="text-gray-600 mb-2">
                Are you sure you want to unsubscribe?
            </p>
            <p className="text-sm text-gray-500 mb-6">
                <span className="font-medium">{decodeURIComponent(email)}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
                You will no longer receive promotional emails, newsletters, and updates from Chouhan Rugs.
            </p>
            <div className="space-y-3">
                <button 
                    onClick={handleUnsubscribe}
                    disabled={status === 'loading'}
                    className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="loading loading-spinner loading-sm"></span>
                            Processing...
                        </span>
                    ) : (
                        'Yes, Unsubscribe Me'
                    )}
                </button>
                <Link 
                    href="/"
                    className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    No, Keep Me Subscribed
                </Link>
            </div>
        </div>
    )
}
