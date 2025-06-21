'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import React, { useState, useCallback, useMemo } from 'react'

type TabType = 'description' | 'highlights' | 'care'

interface TabConfig {
  id: TabType
  label: string
  content: React.ReactNode
}

const InformationTabs = ({ product }: { product: ProductDataModelWithColorMap }) => {
    const [activeTab, setActiveTab] = useState<TabType>('description')

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

    // Memoize tab change handler to prevent unnecessary re-renders
    const handleTabChange = useCallback((tabId: TabType) => {
        setActiveTab(tabId)
    }, [])

    // Get the active tab content
    const activeTabContent = useMemo(() => {
        return tabs.find(tab => tab.id === activeTab)?.content
    }, [tabs, activeTab])

    return (
        <div className="flex max-md:flex-col ~py-10/20">
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
    )
}

export default InformationTabs