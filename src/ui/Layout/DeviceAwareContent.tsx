import React, { ReactNode } from 'react'
import { headers } from 'next/headers'
import clsx from 'clsx'
import getDevice from '@/utils/getDevice'
import Navigation from './Navigation'
import MobileNavigation from './MobileNavigation'
import Footer from './Footer'
import SideNav from './MobileNavigation/SideNav'

interface DeviceAwareContentProps {
    children: ReactNode
}

const DeviceAwareContent = async ({ children }: DeviceAwareContentProps) => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) === "mobile"

    return (
        <>
            <div 
                className={clsx('bg-base-100', { "absolute max-w-full transition-all z-20": isMobile })} 
                id='main_body_container'
            >
                {isMobile ? <MobileNavigation /> : <Navigation />}
                {children}
                <Footer />
            </div>
            {isMobile && <SideNav />}
        </>
    )
}

export default DeviceAwareContent
