// @ts-nocheck
import MainLayout from '@/ui/Layout'
import React, { Suspense } from 'react'
import { DataContextProvider } from '../providers'
import { SessionProvider } from 'next-auth/react'

// Loading component for page transitions
const PageLoading = () => (
    <div className="min-h-[50vh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
)

const MainInnerContainerLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <DataContextProvider>
                <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                        {children}
                    </Suspense>
                </MainLayout>
            </DataContextProvider>
        </SessionProvider>
    )
}

export default MainInnerContainerLayout