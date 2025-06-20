// @ts-nocheck
import React from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'
import AlgoliaSearch from './AlgoliaSearch'
// import SearchComp from './SearchComp'
import { FaSearch } from 'react-icons/fa'

const Navigation = () => {
    return (
        <>
            <PageLinks />
            <Header />
            <div className='w-full mx-auto h-0 transition-all join z-999 overflow-hidden' id='search_container'>
                <div className="w-full pb-4 mx-auto fluid_container">
                    <AlgoliaSearch 
                        appId={process.env.NEXT_PUBLIC_ALGOLIA_APPID ?? ""}
                        apiKey={process.env.NEXT_PUBLIC_ALGOLIA_KEY_CLIENT ?? ""}
                        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? ""}
                        querySuggestionsIndex={process.env.NEXT_PUBLIC_ALGOLIA_QUERY_INDEX ?? ""}
                    />
                </div>
                {/* Fallback form for when JavaScript is disabled */}
                <noscript>
                    <form className="join w-full pb-4 mx-auto fluid_container" action="/products">
                        <input className="input input-bordered join-item w-full" placeholder="Search" name='search' type='text' id='search' tabIndex={0} role='button' />
                        <button className="btn btn-outline btn-accent join-item" type='submit'><FaSearch /></button>
                    </form>
                </noscript>
                {/* <SearchComp appId={process.env.ALGOLIA_APPID ?? ""} algKey={process.env.ALGOLIA_KEY_CLIENT ?? ""} index={process.env.ALGOLIA_INDEX ?? ""} /> */}
            </div>
            <CategoryMenu />
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script id='searchButtonHandler' src='/searchButtonHandler.js' defer></script>
        </>
    )
}

export default Navigation