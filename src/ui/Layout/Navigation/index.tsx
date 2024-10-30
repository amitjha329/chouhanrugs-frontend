import React from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'
import Script from 'next/script'
import { FaSearch } from 'react-icons/fa'

const Navigation = () => {
    return (
        <>
            <PageLinks />
            <Header />
            <div className='w-full mx-auto h-0 transition-all join overflow-hidden' id='search_container'>
                <form className="join w-full my-1 mx-auto fluid_container" action="/products">
                    <input className="input input-bordered join-item w-full" placeholder="Search" name='search' type='text' id='search' />
                    <button className="btn btn-outline btn-accent join-item" type='submit'><FaSearch /></button>
                </form>
            </div>
            <CategoryMenu />
            <Script id='searchButtonHandler' src='/searchButtonHandler.js'></Script>
        </>
    )
}

export default Navigation