// @ts-nocheck
import MainLayout from '@/ui/Layout'
import React from 'react'
import { DataContextProvider } from '../../providers'

const MainInnerContainerLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <DataContextProvider>
            <MainLayout>
                {children}
            </MainLayout>
        </DataContextProvider>
    )
}

export default MainInnerContainerLayout
