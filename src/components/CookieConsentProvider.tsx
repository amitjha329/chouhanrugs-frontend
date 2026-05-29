'use client'

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
    ACCEPT_ALL_COOKIE_CONSENT,
    CookieConsentPreferences,
    DEFAULT_COOKIE_CONSENT,
    readCookieConsent,
    writeCookieConsent,
} from '@/lib/cookieConsent'

type CookieConsentContextValue = {
    isLoaded: boolean
    hasSavedChoice: boolean
    preferences: CookieConsentPreferences
    acceptAll: () => void
    rejectAll: () => void
    savePreferences: (preferences: CookieConsentPreferences) => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

export function useCookieConsent() {
    const context = useContext(CookieConsentContext)
    if (!context) {
        throw new Error('useCookieConsent must be used inside CookieConsentProvider')
    }
    return context
}

export default function CookieConsentProvider({ children }: { children: ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasSavedChoice, setHasSavedChoice] = useState(false)
    const [preferences, setPreferences] = useState<CookieConsentPreferences>(DEFAULT_COOKIE_CONSENT)
    const [showCustomize, setShowCustomize] = useState(false)
    const [draftPreferences, setDraftPreferences] = useState<CookieConsentPreferences>(DEFAULT_COOKIE_CONSENT)

    useEffect(() => {
        const stored = readCookieConsent()
        if (stored) {
            setPreferences(stored.preferences)
            setDraftPreferences(stored.preferences)
            setHasSavedChoice(true)
        }
        setIsLoaded(true)
    }, [])

    const savePreferences = useCallback((nextPreferences: CookieConsentPreferences) => {
        const normalized = {
            necessary: true as const,
            analytics: nextPreferences.analytics === true,
            marketing: nextPreferences.marketing === true,
        }

        writeCookieConsent(normalized)
        setPreferences(normalized)
        setDraftPreferences(normalized)
        setHasSavedChoice(true)
        setShowCustomize(false)
    }, [])

    const value = useMemo<CookieConsentContextValue>(() => ({
        isLoaded,
        hasSavedChoice,
        preferences,
        acceptAll: () => savePreferences(ACCEPT_ALL_COOKIE_CONSENT),
        rejectAll: () => savePreferences(DEFAULT_COOKIE_CONSENT),
        savePreferences,
    }), [hasSavedChoice, isLoaded, preferences, savePreferences])

    const showBanner = isLoaded && !hasSavedChoice

    return (
        <CookieConsentContext.Provider value={value}>
            {children}
            {showBanner ? (
                <div className="fixed inset-x-0 bottom-0 z-[10000] border-t border-[#e6d8ca] bg-white px-4 py-4 shadow-[0_-12px_36px_rgba(35,24,20,0.14)] sm:px-6">
                    <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl">
                            <h2 className="text-sm font-semibold text-[#231814] sm:text-base">Cookie preferences</h2>
                            <p className="mt-1 text-xs leading-5 text-[#6f6258] sm:text-sm">
                                We use necessary cookies to run the store. Analytics and marketing cookies are optional and stay off unless you allow them.
                                Read our <Link href="/policies" className="font-medium text-[#6c4624] underline underline-offset-2">Privacy Policy</Link> and <Link href="/terms" className="font-medium text-[#6c4624] underline underline-offset-2">Terms</Link>.
                            </p>

                            {showCustomize ? (
                                <div className="mt-3 grid gap-2 text-xs text-[#4f443d] sm:grid-cols-3">
                                    <label className="flex items-center justify-between gap-3 rounded-lg border border-[#eadfd5] bg-[#fbf8f4] px-3 py-2">
                                        <span>
                                            <span className="block font-semibold">Necessary</span>
                                            <span className="text-[#7b6d63]">Required for checkout and security.</span>
                                        </span>
                                        <input type="checkbox" checked disabled className="toggle toggle-sm" />
                                    </label>
                                    <label className="flex items-center justify-between gap-3 rounded-lg border border-[#eadfd5] bg-[#fbf8f4] px-3 py-2">
                                        <span>
                                            <span className="block font-semibold">Analytics</span>
                                            <span className="text-[#7b6d63]">Helps us understand site usage.</span>
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={draftPreferences.analytics}
                                            onChange={(event) => setDraftPreferences(prev => ({ ...prev, analytics: event.target.checked }))}
                                            className="toggle toggle-sm"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between gap-3 rounded-lg border border-[#eadfd5] bg-[#fbf8f4] px-3 py-2">
                                        <span>
                                            <span className="block font-semibold">Marketing</span>
                                            <span className="text-[#7b6d63]">Enables ads and conversion tracking.</span>
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={draftPreferences.marketing}
                                            onChange={(event) => setDraftPreferences(prev => ({ ...prev, marketing: event.target.checked }))}
                                            className="toggle toggle-sm"
                                        />
                                    </label>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {showCustomize ? (
                                <button
                                    type="button"
                                    className="btn btn-sm rounded-full border-[#cdb9a7] bg-white px-4 text-[#4f3523] hover:border-[#6c4624] hover:bg-[#f8f1ea]"
                                    onClick={() => value.savePreferences(draftPreferences)}
                                >
                                    Save choices
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-sm rounded-full border-[#cdb9a7] bg-white px-4 text-[#4f3523] hover:border-[#6c4624] hover:bg-[#f8f1ea]"
                                    onClick={() => setShowCustomize(true)}
                                >
                                    Customize
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-sm rounded-full border-[#cdb9a7] bg-white px-4 text-[#4f3523] hover:border-[#6c4624] hover:bg-[#f8f1ea]"
                                onClick={value.rejectAll}
                            >
                                Reject optional
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm rounded-full border-none btn-primary"
                                onClick={value.acceptAll}
                            >
                                Accept all
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </CookieConsentContext.Provider>
    )
}
