'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useCurrencyContext } from './CurrencyContext'
import LocationResponse from '@/lib/types/LocationResponse'

const LocationContext = createContext<Partial<{ userLocation: Partial<LocationResponse> }>>({})

const LocationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [userLocation, setUserLocation] = useState<Partial<LocationResponse>>({})
    const { currencies, setUserCurrency, manualCurrency } = useCurrencyContext()

    useEffect(() => {
        fetch("https://ipapi.co/json/").then(async (response) => {
            if (response.status == 200) {
                setUserLocation(await response.json())
            } else {
                console.log(response)
            }
        })
    }, [])

    useEffect(() => {
        const ipBasedCurrency = currencies?.find(curr => curr.currency == userLocation.currency)
        console.log(userLocation)
        console.log(currencies)
        if (!manualCurrency && ipBasedCurrency != null) {
            setUserCurrency && setUserCurrency(ipBasedCurrency)
        }
    }, [manualCurrency, userLocation, currencies])

    const value = useMemo(() => ({
        userLocation
    }), [userLocation])

    return <LocationContext.Provider value={value}>
        {children}
    </LocationContext.Provider>
}

export const useLocationContext = () => {
    return useContext(LocationContext)
}

export default LocationContextProvider