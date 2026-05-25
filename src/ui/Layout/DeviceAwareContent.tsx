import React, { ReactNode } from 'react'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import Navigation from './Navigation'
import MobileNavigation from './MobileNavigation'
import Footer from './Footer'
import SideNav from './MobileNavigation/SideNav'
import BottomNavigation from '@/ui/BottomNavigation'
import MobileNavAutoHide from './MobileNavigation/MobileNavAutoHide'
import MobileMenuController from './MobileNavigation/MobileMenuController'

interface DeviceAwareContentProps {
    children: ReactNode
}

const DeviceAwareContent = async ({ children }: DeviceAwareContentProps) => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) === "mobile"

    return (
        <>
            <div className='bg-base-100' id='main_body_container'>
                {isMobile ? <MobileNavigation /> : <Navigation />}
                {children}
                <Footer />
                {isMobile && (
                    <>
                        <BottomNavigation />
                        <MobileNavAutoHide />
                        <MobileMenuController />
                    </>
                )}
            </div>
            {isMobile && <SideNav />}
        </>
    )
}

export default DeviceAwareContent
