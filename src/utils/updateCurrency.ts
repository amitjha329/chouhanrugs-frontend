'use client'
import Currency from '@/types/Currency'

export const storeSelectedCurrency = (currency: Currency) => {
    document.cookie = `selectedCurrency=${JSON.stringify(currency)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure`
    window.location.reload()
    return undefined
}
