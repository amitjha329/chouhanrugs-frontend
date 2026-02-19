import React, { ReactNode, Suspense } from 'react'
import DeviceAwareContent from './DeviceAwareContent'

// Skeleton for the layout while device detection is happening
const LayoutSkeleton = ({ children }: { children: ReactNode }) => (
    <div className='bg-base-100' id='main_body_container'>
        {/* Navigation skeleton */}
        <div className="h-16 bg-base-200 animate-pulse" />
        {children}
        {/* Footer will render once content loads */}
    </div>
)

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='relative h-screen w-screen overflow-y-scroll overflow-x-clip' id='main-container'>
            <Suspense fallback={<LayoutSkeleton>{children}</LayoutSkeleton>}>
                <DeviceAwareContent>
                    {children}
                </DeviceAwareContent>
            </Suspense>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script id='mobile_menu_handler' src='/mobile_menu_handler.js' defer></script>
        </main>
    )
}

export default MainLayout