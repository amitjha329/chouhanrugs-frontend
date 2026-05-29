'use client'
import React, { createContext, useContext, ReactNode } from 'react'
import GoogleAdsConfigDataModel from '@/types/GoogleAdsConfigDataModel'
import { useCookieConsent } from '@/components/CookieConsentProvider'

const GoogleAdsContext = createContext<GoogleAdsConfigDataModel | null>(null)

export function useGoogleAdsConfig() {
    return useContext(GoogleAdsContext)
}

export default function GoogleAdsProvider({ config, children }: { config: GoogleAdsConfigDataModel; children?: ReactNode }) {
    const { isLoaded, preferences } = useCookieConsent()
    const enabledConfig = isLoaded && preferences.marketing ? config : null

    return (
        <GoogleAdsContext.Provider value={enabledConfig}>
            {children}
        </GoogleAdsContext.Provider>
    )
}
