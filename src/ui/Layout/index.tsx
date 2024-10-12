import React, { ReactNode } from 'react'
import Footer from './Footer'
import Navigation from './Navigation'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import MobileNavigation from './MobileNavigation'

const MainLayout = ({ children }: { children: ReactNode }) => {
    const header = headers()
    return (
        <>
            {
                getDevice({ headers: header }) != "mobile" ? <Navigation /> : <MobileNavigation />
            }
            <main className='bg-base-100'>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default MainLayout