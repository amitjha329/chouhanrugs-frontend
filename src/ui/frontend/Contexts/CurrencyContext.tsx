'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorage from '@/lib/customHooks/useLocalStorage'
import Currency from '@/lib/types/Currency'
import axiosInstance from '@/lib/utilities/axiosInastances'

const CurrencyContext = createContext<Partial<{ currencies: Array<Currency>, defaultCurrency: Partial<Currency>, userCurrency: Partial<Currency>, setUserCurrency: (newValue: Partial<Currency>) => void, manualCurrency: boolean, setManualCurrency: (newValue: boolean) => void }>>({})

const CurrencyContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currencies, setCurrencies] = useState<Array<Currency>>([])
    const [defaultCurrency, setDefaultCurrency] = useLocalStorage<Partial<Currency>>("defaultCurrency", {
        _id: "kjdfg89dfg",
        country: "United States",
        ISO: "US",
        currency: "USD",
        currencySymbol: "$",
        exchangeRates: 1,
        active: true,
        default: true
    })
    const [userCurrency, setUserCurrency] = useLocalStorage<Partial<Currency>>("userCurrency", {
        _id: "kjdfg89dfg",
        country: "United States",
        ISO: "US",
        currency: "USD",
        currencySymbol: "$",
        exchangeRates: 1,
        active: true,
        default: true
    })
    const [manualCurrency, setManualCurrency] = useLocalStorage<boolean>("manualCurrency", false)

    useEffect(() => {
        axiosInstance().get('/api/currencies').then((response) => {
            setCurrencies(response.data)
            console.log(response.data)
            setDefaultCurrency(response.data.filter((currency: Currency) => currency.default)[0])
            if (!userCurrency.currency) {
                setUserCurrency(defaultCurrency)
            }
        })
    }, [])

    const value = useMemo(() => ({
        currencies, defaultCurrency, userCurrency, setUserCurrency, manualCurrency, setManualCurrency
    }), [currencies, defaultCurrency, manualCurrency, setManualCurrency, setUserCurrency, userCurrency])

    return <CurrencyContext.Provider value={value}>
        {children}
    </CurrencyContext.Provider>
}

export const useCurrencyContext = () => {
    return useContext(CurrencyContext)
}

export default CurrencyContextProvider