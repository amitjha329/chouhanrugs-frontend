import React, { ReactNode } from 'react'
import Footer from './Footer'
import Navigation from './Navigation'

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navigation />
            <main className='container mx-auto px-20'>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default MainLayout