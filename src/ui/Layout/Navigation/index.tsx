// @ts-nocheck
import React, { Suspense } from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'
import LazyAlgoliaSearch from './LazyAlgoliaSearch'
// import SearchComp from './SearchComp'
import { FaSearch } from 'react-icons/fa'
import { getConfigBulk } from '@/lib/services/ConfigService'
import Script from 'next/script'

const Navigation = async () => {
    const algolia = await getConfigBulk(['ALGOLIA_APPID', 'ALGOLIA_KEY_CLIENT', 'ALGOLIA_INDEX', 'ALGOLIA_QUERY_INDEX'])
    return (
        <>
            <PageLinks />
            {/* Header uses auth() which requires Suspense with cacheComponents */}
            <Suspense fallback={null}>
                <Header />
            </Suspense>
            <div className='w-full mx-auto h-0 transition-all join z-999 overflow-hidden' id='search_container'>
                <div className="w-full pb-4 mx-auto fluid_container">
                    {/* AlgoliaSearch uses Math.random() internally, needs Suspense */}
                    <Suspense fallback={null}>
                        <LazyAlgoliaSearch
                            appId={algolia.ALGOLIA_APPID}
                            apiKey={algolia.ALGOLIA_KEY_CLIENT}
                            indexName={algolia.ALGOLIA_INDEX}
                            querySuggestionsIndex={algolia.ALGOLIA_QUERY_INDEX}
                        />
                    </Suspense>
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
            {/* CategoryMenu uses auth() via getCategoriesList, needs Suspense */}
            <Suspense fallback={null}>
                <CategoryMenu />
            </Suspense>
            <Script id='searchButtonHandler' src='/searchButtonHandler.js' strategy="afterInteractive" />
        </>
    )
}

export default Navigation
