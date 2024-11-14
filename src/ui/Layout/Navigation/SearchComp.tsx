'use client'
import { AlgoliaSearchProvider } from '@/app/providers'
import { algoliasearch } from 'algoliasearch'
import React from 'react'
import { Autocomplete } from './AutoCompleteSearchBox'

const SearchComp = ({ appId, algKey, index }: { appId: string, algKey: string, index: string }) => {
    const searchClient = algoliasearch(appId, algKey)

    return (
        <AlgoliaSearchProvider APPID={appId} KEY={algKey} INDEX={index}  >
            <Autocomplete searchClient={searchClient} openOnFocus placeholder='Search For Products' indexName={index} classNames={{
                form: "join !border !rounded-lg !drop-shadow-lg !w-full",
                inputWrapper: "join-item w-full",
                input: "input input-ghost w-full",
                inputWrapperPrefix: "btn btn-ghost join-item",
                submitButton: "!text-gray-800",
                loadingIndicator: "hidden",
                root: "relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm",
                inputWrapperSuffix: "btn btn-ghost join-item",
                panel: "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm no-scrollbar z-[99]",
                list: "py-1",
                item: "relative select-none py-2 pl-4 pr-4 cursor-pointer hover:bg-gray-100"
            }} detachedMediaQuery="none" />
        </AlgoliaSearchProvider>
    )
}

export default SearchComp