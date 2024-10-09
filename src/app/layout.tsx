import React, { ReactNode } from 'react'
import '@/styles/globals.scss'
import MainLayout from '@/ui/Layout'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NextTopLoader from 'nextjs-toploader'
import BreadCrumbs from '@/ui/BreadCrumbs'
import '@/styles/Nprogress.css'

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"]
})

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html>
            <body className={clsx(poppins.className)}>
                <NextTopLoader />
                <MainLayout>
                    <BreadCrumbs crumbs={[
                        { name: "Home", link: "/" },
                        { name: "Category", link: "/category" }
                    ]} />
                    {children}
                </MainLayout>
            </body>
        </html>
    )
}

export default RootLayout