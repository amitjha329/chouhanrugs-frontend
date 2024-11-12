import React, { ReactNode } from 'react'
import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NextTopLoader from 'nextjs-toploader'
import { Metadata, Viewport } from 'next'
import FloatingButtonChat from '@/ui/HomePage/FlotingButtonChat'
import getSiteData from '@/backend/serverActions/getSiteData'

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
    const siteData = await getSiteData()
    return (
        <html>
            <body className={clsx(poppins.className)}>
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