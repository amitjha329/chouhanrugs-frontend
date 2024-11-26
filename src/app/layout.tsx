import React, { ReactNode } from 'react'
import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NextTopLoader from 'nextjs-toploader'
import { Metadata, Viewport } from 'next'
import FloatingButtonChat from '@/ui/HomePage/FlotingButtonChat'
import getSiteData from '@/backend/serverActions/getSiteData'
import getAnalyticsData from '@/backend/serverActions/getAnalyticsData'

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"]
})
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0
}

export const metadata: Metadata = {

}

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const [siteData, googleTagData] = await Promise.all([getSiteData(), getAnalyticsData("GTM")])
    return (
        <html>
            <head>
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagData.code}`}></script>

                <script dangerouslySetInnerHTML={{
                    __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${googleTagData.code}');`
                }}>
                </script>
            </head>
            <body className={clsx(poppins.className)}>
                <div className='btn-disabled'></div>
                <NextTopLoader
                    color='#6c4624'
                    zIndex={1600} />
                {children}
                <FloatingButtonChat siteData={siteData} />
            </body>
        </html>
    )
}

export default RootLayout