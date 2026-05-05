import React, { ReactNode, Suspense } from 'react'
import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NextTopLoader from 'nextjs-toploader'
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
import Script from 'next/script'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { routing, type Locale } from '@/i18n/routing'
import { getTranslations as getStorefrontTranslations } from '@/backend/serverActions/getTranslations'
import { cacheLife, cacheTag } from 'next/cache'

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

const RootEnhancements = async ({ children }: { children: ReactNode }) => {
    "use cache"

    cacheLife("seconds")
    cacheTag("root-enhancements")

    const locale = routing.defaultLocale as Locale
    const [siteData, googleTagData, googleAdsConfig, notifProducts, messages] = await Promise.all([getSiteData(), getAnalyticsData("GTM"), getGoogleAdsConfig(), getNewProducts({ limit: 15 }), getStorefrontTranslations(locale)])
    const notificationMessages = (messages.notification ?? {}) as Record<string, string | ((values?: Record<string, unknown>) => string)>
    const t = (key: string, values?: Record<string, unknown>) => {
        const value = notificationMessages[key]
        if (typeof value === 'function') return value(values)
        if (typeof value !== 'string') return key
        if (!values) return value
        return Object.entries(values).reduce((text, [name, replacement]) => text.replace(`{${name}}`, String(replacement)), value)
    }
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    const purchaseProducts = notifProducts.map(p => ({
        name: resolveLocalizedString(p.productName, locale),
        url: `/products/${resolveLocalizedString(p.productURL, locale)}`,
        image: p.images?.[p.productPrimaryImageIndex] ?? p.images?.[0] ?? "",
    }))
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
                {/* GTM uses lazyOnload to minimize main thread blocking during page load */}
                <Script
                    id="gtm-script"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleTagData.code}');`
                    }}
                />
                <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${googleTagData.code}`}
                    height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
                {/* Google Ads gtag.js - loaded alongside GTM for conversion tracking */}
                {googleAdsConfig.gtagId && (
                    <>
                        <Script
                            id="gtag-js"
                            strategy="afterInteractive"
                            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsConfig.gtagId}`}
                        />
                        <Script
                            id="gtag-init"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                                    gtag('js', new Date());
                                    gtag('config', '${googleAdsConfig.gtagId}');
                                    ${googleAdsConfig.code ? `gtag('config', '${googleAdsConfig.code}');` : ''}
                                `
                            }}
                        />
                    </>
                )}
                <GoogleAdsProvider config={googleAdsConfig}>
                <div id="notification-container" className="notification-box flex flex-col items-center justify-start fixed w-screen h-screen z-[9999] p-3 pt-24 pointer-events-none" />
                <NextTopLoader
                    color='#6c4624'
                    zIndex={1600} />
                {children}
                <FloatingButtonChat siteData={siteData} />
                <RecentlyViewedSidebar />
                <PurchaseNotification products={purchaseProducts} translations={notificationTranslations} />
                </GoogleAdsProvider>
        </>
    )
}

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang={routing.defaultLocale} dir="ltr">
            <head>
                {/* Preconnect to critical third-party origins for faster resource loading */}
                <link rel="preconnect" href="https://cdn.chouhanrugs.com" />
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://www.google-analytics.com" />
                <link rel="preconnect" href="https://www.googleadservices.com" />
                <link rel="dns-prefetch" href="https://cdn.chouhanrugs.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />
                <link rel="dns-prefetch" href="https://www.googleadservices.com" />
            </head>
            <body className={clsx(poppins.className, poppins.variable)}>
                <Suspense fallback={null}>
                    <RootEnhancements>{children}</RootEnhancements>
                </Suspense>
                {/* GlobalPopupWrapper checks request headers, so it must stay outside the cached shell. */}
                <Suspense fallback={null}>
                    <GlobalPopupWrapper />
                </Suspense>
            </body>
        </html>
    )
}

export default RootLayout
