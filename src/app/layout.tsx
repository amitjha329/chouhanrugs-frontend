import React, { ReactNode } from 'react'
import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NextTopLoader from 'nextjs-toploader'
import { Metadata, Viewport } from 'next'
import FloatingButtonChat from '@/ui/HomePage/FlotingButtonChat'
import getSiteData from '@/backend/serverActions/getSiteData'
import getAnalyticsData from '@/backend/serverActions/getAnalyticsData'
import GlobalPopupWrapper from '@/ui/GlobalPopup/GlobalPopupWrapper'
import { headers } from 'next/headers'
import Script from 'next/script'

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

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const isAuthPage = pathname === '/signin' || pathname === '/login'
    
    const [siteData, googleTagData] = await Promise.all([getSiteData(), getAnalyticsData("GTM")])
    return (
        <html>
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
            </head>
            <body className={clsx(poppins.className, poppins.variable)}>
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
                <div id="notification-container" className="notification-box flex flex-col items-center justify-start fixed w-screen h-screen z-[9999] p-3 pt-24 pointer-events-none" />
                <NextTopLoader
                    color='#6c4624'
                    zIndex={1600} />
                {children}
                <FloatingButtonChat siteData={siteData} />
                {!isAuthPage && <GlobalPopupWrapper />}
            </body>
        </html>
    )
}

export default RootLayout