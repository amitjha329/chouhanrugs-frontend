import React, { ReactNode, Suspense } from 'react'
import DeviceAwareContent from './DeviceAwareContent'
import ScrollToTop from '@/components/ScrollToTop'

const MainLayoutFallback = () => (
    <div className='min-h-screen w-screen bg-[#fbf7ef]' aria-hidden='true' />
)

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='relative h-screen w-screen overflow-y-scroll overflow-x-clip bg-[#fbf7ef]' id='main-container'>
            <Suspense fallback={null}>
                <ScrollToTop />
            </Suspense>
            <Suspense fallback={<MainLayoutFallback />}>
                <DeviceAwareContent>
                    {children}
                </DeviceAwareContent>
            </Suspense>
        </main>
    )
}

export default MainLayout
