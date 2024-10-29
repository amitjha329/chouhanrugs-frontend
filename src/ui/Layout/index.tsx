import React, { ReactNode } from 'react'
import Footer from './Footer'
import Navigation from './Navigation'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import MobileNavigation from './MobileNavigation'
import Script from 'next/script'
import SideNav from './MobileNavigation/SideNav'
import clsx from 'clsx'

const MainLayout = ({ children }: { children: ReactNode }) => {
    const header = headers()
    return (
        <main className='relative'>
            <div className={clsx('bg-base-100', { "absolute max-w-full transition-all": getDevice({ headers: header }) == "mobile" })} id='main_body_container'>
                {
                    getDevice({ headers: header }) != "mobile" ? <Navigation /> : <MobileNavigation />
                }
                {children}
                <Footer />
            </div>
            {getDevice({ headers: header }) == "mobile" && <SideNav />}
            <Script id='mobile_menu_handler' src='/mobile_menu_handler.js'></Script>
        </main>
    )
}

export default MainLayout