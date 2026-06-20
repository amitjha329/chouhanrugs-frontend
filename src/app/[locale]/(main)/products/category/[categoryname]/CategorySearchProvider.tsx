'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { AlgoliaSearchProvider } from '@/app/providers'
import StructureListing from '../../(listing)/ProductsList/Structure'
import { DEFAULT_USD_CURRENCY } from '@/lib/defaultCurrency'
import BreadCrumbs from '@/ui/BreadCrumbs'

export default function CategorySearchProvider({
    children,
    APPID,
    KEY,
    INDEX,
    initialUiState,
    categories,
    crumbs,
}: {
    children: React.ReactNode
    APPID: string
    KEY: string
    INDEX: string
    initialUiState?: Record<string, unknown>
    categories: any
    crumbs: any
}) {
    const params = useParams()
    const categoryname = params?.categoryname as string | undefined
    const decodedCategoryName = categoryname ? decodeURIComponent(categoryname) : ''

    return (
        <>
            <div className="container mx-auto px-3 sm:px-0">
                <BreadCrumbs crumbs={crumbs} />
            </div>
            <AlgoliaSearchProvider
                key={decodedCategoryName}
                APPID={APPID}
                KEY={KEY}
                INDEX={INDEX}
                initialUiState={initialUiState}
            >
                <StructureListing userCurrency={DEFAULT_USD_CURRENCY} categories={categories}>
                    {children}
                </StructureListing>
            </AlgoliaSearchProvider>
        </>
    )
}
