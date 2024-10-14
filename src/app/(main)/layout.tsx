import MainLayout from '@/ui/Layout'
import React from 'react'

const MainInnerContainerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    )
}

export default MainInnerContainerLayout