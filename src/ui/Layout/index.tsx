import React, { ReactNode } from 'react'
import DeviceAwareContent from './DeviceAwareContent'
import ScrollToTop from '@/components/ScrollToTop'

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='relative h-screen w-screen overflow-y-scroll overflow-x-clip' id='main-container'>
            <ScrollToTop />
            <DeviceAwareContent>
                {children}
            </DeviceAwareContent>
        </main>
    )
}

export default MainLayout
