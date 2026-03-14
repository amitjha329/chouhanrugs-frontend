'use client'
import React, { createContext, useContext, ReactNode } from 'react'
import GoogleAdsConfigDataModel from '@/types/GoogleAdsConfigDataModel'

const GoogleAdsContext = createContext<GoogleAdsConfigDataModel | null>(null)

export function useGoogleAdsConfig() {
    return useContext(GoogleAdsContext)
}

export default function GoogleAdsProvider({ config, children }: { config: GoogleAdsConfigDataModel; children?: ReactNode }) {
    return (
        <GoogleAdsContext.Provider value={config}>
            {children}
        </GoogleAdsContext.Provider>
    )
}
