import React, { ReactNode } from 'react'
import '@/styles/globals.scss'
import MainLayout from '@/ui/Layout'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NextTopLoader from 'nextjs-toploader'
import '@/styles/Nprogress.css'
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
            <body className={clsx(poppins.className, 'custom_scrollbar')}>
                <NextTopLoader />
                <MainLayout>
                    {/* <BreadCrumbs crumbs={[
                        { name: "Home", link: "/" },
                        { name: "Category", link: "/category" }
                    ]} /> */}
                    {children}
                </MainLayout>
            </body>
        </html>
    )
}

export default RootLayout