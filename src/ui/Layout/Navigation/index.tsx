import React from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'

const Navigation = () => {
    return (
        <header className='sticky top-0'>
            <PageLinks />
            <Header />
            <CategoryMenu />
        </header>
    )
}

export default Navigation