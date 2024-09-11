import React from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'

const Navigation = () => {
    return (
        <header>
            <PageLinks />
            <Header />
            <CategoryMenu />
        </header>
    )
}

export default Navigation