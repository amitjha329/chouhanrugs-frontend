// @ts-nocheck
import React, { Suspense } from 'react'
import CategoryMenu from './CategoryMenu'
import PageLinks from './PageLinks'
import Header from './Header'
import AlgoliaSearch from './AlgoliaSearch'
// import SearchComp from './SearchComp'
import { FaSearch } from 'react-icons/fa'

// Skeleton for header while auth loads
function HeaderSkeleton() {
    return (
        <header className='flex items-center justify-between px-10 py-5 bg-base-100'>
            <div className='flex gap-10'>
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className='flex gap-10'>
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
        </header>
    )
}

// Skeleton for category menu while categories load
function CategoryMenuSkeleton() {
    return (
        <nav className='bg-secondary text-secondary-content font-[500] flex items-center justify-center gap-10 py-5 sticky top-0 z-50'>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="w-20 h-5 bg-secondary-content/20 rounded animate-pulse" />
            ))}
        </nav>
    )
}

const Navigation = () => {
    return (
        <>
            <PageLinks />
            {/* Header uses auth() which requires Suspense with cacheComponents */}
            <Suspense fallback={<HeaderSkeleton />}>
                <Header />
            </Suspense>
            <div className='w-full mx-auto h-0 transition-all join z-999 overflow-hidden' id='search_container'>
                <div className="w-full pb-4 mx-auto fluid_container">
                    {/* AlgoliaSearch uses Math.random() internally, needs Suspense */}
                    <Suspense fallback={<div className="w-full h-12 bg-gray-100 rounded animate-pulse" />}>
                        <AlgoliaSearch 
                            appId={process.env.NEXT_PUBLIC_ALGOLIA_APPID ?? ""}
                            apiKey={process.env.NEXT_PUBLIC_ALGOLIA_KEY_CLIENT ?? ""}
                            indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? ""}
                            querySuggestionsIndex={process.env.NEXT_PUBLIC_ALGOLIA_QUERY_INDEX ?? ""}
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
            <Suspense fallback={<CategoryMenuSkeleton />}>
                <CategoryMenu />
            </Suspense>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script id='searchButtonHandler' src='/searchButtonHandler.js' defer></script>
        </>
    )
}

export default Navigation