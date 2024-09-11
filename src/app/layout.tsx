import React, { ReactNode } from 'react'
import '@/styles/globals.scss'
import MainLayout from '@/ui/Layout'
import { Poppins } from 'next/font/google'
import clsx from 'clsx'

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"]
})

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html>
            <body className={clsx(poppins.className)}>
                <MainLayout>
                    {children}
                </MainLayout>
            </body>
        </html>
    )
}

export default RootLayout