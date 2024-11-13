import React from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'
import Script from 'next/script'
import { FaSearch } from 'react-icons/fa'
import { Autocomplete } from './AutoCompleteSearchBox'
import { AlgoliaSearchProvider } from '@/app/providers'

const Navigation = () => {
    return (
        <>
            <PageLinks />
            <Header />
            <AlgoliaSearchProvider APPID={process.env.ALGOLIA_APPID ?? ""} KEY={process.env.ALGOLIA_KEY_CLIENT ?? ""} INDEX={process.env.ALGOLIA_INDEX ?? ""}>
                <Autocomplete indexName='products' queryIndexName='products' />
            </AlgoliaSearchProvider>
            {/* <div className='w-full mx-auto h-0 transition-all join dropdown dropdown-bottom ' id='search_container'>
                <form className="join w-full pb-4 mx-auto fluid_container" action="/products">
                    <input className="input input-bordered join-item w-full" placeholder="Search" name='search' type='text' id='search' tabIndex={0} role='button' />
                    <button className="btn btn-outline btn-accent join-item" type='submit'><FaSearch /></button>
                </form>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[999] w-52 p-2" id='#hits'>
                    <li><a>Item 1</a></li>
                    <li><a>Item 2</a></li>
                </ul>
            </div> */}
            <CategoryMenu />
            <Script id='searchButtonHandler' src='/searchButtonHandler.js'></Script>
        </>
    )
}

export default Navigation