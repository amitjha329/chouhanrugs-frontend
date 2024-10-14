import React, { ReactNode } from 'react'
import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NextTopLoader from 'nextjs-toploader'
import { Viewport } from 'next'

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"]
})
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0
}

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html>
            <body className={clsx(poppins.className)}>
                <NextTopLoader
                    color='#6c4624'
                    zIndex={1600} />
                {children}
            </body>
        </html>
    )
}

export default RootLayout