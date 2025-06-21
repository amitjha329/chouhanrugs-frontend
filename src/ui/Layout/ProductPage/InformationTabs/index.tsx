'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import React, { useState, useCallback, useMemo, useRef } from 'react'

type TabType = 'description' | 'highlights' | 'care'

interface TabConfig {
  id: TabType
  label: string
  content: React.ReactNode
}

const InformationTabs = ({ product }: { product: ProductDataModelWithColorMap }) => {
    const [activeDropdown, setActiveDropdown] = useState<TabType | null>(null)
    const [activeTab, setActiveTab] = useState<TabType>('description')

    // Refs for each accordion section
    const accordionRefs = useRef<Record<TabType, HTMLDivElement | null>>({
        description: null,
        highlights: null,
        care: null,
    })

    // Memoize tab configurations to prevent unnecessary re-renders
    const tabs = useMemo<TabConfig[]>(() => [
        {
            id: 'description',
            label: 'Description',
            content: (
                <div 
                    className="text-gray-600" 
                    dangerouslySetInnerHTML={{ __html: product.productDescriptionLong }}
                />
            )
        },
        {
            id: 'highlights',
            label: 'Highlights',
            content: (
                <ul className="text-gray-600 list-disc ml-4">
                    {product.highlights.map((highlight, index) => (
                        <li key={`highlight-${index}`} className="list-item leading-6">
                            {highlight}
                        </li>
                    ))}
                </ul>
            )
        },
        {
            id: 'care',
            label: 'Care',
            content: (
                <ul className="text-gray-600 list-disc ml-4">
                    {product.careInstructions.map((instruction, index) => (
                        <li key={`care-${index}`} className="list-item leading-6">
                            {instruction}
                        </li>
                    ))}
                </ul>
            )
        }
    ], [product.productDescriptionLong, product.highlights, product.careInstructions])

    // Toggle dropdown handler (mobile)
    const handleDropdownToggle = useCallback((tabId: TabType) => {
        setActiveDropdown(prev => {
            const next = prev === tabId ? null : tabId
            if (next && accordionRefs.current[next]) {
                setTimeout(() => {
                    accordionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 100) // Wait for collapse animation
            }
            return next
        })
    }, [])

    // Tab change handler (desktop)
    const handleTabChange = useCallback((tabId: TabType) => {
        setActiveTab(tabId)
    }, [])

    // Get the active tab content (desktop)
    const activeTabContent = useMemo(() => {
        return tabs.find(tab => tab.id === activeTab)?.content
    }, [tabs, activeTab])

    return (
        <>
            {/* Mobile: Accordion/Dropdown */}
            <div className="w-full max-w-2xl mx-auto md:hidden px-5">
                <div className="flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            ref={el => { accordionRefs.current[tab.id] = el; }}
                            className="collapse collapse-arrow bg-base-200 rounded-box"
                        >
                            <input 
                                type="checkbox" 
                                className="peer" 
                                checked={activeDropdown === tab.id} 
                                onChange={() => handleDropdownToggle(tab.id)} 
                                readOnly
                            />
                            <div 
                                className="collapse-title text-lg font-medium cursor-pointer select-none flex items-center justify-between"
                                onClick={() => handleDropdownToggle(tab.id)}
                            >
                                {tab.label}
                            </div>
                            <div className="collapse-content">
                                {activeDropdown === tab.id && tab.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Desktop: Tabs */}
            <div className="hidden md:flex mx-auto flex-row ~py-10/20">
                <div className="flex flex-col">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                                py-2 px-5 transition-colors duration-200
                                ${activeTab === tab.id 
                                    ? 'bg-accent-dark text-primary border border-primary' 
                                    : 'bg-accent hover:bg-accent-dark/90 text-white border-white'
                                }
                                ${index < tabs.length - 1 ? 'border-b' : ''}
                            `}
                            aria-selected={activeTab === tab.id}
                            role="tab"
                            type="button"
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div 
                    className="w-full min-h-40 bg-gray-200 ~p-10/16"
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab}`}
                >
                    {activeTabContent}
                </div>
            </div>
        </>
    )
}

export default InformationTabs