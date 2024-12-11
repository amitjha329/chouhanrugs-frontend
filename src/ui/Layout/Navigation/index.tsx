// @ts-nocheck
import React from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'
import Script from 'next/script'
// import SearchComp from './SearchComp'
import { FaSearch } from 'react-icons/fa'

const Navigation = () => {
    return (
        <>
            <PageLinks />
            <Header />

            <div className='w-full mx-auto h-0 transition-all join z-999 overflow-hidden' id='search_container'>
                <form className="join w-full pb-4 mx-auto fluid_container" action="/products">
                    <input className="input input-bordered join-item w-full" placeholder="Search" name='search' type='text' id='search' tabIndex={0} role='button' />
                    <button className="btn btn-outline btn-accent join-item" type='submit'><FaSearch /></button>
                </form>
                {/* <SearchComp appId={process.env.ALGOLIA_APPID ?? ""} algKey={process.env.ALGOLIA_KEY_CLIENT ?? ""} index={process.env.ALGOLIA_INDEX ?? ""} /> */}
            </div>
            <CategoryMenu />
            <Script id='searchButtonHandler' src='/searchButtonHandler.js'></Script>
        </>
    )
}

export default Navigation