'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PopUpDataModel from '@/types/PopUpDataModel'
import { IoMdClose } from 'react-icons/io'
import submitCustomSizeRequest from '@/backend/serverActions/submitCustomSizeRequest'

type ActiveForm = 'none' | 'subscribe' | 'customSize'

const GlobalPopup = ({ popupData }: { popupData: PopUpDataModel }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [activeForm, setActiveForm] = useState<ActiveForm>('none')
    
    // Subscribe form state
    const [email, setEmail] = useState('')
    const [isSubscribing, setIsSubscribing] = useState(false)
    const [subscriptionMessage, setSubscriptionMessage] = useState('')
    
    // Custom size request form state
    const [customSizeData, setCustomSizeData] = useState({
        email: '',
        mobile: '',
        requirements: ''
    })
    const [isSubmittingCustomSize, setIsSubmittingCustomSize] = useState(false)
    const [customSizeMessage, setCustomSizeMessage] = useState('')
    const [customSizeErrors, setCustomSizeErrors] = useState<{
        email?: string
        mobile?: string
    }>({})

    useEffect(() => {
        // Check if user has permanently disabled the popup
        const userDisabledPopup = localStorage.getItem('chouhanrugs_popup_disabled') === 'true'
        if (userDisabledPopup) {
            return
        }

        const isPersistent = popupData.data.isPersistent || false

        if (isPersistent) {
            // Persistent mode: Show on every visit
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 2000)
            return () => clearTimeout(timer)
        } else {
            // Standard mode: Show once per session
            const popupShown = sessionStorage.getItem('chouhanrugs_popup_shown') === 'true'
            
            if (!popupShown) {
                const timer = setTimeout(() => {
                    setIsVisible(true)
                }, 2000)
                return () => clearTimeout(timer)
            }
        }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        
        // Only track closure if not persistent
        if (!popupData.data.isPersistent) {
            sessionStorage.setItem('chouhanrugs_popup_shown', 'true')
        }
    }

    const handleNeverShowAgain = () => {
        // User explicitly doesn't want to see popup anymore
        localStorage.setItem('chouhanrugs_popup_disabled', 'true')
        setIsVisible(false)
    }

    const validateCustomSizeForm = () => {
        const errors: { email?: string; mobile?: string } = {}
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!customSizeData.email || !emailRegex.test(customSizeData.email)) {
            errors.email = "Please enter a valid email address"
        }
        
        // Mobile validation - flexible format
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
        const cleanMobile = customSizeData.mobile.replace(/\s/g, '')
        if (!customSizeData.mobile || !phoneRegex.test(cleanMobile)) {
            errors.mobile = "Please enter a valid mobile number"
        }
        
        setCustomSizeErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleCustomSizeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setCustomSizeData(prev => ({ ...prev, [name]: value }))
        // Clear error for this field when user types
        if (customSizeErrors[name as keyof typeof customSizeErrors]) {
            setCustomSizeErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleCustomSizeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateCustomSizeForm()) {
            return
        }
        
        setIsSubmittingCustomSize(true)
        setCustomSizeMessage('')

        try {
            const result = await submitCustomSizeRequest(customSizeData)
            
            if (result.ack) {
                setCustomSizeMessage(result.result.message)
                setCustomSizeData({ email: '', mobile: '', requirements: '' })
                
                // Close popup after successful submission
                setTimeout(() => {
                    handleClose()
                }, 3000)
            } else {
                setCustomSizeMessage(result.result.message)
            }
        } catch (error) {
            setCustomSizeMessage('Something went wrong. Please try again.')
        } finally {
            setIsSubmittingCustomSize(false)
        }
    }

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubscribing(true)
        setSubscriptionMessage('')

        try {
            // Add your subscription API call here
            // Example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setSubscriptionMessage('Thank you for subscribing!')
            setEmail('')
            
            // Close popup after successful subscription
            setTimeout(() => {
                handleClose()
            }, 2000)
        } catch (error) {
            setSubscriptionMessage('Something went wrong. Please try again.')
        } finally {
            setIsSubscribing(false)
        }
    }

    if (!isVisible) return null

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />
            
            {/* Popup Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden pointer-events-auto transform transition-all duration-300 animate-[scale-in_0.3s_ease-out]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                        aria-label="Close popup"
                    >
                        <IoMdClose className="w-6 h-6 text-gray-700" />
                    </button>

                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[400px] bg-gradient-to-br from-primary/10 to-secondary/10">
                            <Image
                                src={popupData.data.image}
                                alt={popupData.data.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                                {popupData.data.title}
                            </h2>
                            
                            <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                                {popupData.data.description}
                            </p>

                            {/* Form Selection - Show only if both are enabled */}
                            {popupData.data.isSubscribeEnabled && popupData.data.isCustomSizeRequestEnabled && activeForm === 'none' && (
                                <div className="flex flex-col gap-3 mb-6 animate-[fadeIn_0.3s_ease-in]">
                                    <button
                                        onClick={() => setActiveForm('subscribe')}
                                        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                                    >
                                        Subscribe to Newsletter
                                    </button>
                                    <button
                                        onClick={() => setActiveForm('customSize')}
                                        className="px-6 py-3 bg-secondary font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                                    >
                                        Request Custom Size
                                    </button>
                                </div>
                            )}

                            {/* Subscribe Form */}
                            {popupData.data.isSubscribeEnabled && (activeForm === 'subscribe' || (!popupData.data.isCustomSizeRequestEnabled && activeForm === 'none')) && (
                                <form onSubmit={handleSubscribe} className="mb-6 animate-[slideIn_0.3s_ease-out]">
                                    {popupData.data.isCustomSizeRequestEnabled && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveForm('none')}
                                            className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1 transition-colors"
                                        >
                                            ← Back
                                        </button>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            disabled={isSubscribing}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubscribing}
                                            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                                        </button>
                                    </div>
                                    {subscriptionMessage && (
                                        <p className={`mt-2 text-sm ${subscriptionMessage.includes('Thank') ? 'text-green-600' : 'text-red-600'}`}>
                                            {subscriptionMessage}
                                        </p>
                                    )}
                                </form>
                            )}

                            {/* Custom Size Request Form */}
                            {popupData.data.isCustomSizeRequestEnabled && (activeForm === 'customSize' || (!popupData.data.isSubscribeEnabled && activeForm === 'none')) && (
                                <div className="custom-size-request-section bg-gray-50 p-6 rounded-lg mb-6 animate-[slideIn_0.3s_ease-out]">
                                    {popupData.data.isSubscribeEnabled && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveForm('none')}
                                            className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1 transition-colors"
                                        >
                                            ← Back
                                        </button>
                                    )}
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Request Custom Size</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Need a custom size? Fill in your details and we&apos;ll contact you.
                                    </p>
                                    
                                    <form onSubmit={handleCustomSizeSubmit}>
                                        <div className="form-group mb-4">
                                            <label htmlFor="customEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="customEmail"
                                                name="email"
                                                required
                                                placeholder="your@email.com"
                                                value={customSizeData.email}
                                                onChange={handleCustomSizeInputChange}
                                                disabled={isSubmittingCustomSize}
                                                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                                                    customSizeErrors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {customSizeErrors.email && (
                                                <p className="mt-1 text-xs text-red-600">{customSizeErrors.email}</p>
                                            )}
                                        </div>

                                        <div className="form-group mb-4">
                                            <label htmlFor="customMobile" className="block text-sm font-medium text-gray-700 mb-1">
                                                Mobile Number *
                                            </label>
                                            <input
                                                type="tel"
                                                id="customMobile"
                                                name="mobile"
                                                required
                                                placeholder="+1 (555) 123-4567"
                                                value={customSizeData.mobile}
                                                onChange={handleCustomSizeInputChange}
                                                disabled={isSubmittingCustomSize}
                                                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                                                    customSizeErrors.mobile ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {customSizeErrors.mobile && (
                                                <p className="mt-1 text-xs text-red-600">{customSizeErrors.mobile}</p>
                                            )}
                                        </div>

                                        <div className="form-group mb-4">
                                            <label htmlFor="customRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                                                Size Requirements (Optional)
                                            </label>
                                            <textarea
                                                id="customRequirements"
                                                name="requirements"
                                                placeholder="e.g., 8x10 feet, Round shape, etc."
                                                maxLength={500}
                                                rows={3}
                                                value={customSizeData.requirements}
                                                onChange={handleCustomSizeInputChange}
                                                disabled={isSubmittingCustomSize}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                                            />
                                            <p className="mt-1 text-xs text-gray-500 text-right">
                                                {customSizeData.requirements.length}/500
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmittingCustomSize}
                                            className="w-full px-6 py-3 bg-secondary font-semibold rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmittingCustomSize ? 'Submitting...' : 'Submit Request'}
                                        </button>

                                        {customSizeMessage && (
                                            <p className={`mt-3 text-sm text-center ${customSizeMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                                {customSizeMessage}
                                            </p>
                                        )}
                                    </form>
                                </div>
                            )}

                            {/* CTA Button - Only show if no forms are enabled */}
                            {popupData.data.button.url && popupData.data.button.text && 
                             !popupData.data.isSubscribeEnabled && 
                             !popupData.data.isCustomSizeRequestEnabled && (
                                <Link
                                    href={popupData.data.button.url}
                                    onClick={handleClose}
                                    className="inline-block text-center px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                                >
                                    {popupData.data.button.text}
                                </Link>
                            )}

                            {/* Don't show again option for persistent popups */}
                            {popupData.data.isPersistent && (
                                <div className="mt-4 text-center animate-[fadeIn_0.3s_ease-in]">
                                    <button
                                        onClick={handleNeverShowAgain}
                                        className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
                                    >
                                        Don&apos;t show this again
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                
                @keyframes slideIn {
                    0% {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    )
}

export default GlobalPopup
