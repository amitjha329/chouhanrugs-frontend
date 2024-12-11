// @ts-nocheck
import MainLayout from '@/ui/Layout'
import React from 'react'
import { DataContextProvider } from '../providers'
import { SessionProvider } from 'next-auth/react'

const MainInnerContainerLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <DataContextProvider>
                <MainLayout>
                    {children}
                </MainLayout>
            </DataContextProvider>
        </SessionProvider>
    )
}

export default MainInnerContainerLayout