import GoogleAdsConfigDataModel from '@/types/GoogleAdsConfigDataModel'
import { ProductDataModel } from '@/types/ProductDataModel'

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
        dataLayer?: any[]
    }
}

type AnalyticsItem = {
    item_id?: string
    item_name?: string
    item_category?: string
    item_brand?: string
    item_variant?: string
    price?: number
    quantity?: number
}

type AddToCartPayload = {
    product?: ProductDataModel
    variationCode?: string
    quantity?: number
    currency?: string
    value?: number
}

type PurchasePayload = {
    transactionId?: string
    value?: number
    currency?: string
    items?: AnalyticsItem[]
}

function dispatchEvent(name: string, params?: Record<string, any>) {
    if (typeof window === 'undefined') return
    try {
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, params ?? {})
            return
        }
    } catch {
        // Fallback to dataLayer when gtag execution fails.
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
        event: name,
        ...(params ?? {}),
    })
}

function fireConversion(conversionId?: string, label?: string, params?: Record<string, any>) {
    if (!conversionId || !label) return
    dispatchEvent('conversion', {
        send_to: `${conversionId}/${label}`,
        ...params,
    })
}

function getVariationUnitPrice(product: ProductDataModel, variationCode?: string): number {
    if (!variationCode || variationCode === 'customSize') {
        return Number(product.productSellingPrice ?? 0)
    }

    const variation = product.variations?.find((v) => v.variationCode === variationCode)
    if (!variation) {
        return Number(product.productSellingPrice ?? 0)
    }

    const price = Number(variation.variationPrice ?? 0)
    const discount = Number(variation.variationDiscount ?? 0)
    return Number((price - (price * discount) / 100).toFixed(2))
}

function buildAddToCartItem(product: ProductDataModel, variationCode?: string, quantity = 1): AnalyticsItem {
    return {
        item_id: String(product._id ?? product.objectID ?? ''),
        item_name: product.productName,
        item_category: product.productCategory,
        item_brand: product.productBrand,
        item_variant: variationCode,
        price: getVariationUnitPrice(product, variationCode),
        quantity,
    }
}

export function trackSignup(config: GoogleAdsConfigDataModel | null) {
    if (!config) return
    fireConversion(config.code, config.conversionLabels.signup)
}

export function trackAddToCart(config: GoogleAdsConfigDataModel | null) {
    trackAddToCartWithDetails(config)
}

export function trackAddToCartWithDetails(config: GoogleAdsConfigDataModel | null, payload?: AddToCartPayload) {
    if (!config) return

    const currency = payload?.currency || 'USD'
    const quantity = payload?.quantity ?? 1
    const item = payload?.product ? buildAddToCartItem(payload.product, payload.variationCode, quantity) : undefined
    const value =
        typeof payload?.value === 'number'
            ? payload.value
            : item?.price != null
                ? Number((item.price * quantity).toFixed(2))
                : 0

    fireConversion(config.code, config.conversionLabels.addToCart, {
        value,
        currency,
    })

    dispatchEvent('add_to_cart', {
        currency,
        value,
        ...(item ? { items: [item] } : {}),
    })
}

export function trackEmailLead(config: GoogleAdsConfigDataModel | null) {
    if (!config) return
    fireConversion(config.code, config.conversionLabels.emailLead)
}

type EmailLeadPayload = {
    email?: string
    source?: 'popup' | 'footer' | 'other'
}

export function trackEmailLeadOnce(config: GoogleAdsConfigDataModel | null, payload?: EmailLeadPayload) {
    if (!config) return

    const normalizedEmail = (payload?.email || '').trim().toLowerCase()
    const source = payload?.source || 'other'

    if (typeof window !== 'undefined' && normalizedEmail) {
        const dedupeKey = `cr_email_lead:${source}:${normalizedEmail}`
        if (window.sessionStorage?.getItem(dedupeKey) === '1') return
        fireConversion(config.code, config.conversionLabels.emailLead)
        window.sessionStorage?.setItem(dedupeKey, '1')
        return
    }

    fireConversion(config.code, config.conversionLabels.emailLead)
}

export function trackPurchase(
    config: GoogleAdsConfigDataModel | null,
    valueOrPayload?: number | PurchasePayload,
    currency?: string,
    transactionId?: string
) {
    if (!config) return

    const payload: PurchasePayload =
        typeof valueOrPayload === 'object' && valueOrPayload !== null
            ? valueOrPayload
            : {
                value: valueOrPayload,
                currency,
                transactionId,
            }

    const conversionParams: Record<string, any> = {}
    if (payload.value != null) conversionParams.value = payload.value
    if (payload.currency) conversionParams.currency = payload.currency
    if (payload.transactionId) conversionParams.transaction_id = payload.transactionId

    fireConversion(config.code, config.conversionLabels.purchase, conversionParams)

    dispatchEvent('purchase', {
        transaction_id: payload.transactionId,
        value: payload.value,
        currency: payload.currency,
        items: payload.items ?? [],
    })
}

export function trackWhatsAppLead(config: GoogleAdsConfigDataModel | null) {
    if (!config) return
    fireConversion(config.code, config.conversionLabels.whatsappLead)
}
