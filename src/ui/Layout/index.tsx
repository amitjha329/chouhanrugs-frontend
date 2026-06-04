import React, { ReactNode, Suspense } from 'react'
import DeviceAwareContent from './DeviceAwareContent'
import ScrollToTop from '@/components/ScrollToTop'

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='relative h-screen w-screen overflow-y-scroll overflow-x-clip' id='main-container'>
            <Suspense fallback={null}>
                <ScrollToTop />
            </Suspense>
            <Suspense fallback={null}>
                <DeviceAwareContent>
                    {children}
                </DeviceAwareContent>
            </Suspense>
        </main>
    )
}

export default MainLayout
