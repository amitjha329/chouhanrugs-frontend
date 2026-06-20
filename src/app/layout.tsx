import React, { ReactNode, Suspense } from 'react'
import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import { Metadata, Viewport } from 'next'
import FloatingButtonChat from '@/ui/HomePage/FlotingButtonChat'
import getSiteData from '@/backend/serverActions/getSiteData'
import getAnalyticsData from '@/backend/serverActions/getAnalyticsData'
import getGoogleAdsConfig from '@/backend/serverActions/getGoogleAdsConfig'
import GlobalPopupWrapper from '@/ui/GlobalPopup/GlobalPopupWrapper'
import PurchaseNotification from '@/ui/PurchaseNotification'
import GoogleAdsProvider from '@/components/GoogleAdsProvider'
import RecentlyViewedSidebar from '@/ui/RecentlyViewed'
import { getNewProducts } from '@/backend/serverActions/getNewProducts'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { getProductFeaturedImage } from '@/lib/getProductFeaturedImage'
import { routing, type Locale } from '@/i18n/routing'
import { getTranslations as getStorefrontTranslations } from '@/backend/serverActions/getTranslations'
import { cacheLife, cacheTag } from 'next/cache'
import CookieConsentProvider from '@/components/CookieConsentProvider'
import ConsentManagedScripts from '@/components/ConsentManagedScripts'
import NextTopLoader from 'nextjs-toploader'

// Optimized font loading: Only load weights actually used in the app
// Removed: 100, 200, 300, 800, 900 (rarely used)
// display: 'swap' prevents FOIT (Flash of Invisible Text)
const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
    variable: "--font-poppins"
})
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0
}

export const metadata: Metadata = {

}

const RootEnhancements = async ({ googleAdsConfig }: { googleAdsConfig: Awaited<ReturnType<typeof getGoogleAdsConfig>> }) => {
    "use cache"

    cacheLife("hours")
    cacheTag("root-enhancements")

    const locale = routing.defaultLocale as Locale
    const [siteData, googleTagData, notifProducts, messages] = await Promise.all([getSiteData(), getAnalyticsData("GTM"), getNewProducts({ limit: 15 }), getStorefrontTranslations(locale)])
    const notificationMessages = (messages.notification ?? {}) as Record<string, string | ((values?: Record<string, unknown>) => string)>
    const t = (key: string, values?: Record<string, unknown>) => {
        const value = notificationMessages[key]
        if (typeof value === 'function') return value(values)
        if (typeof value !== 'string') return key
        if (!values) return value

        const withPlurals = value.replace(
            /\{(\w+),\s*plural,\s*one\s*\{([^{}]*)\}\s*other\s*\{([^{}]*)\}\s*\}/g,
            (_match, name: string, one: string, other: string) => {
                const rawCount = values[name]
                const count = typeof rawCount === 'number' ? rawCount : Number(rawCount)
                const template = count === 1 ? one : other
                return template.replace(/#/g, Number.isFinite(count) ? String(count) : String(rawCount ?? ''))
            }
        )

        return Object.entries(values).reduce((text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)), withPlurals)
    }
    const purchaseProducts = notifProducts
        .map(p => {
            const name = resolveLocalizedString(p.productName, locale) || resolveLocalizedString(p.productTitle, locale)
            const slug = resolveLocalizedString(p.productURL, locale)

            return {
                name,
                url: slug ? `/products/${slug}` : '',
                image: getProductFeaturedImage(p),
            }
        })
        .filter(product => product.name && product.url)
    const MINUTE_OPTIONS = [1, 2, 3, 5, 8, 12, 15, 20, 25, 32, 45]
    const HOUR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    const DAY_OPTIONS = [2, 3, 4, 5, 6]
    const notificationTranslations = {
        timeAgoOptions: [
            t('justNow'),
            ...MINUTE_OPTIONS.map(n => t('minutesAgo', { count: n })),
            ...HOUR_OPTIONS.map(n => t('hoursAgo', { count: n })),
            ...DAY_OPTIONS.map(n => t('daysAgo', { count: n })),
            t('weeksAgo', { count: 1 })
        ],
        from: t('from'),
        purchased: t('purchased'),
        dismiss: t('dismiss'),
        verifiedPurchase: t('verifiedPurchase'),
    }
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'Chouhan Rugs',
                        url: siteData?.url,
                        logo: siteData?.logoSrc,
                        contactPoint: [{
                            '@type': 'ContactPoint',
                            telephone: siteData?.contact_details?.phone,
                            contactType: 'customer service',
                            email: siteData?.contact_details?.email
                        }]
                    })
                }}
                key="org-jsonld"
            />
            <ConsentManagedScripts gtmId={googleTagData.code} googleAdsConfig={googleAdsConfig} />
            <FloatingButtonChat siteData={siteData} />
            <RecentlyViewedSidebar />
            <PurchaseNotification products={purchaseProducts} translations={notificationTranslations} />
        </>
    )
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const googleAdsConfig = await getGoogleAdsConfig()

    return (
        <html lang={routing.defaultLocale} dir={routing.defaultLocale === 'ar' ? 'rtl' : 'ltr'}>
            <head>
                {/* Preconnect to critical third-party origins for faster resource loading */}
                <link rel="preconnect" href="https://cdn.chouhanrugs.com" />
                <link rel="dns-prefetch" href="https://cdn.chouhanrugs.com" />
                <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
                <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
            </head>
            <body className={clsx(poppins.className, poppins.variable)}>
                <NextTopLoader color="#6c4624" showSpinner={false} />
                <CookieConsentProvider>
                    <GoogleAdsProvider config={googleAdsConfig}>
                        <div id="notification-container" className="notification-box flex flex-col items-center justify-start fixed w-screen h-screen z-[9999] p-3 pt-24 pointer-events-none" />
                        {children}
                        <Suspense fallback={null}>
                            <RootEnhancements googleAdsConfig={googleAdsConfig} />
                        </Suspense>
                        {/* GlobalPopupWrapper checks request headers, so it must stay outside the cached shell. */}
                        <Suspense fallback={null}>
                            <GlobalPopupWrapper />
                        </Suspense>
                    </GoogleAdsProvider>
                </CookieConsentProvider>
            </body>
        </html>
    )
}

export default RootLayout
