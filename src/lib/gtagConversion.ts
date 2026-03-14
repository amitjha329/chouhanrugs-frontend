import GoogleAdsConfigDataModel from '@/types/GoogleAdsConfigDataModel'

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
    }
}

function fireConversion(conversionId: string, label: string, params?: Record<string, any>) {
    if (typeof window === 'undefined' || !window.gtag || !conversionId || !label) return
    window.gtag('event', 'conversion', {
        'send_to': `${conversionId}/${label}`,
        ...params
    })
}

export function trackSignup(config: GoogleAdsConfigDataModel | null) {
    if (!config) return
    fireConversion(config.code, config.conversionLabels.signup)
}

export function trackAddToCart(config: GoogleAdsConfigDataModel | null) {
    if (!config) return
    fireConversion(config.code, config.conversionLabels.addToCart)
}

export function trackEmailLead(config: GoogleAdsConfigDataModel | null) {
    if (!config) return
    fireConversion(config.code, config.conversionLabels.emailLead)
}

export function trackPurchase(config: GoogleAdsConfigDataModel | null, value?: number, currency?: string, transactionId?: string) {
    if (!config) return
    const params: Record<string, any> = {}
    if (value != null) params['value'] = value
    if (currency) params['currency'] = currency
    if (transactionId) params['transaction_id'] = transactionId
    fireConversion(config.code, config.conversionLabels.purchase, params)
}

export function trackWhatsAppLead(config: GoogleAdsConfigDataModel | null) {
    if (!config) return
    fireConversion(config.code, config.conversionLabels.whatsappLead)
}
