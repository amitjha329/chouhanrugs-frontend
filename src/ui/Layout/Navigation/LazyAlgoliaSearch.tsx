'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const AlgoliaSearch = dynamic(() => import('./AlgoliaSearch'), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-xl mx-auto relative flex items-center">
            <input 
                type="text" 
                placeholder="Loading search..." 
                readOnly
                className="w-full pl-6 pr-12 py-3 text-sm font-medium rounded-full bg-[#fdfaf4] border-2 border-[#e5ccb5] focus:outline-none text-[#5d3c1e] placeholder-[#8b7868]/70 shadow-sm"
            />
            <div className="absolute right-4 text-[#6c4624] p-1">
                <FaSearch className="w-4 h-4 animate-pulse" />
            </div>
        </div>
    ),
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

    const handleInteraction = () => {
        setEnabled(true)
    }

    if (!enabled) {
        return (
            <div 
                className="w-full max-w-xl mx-auto relative flex items-center cursor-pointer"
                onMouseEnter={handleInteraction}
                onClick={handleInteraction}
                onTouchStart={handleInteraction}
            >
                <input 
                    type="text" 
                    placeholder="Search for handloom, wool, jute rugs..." 
                    readOnly
                    className="w-full pl-6 pr-12 py-3 text-sm font-medium rounded-full bg-[#fdfaf4] border-2 border-[#e5ccb5] focus:outline-none cursor-pointer text-[#5d3c1e] placeholder-[#8b7868]/70 shadow-sm"
                />
                <div className="absolute right-4 text-[#6c4624] p-1">
                    <FaSearch className="w-4 h-4" />
                </div>
            </div>
        )
    }

    return <AlgoliaSearch {...props} />
}
