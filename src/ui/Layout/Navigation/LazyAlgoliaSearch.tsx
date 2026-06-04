'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const AlgoliaSearch = dynamic(() => import('./AlgoliaSearch'), {
    ssr: false,
    loading: () => null,
})

type Props = {
    appId: string
    apiKey: string
    indexName: string
    querySuggestionsIndex: string
}

export default function LazyAlgoliaSearch(props: Props) {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        const enableSearch = () => setEnabled(true)
        window.addEventListener('chouhanrugs:open-search', enableSearch, { once: true })
        return () => window.removeEventListener('chouhanrugs:open-search', enableSearch)
    }, [])

    if (!enabled) {
        return <div className="h-12 w-full rounded border border-base-200 bg-white" aria-hidden="true" />
    }

    return <AlgoliaSearch {...props} />
}
