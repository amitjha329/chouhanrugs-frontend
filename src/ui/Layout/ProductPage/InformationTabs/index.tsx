'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import React, { useState, useCallback, useMemo, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { resolveLocalizedString, resolveLocalized } from '@/lib/resolveLocalized'
import { type Locale } from '@/i18n/routing'

type TabType = 'description' | 'highlights' | 'care' | 'specifications'

interface TabConfig {
    id: TabType
    label: string
    content: React.ReactNode
}

const InformationTabs = ({ product, compact = false }: { product: ProductDataModelWithColorMap, compact?: boolean }) => {
    const t = useTranslations('product')
    const locale = useLocale() as Locale
    const longDesc = resolveLocalizedString(product.productDescriptionLong, locale)
    const highlightsList = resolveLocalized<string[]>(product.highlights, locale) ?? []
    const careList = resolveLocalized<string[]>(product.careInstructions, locale) ?? []
    const material = resolveLocalizedString(product.material, locale)
    const texture = resolveLocalizedString(product.texture, locale)
    const variationWarning = resolveLocalizedString(product.variationWarning, locale)
    const bodyClassName = compact ? 'text-[13px] leading-5 text-neutral-600' : 'text-base leading-7 text-gray-600'
    const listClassName = compact ? 'ml-4 list-disc space-y-1 text-[13px] leading-5 text-neutral-600' : 'ml-4 list-disc text-gray-600'
    const specRowClassName = compact ? 'flex justify-between gap-3 border-b border-neutral-200 pb-2 text-[13px]' : 'flex justify-between gap-4 border-b border-gray-300 pb-2'
    const specLabelClassName = compact ? 'font-medium text-neutral-500' : 'font-medium'
    const specValueClassName = compact ? 'text-right text-neutral-800' : 'text-right'

    const [activeDropdown, setActiveDropdown] = useState<TabType | null>(null)

    // Refs for each accordion section
    const accordionRefs = useRef<Record<TabType, HTMLDivElement | null>>({
        description: null,
        highlights: null,
        care: null,
        specifications: null,
    })

    // Memoize tab configurations to prevent unnecessary re-renders
    const tabs = useMemo<TabConfig[]>(() => {
        return [
            {
                id: 'description',
                label: t('description'),
                content: (
                    <div
                        className={bodyClassName}
                        dangerouslySetInnerHTML={{ __html: longDesc }}
                    />
                )
            },
            {
                id: 'highlights',
                label: t('highlights'),
                content: (
                    <ul className={listClassName}>
                        {highlightsList.map((highlight, index) => (
                            <li key={`highlight-${index}`} className="list-item">
                                {highlight}
                            </li>
                        ))}
                    </ul>
                )
            },
            {
                id: 'care',
                label: t('care'),
                content: (
                    <ul className={listClassName}>
                        {careList.map((instruction, index) => (
                            <li key={`care-${index}`} className="list-item">
                                {instruction}
                            </li>
                        ))}
                    </ul>
                )
            },
            {
                id: 'specifications',
                label: t('specifications') || 'Specifications',
                content: (
                    <div className={compact ? "space-y-4" : "space-y-6"}>
                        <div className={compact ? "grid grid-cols-1 gap-y-2 text-neutral-600" : "grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-gray-600"}>
                            {product.sku && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>SKU</span>
                                    <span className={specValueClassName}>{product.sku}</span>
                                </div>
                            )}
                            {product.itemCode && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Item Code</span>
                                    <span className={specValueClassName}>{product.itemCode}</span>
                                </div>
                            )}
                            {product.gtin && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>GTIN</span>
                                    <span className={specValueClassName}>{product.gtin}</span>
                                </div>
                            )}
                            {material && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Material</span>
                                    <span className={specValueClassName}>{material}</span>
                                </div>
                            )}
                            {texture && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Texture</span>
                                    <span className={specValueClassName}>{texture}</span>
                                </div>
                            )}
                            {product.pileThickness && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Pile Thickness</span>
                                    <span className={specValueClassName}>{product.pileThickness}</span>
                                </div>
                            )}
                            {product.countryOfOrigin && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Origin</span>
                                    <span className={specValueClassName}>{product.countryOfOrigin}</span>
                                </div>
                            )}
                            {product.warranty && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Warranty</span>
                                    <span className={specValueClassName}>{product.warranty}</span>
                                </div>
                            )}
                            {(product.weight ?? 0) > 0 && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Weight</span>
                                    <span className={specValueClassName}>{product.weight} {product.weightUnit}</span>
                                </div>
                            )}
                            {product.dimensions && (product.dimensions.length > 0 || product.dimensions.width > 0 || product.dimensions.height > 0) && (
                                <div className={specRowClassName}>
                                    <span className={specLabelClassName}>Dimensions</span>
                                    <span className={specValueClassName}>{product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}</span>
                                </div>
                            )}
                            <div className={specRowClassName}>
                                <span className={specLabelClassName}>Category</span>
                                <span className={specValueClassName}>{product.productCategory}</span>
                            </div>
                        </div>
                        {(product.certifications?.length ?? 0) > 0 && (
                            <div>
                                <h3 className={compact ? "mb-2 text-[13px] font-semibold text-neutral-700" : "mb-2 text-sm font-semibold text-gray-700"}>Certifications</h3>
                                <div className={compact ? "flex flex-wrap gap-1.5" : "flex flex-wrap gap-2"}>
                                    {product.certifications?.map((certification, index) => (
                                        <span
                                            key={`${certification}-${index}`}
                                            className={compact ? "rounded-full border border-neutral-300 px-2.5 py-1 text-[12px] text-neutral-600" : "rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600"}
                                        >
                                            {certification}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {variationWarning && (
                            <div className={compact ? "border-l-2 border-amber-500 pl-3 text-[12px] leading-5 text-amber-900" : "bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-800 italic"}>
                                <strong>Note:</strong> {variationWarning}
                            </div>
                        )}
                    </div>
                )
            }
        ];
    }, [bodyClassName, listClassName, specLabelClassName, specRowClassName, specValueClassName, compact, longDesc, highlightsList, careList, material, texture, variationWarning, product, t]);

    // Toggle dropdown handler (mobile)
    const handleDropdownToggle = useCallback((tabId: TabType) => {
        setActiveDropdown(prev => {
            const next = prev === tabId ? null : tabId
            if (!compact && next && accordionRefs.current[next]) {
                setTimeout(() => {
                    accordionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 100) // Wait for collapse animation
            }
            return next
        })
    }, [compact])

    return (
        <section className={compact ? "w-full" : "mx-auto max-w-5xl"}>
            <div className={compact ? "mb-2.5" : "mb-6"}>
                <p className={compact ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-primary" : "text-xs font-semibold uppercase tracking-[0.18em] text-primary"}>Product details</p>
                <h2 className={compact ? "mt-1 text-sm font-semibold text-neutral-950" : "mt-2 text-2xl font-semibold text-neutral-950 md:text-4xl"}>
                    Details and care
                </h2>
                {!compact && (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 md:text-base">
                        Review the material story, key features, care guidance, and technical details before you choose the right piece for your space.
                    </p>
                )}
            </div>

            <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-3"}>
                {tabs.map((tab) => {
                    const isOpen = activeDropdown === tab.id

                    return (
                        <div
                            key={tab.id}
                            ref={el => { accordionRefs.current[tab.id] = el; }}
                            className={compact ? `overflow-hidden rounded-lg border bg-white transition-colors ${isOpen ? 'border-primary/35' : 'border-neutral-200'}` : "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"}
                        >
                            <button
                                type="button"
                                className={compact ? "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[13px] font-semibold text-neutral-950 transition-colors hover:text-primary" : "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-neutral-950 transition-colors hover:bg-neutral-50 md:px-6 md:py-5"}
                                onClick={() => handleDropdownToggle(tab.id)}
                                aria-expanded={isOpen}
                                aria-controls={`product-info-${tab.id}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isOpen ? 'bg-primary' : 'bg-neutral-300'}`} aria-hidden="true" />
                                    {tab.label}
                                </span>
                                <span
                                    className={`flex flex-shrink-0 items-center justify-center rounded-full border border-neutral-300 leading-none text-neutral-700 transition-transform ${compact ? 'h-5 w-5 text-sm' : 'h-8 w-8 text-xl'} ${isOpen ? 'rotate-45 border-primary text-primary' : ''}`}
                                    aria-hidden="true"
                                >
                                    +
                                </span>
                            </button>
                            <div
                                id={`product-info-${tab.id}`}
                                className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className={compact ? "px-3 pb-3 pt-0.5" : "border-t border-neutral-100 px-5 py-5 text-base leading-7 md:px-6 md:py-6"}>
                                        {tab.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default InformationTabs
