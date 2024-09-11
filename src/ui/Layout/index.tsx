import React, { ReactNode } from 'react'
import Footer from './Footer'
import Navigation from './Navigation'

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navigation />
            {children}
            <Footer />
        </>
    )
}

export default MainLayout