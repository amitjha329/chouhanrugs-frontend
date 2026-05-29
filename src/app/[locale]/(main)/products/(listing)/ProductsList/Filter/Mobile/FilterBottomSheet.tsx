// @ts-nocheck
'use client'

import React, { useMemo, useState } from 'react'
import {
    ClearRefinements,
    useClearRefinements,
    useCurrentRefinements,
    useHierarchicalMenu,
    useInstantSearch,
    useRefinementList,
    useToggleRefinement,
} from 'react-instantsearch'
import {
    FiArrowLeft,
    FiBox,
    FiChevronRight,
    FiCircle,
    FiDollarSign,
    FiDroplet,
    FiEdit3,
    FiGrid,
    FiInfo,
    FiMaximize,
    FiSearch,
    FiShoppingBag,
    FiSliders,
    FiX,
} from 'react-icons/fi'
import RangeSlider from '../RangeSlider'
import Currency from '@/types/Currency'

type FacetKind = 'hierarchical' | 'list' | 'toggle' | 'range'

type FacetConfig = {
    id: string
    title: string
    searchPlaceholder?: string
    kind: FacetKind
    attribute?: string
    clearAttributes: string[]
    icon: React.ComponentType<{ className?: string }>
}

const hierarchicalCategoryAttributes = [
    'hierarchicalCategories.lvl0',
    'hierarchicalCategories.lvl1',
    'hierarchicalCategories.lvl2',
    'hierarchicalCategories.lvl3',
]

const facets: FacetConfig[] = [
    {
        id: 'categories',
        title: 'Categories',
        searchPlaceholder: 'Search category',
        kind: 'hierarchical',
        clearAttributes: ['hierarchicalCategories.lvl0'],
        icon: FiGrid,
    },
    {
        id: 'price',
        title: 'Price',
        kind: 'range',
        attribute: 'productSellingPrice',
        clearAttributes: ['productSellingPrice'],
        icon: FiDollarSign,
    },
    {
        id: 'customizable',
        title: 'Customizable',
        kind: 'toggle',
        attribute: 'productCustomizable',
        clearAttributes: ['productCustomizable'],
        icon: FiEdit3,
    },
    {
        id: 'size',
        title: 'Size',
        searchPlaceholder: 'Search size',
        kind: 'list',
        attribute: 'variations.variationSize',
        clearAttributes: ['variations.variationSize'],
        icon: FiMaximize,
    },
    {
        id: 'color',
        title: 'Color',
        searchPlaceholder: 'Search color',
        kind: 'list',
        attribute: 'variations.variationColor',
        clearAttributes: ['variations.variationColor'],
        icon: FiDroplet,
    },
    {
        id: 'brands',
        title: 'Brands',
        searchPlaceholder: 'Search brand',
        kind: 'list',
        attribute: 'productBrand',
        clearAttributes: ['productBrand'],
        icon: FiShoppingBag,
    },
    {
        id: 'shape',
        title: 'Shape',
        searchPlaceholder: 'Search shape',
        kind: 'list',
        attribute: 'productShape.name',
        clearAttributes: ['productShape.name'],
        icon: FiCircle,
    },
    {
        id: 'pattern',
        title: 'Pattern',
        searchPlaceholder: 'Search pattern',
        kind: 'list',
        attribute: 'productPattern.name',
        clearAttributes: ['productPattern.name'],
        icon: FiBox,
    },
]

const FilterBottomSheet = ({ filterSheetOpen, toggleOpenCallback, userCurrency }: {
    filterSheetOpen: boolean,
    toggleOpenCallback: React.MouseEventHandler,
    userCurrency: Currency
}) => {
    const [activeFacetId, setActiveFacetId] = useState<string | null>(null)
    const { results } = useInstantSearch()
    const resultCount = results?.nbHits ?? 0
    const activeFacet = facets.find((facet) => facet.id === activeFacetId) ?? null

    const closeFilters = (event) => {
        setActiveFacetId(null)
        toggleOpenCallback(event)
    }

    if (!filterSheetOpen) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[10050] md:hidden">
            <button
                type="button"
                aria-label="Close filters"
                className="absolute inset-0 bg-[#21140d]/45 backdrop-blur-[2px]"
                onClick={closeFilters}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Product filters"
                className="absolute inset-x-0 bottom-0 flex h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] border border-[#eadfd5] bg-[#fffdf9] shadow-[0_-22px_60px_rgba(33,20,13,0.22)]"
            >
                <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-[#dccfc4]" />

                {activeFacet ? (
                    <FacetOptionsScreen
                        facet={activeFacet}
                        resultCount={resultCount}
                        userCurrency={userCurrency}
                        onBack={() => setActiveFacetId(null)}
                        onClose={closeFilters}
                    />
                ) : (
                    <FacetListScreen
                        resultCount={resultCount}
                        onClose={closeFilters}
                        onFacetSelect={setActiveFacetId}
                    />
                )}
            </aside>
        </div>
    )
}

const FacetListScreen = ({ resultCount, onClose, onFacetSelect }: {
    resultCount: number,
    onClose: React.MouseEventHandler,
    onFacetSelect: (facetId: string) => void,
}) => {
    const selectedCounts = useSelectedFacetCounts()

    return (
        <>
            <header className="flex items-center justify-between gap-3 border-b border-[#f1e8df] px-5 pb-4 pt-5">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4ebe4] text-[#6c4624]">
                        <FiSliders className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <h2 className="text-[1.45rem] font-bold leading-none text-[#20160f]">Filters</h2>
                </div>
                <div className="flex items-center gap-4">
                    <ClearRefinements
                        translations={{ resetButtonText: 'Clear All' }}
                        classNames={{
                            button: 'text-sm font-bold text-[#4b3322] underline-offset-4 hover:underline',
                            disabledButton: 'cursor-not-allowed opacity-40',
                        }}
                    />
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                    >
                        <FiX className="h-7 w-7" aria-hidden="true" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-5 pb-4 pt-4">
                <AppliedFilters />

                <div className="mt-5 overflow-hidden rounded-2xl border border-[#f1e8df] bg-white shadow-[0_12px_32px_rgba(69,42,22,0.05)]">
                    {facets.map((facet) => {
                        const Icon = facet.icon
                        const selectedCount = selectedCounts[facet.id] ?? 0

                        return (
                            <button
                                key={facet.id}
                                type="button"
                                onClick={() => onFacetSelect(facet.id)}
                                className="flex min-h-[72px] w-full items-center justify-between gap-3 border-b border-[#f1e8df] px-4 text-left last:border-b-0 active:bg-[#fff7ef]"
                            >
                                <span className="flex min-w-0 items-center gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff7ef] text-[#6c4624]">
                                        <Icon className="h-[19px] w-[19px]" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-[15px] font-bold text-[#20160f]">{facet.title}</span>
                                        {selectedCount > 0 && (
                                            <span className="mt-0.5 block text-xs font-semibold text-[#8b7868]">
                                                {selectedCount} selected
                                            </span>
                                        )}
                                    </span>
                                </span>
                                <FiChevronRight className="h-5 w-5 shrink-0 text-[#6c4624]" aria-hidden="true" />
                            </button>
                        )
                    })}
                </div>
            </main>

            <footer className="border-t border-[#f1e8df] bg-[#fffdf9]/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_32px_rgba(69,42,22,0.08)] backdrop-blur">
                <div className="grid grid-cols-[0.9fr_1.1fr] gap-3">
                    <ClearRefinements
                        translations={{ resetButtonText: 'Reset' }}
                        classNames={{
                            button: 'inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#cdb9a7] bg-white px-4 text-sm font-bold text-[#4b3322] shadow-sm transition-colors active:scale-[0.99]',
                            disabledButton: 'cursor-not-allowed opacity-45',
                        }}
                    />
                    <button
                        type="button"
                        className="inline-flex h-12 items-center justify-center rounded-xl bg-[#6c4624] px-4 text-sm font-bold text-white shadow-[0_12px_22px_rgba(108,70,36,0.28)] transition-colors active:scale-[0.99]"
                        onClick={onClose}
                    >
                        Show Results ({resultCount.toLocaleString()})
                    </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#9a8a7c]">
                    <span className="h-3 w-3 rounded-full border border-[#cdb9a7]" aria-hidden="true" />
                    We respect your privacy
                </div>
            </footer>
        </>
    )
}

const FacetOptionsScreen = ({ facet, resultCount, userCurrency, onBack, onClose }: {
    facet: FacetConfig,
    resultCount: number,
    userCurrency: Currency,
    onBack: () => void,
    onClose: React.MouseEventHandler,
}) => {
    return (
        <>
            <header className="flex items-center justify-between gap-3 border-b border-[#f1e8df] px-5 pb-4 pt-5">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        aria-label="Back to filters"
                        onClick={onBack}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                    >
                        <FiArrowLeft className="h-7 w-7" aria-hidden="true" />
                    </button>
                    <h2 className="truncate text-[1.45rem] font-bold leading-none text-[#20160f]">{facet.title}</h2>
                </div>
                <button
                    type="button"
                    aria-label="Close filters"
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                >
                    <FiX className="h-7 w-7" aria-hidden="true" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-5 pb-4 pt-4">
                <FacetPanelContent facet={facet} userCurrency={userCurrency} resultCount={resultCount} />
            </main>

            <footer className="border-t border-[#f1e8df] bg-[#fffdf9]/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_32px_rgba(69,42,22,0.08)] backdrop-blur">
                <button
                    type="button"
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#6c4624] px-4 text-sm font-bold text-white shadow-[0_12px_22px_rgba(108,70,36,0.28)] transition-colors active:scale-[0.99]"
                    onClick={onBack}
                >
                    Apply
                </button>
                <ClearFacetButton facet={facet} className="mt-4 flex w-full items-center justify-center text-sm font-bold text-[#4b3322] underline underline-offset-4" />
            </footer>
        </>
    )
}

const FacetPanelContent = ({ facet, userCurrency, resultCount }: {
    facet: FacetConfig,
    userCurrency: Currency,
    resultCount: number,
}) => {
    if (facet.kind === 'hierarchical') {
        return <HierarchicalFacetOptions facet={facet} resultCount={resultCount} />
    }

    if (facet.kind === 'toggle') {
        return <ToggleFacetOptions facet={facet} resultCount={resultCount} />
    }

    if (facet.kind === 'range') {
        return (
            <div className="space-y-5">
                <div className="rounded-2xl border border-[#f1e8df] bg-white p-4 shadow-[0_12px_32px_rgba(69,42,22,0.05)]">
                    <RangeSlider userCurrency={userCurrency} />
                </div>
                <ResultHint resultCount={resultCount} label="products found with this price range" />
            </div>
        )
    }

    return <ListFacetOptions facet={facet} resultCount={resultCount} />
}

const HierarchicalFacetOptions = ({ facet, resultCount }: { facet: FacetConfig, resultCount: number }) => {
    const [query, setQuery] = useState('')
    const { items, refine, canRefine } = useHierarchicalMenu({
        attributes: hierarchicalCategoryAttributes,
        limit: 100,
        showParentLevel: true,
    })
    const options = useMemo(() => flattenHierarchicalItems(items), [items])
    const visibleOptions = filterOptions(options, query)
    const selectedLabel = options.find((item) => item.isRefined)?.label ?? facet.title

    return (
        <div className="space-y-4">
            <SearchInput value={query} onChange={setQuery} placeholder={facet.searchPlaceholder ?? `Search ${facet.title.toLowerCase()}`} />
            <div className="space-y-1">
                {visibleOptions.map((item) => (
                    <FacetOptionRow
                        key={item.value}
                        label={item.label}
                        count={item.count}
                        isRefined={item.isRefined}
                        level={item.level}
                        disabled={!canRefine}
                        onClick={() => refine(item.value)}
                    />
                ))}
            </div>
            <ResultHint resultCount={resultCount} label={`products found in ${selectedLabel}`} />
        </div>
    )
}

const ListFacetOptions = ({ facet, resultCount }: { facet: FacetConfig, resultCount: number }) => {
    const [query, setQuery] = useState('')
    const { items, refine, searchForItems, canRefine } = useRefinementList({
        attribute: facet.attribute,
        limit: 100,
        searchable: true,
    })

    const handleSearch = (value: string) => {
        setQuery(value)
        searchForItems(value)
    }

    return (
        <div className="space-y-4">
            <SearchInput value={query} onChange={handleSearch} placeholder={facet.searchPlaceholder ?? `Search ${facet.title.toLowerCase()}`} />
            <div className="space-y-1">
                {items.map((item) => (
                    <FacetOptionRow
                        key={item.value}
                        label={item.label}
                        count={item.count}
                        isRefined={item.isRefined}
                        disabled={!canRefine}
                        onClick={() => refine(item.value)}
                    />
                ))}
            </div>
            <ResultHint resultCount={resultCount} label={`products found with selected ${facet.title.toLowerCase()}`} />
        </div>
    )
}

const ToggleFacetOptions = ({ facet, resultCount }: { facet: FacetConfig, resultCount: number }) => {
    const { value, refine, canRefine } = useToggleRefinement({ attribute: facet.attribute })

    return (
        <div className="space-y-4">
            <FacetOptionRow
                label={facet.title}
                count={value?.count ?? resultCount}
                isRefined={value?.isRefined}
                disabled={!canRefine}
                onClick={() => refine({ isRefined: value?.isRefined })}
            />
            <ResultHint resultCount={resultCount} label={`products found with ${facet.title.toLowerCase()}`} />
        </div>
    )
}

const AppliedFilters = () => {
    const { items, refine } = useCurrentRefinements()
    const refinements = items.flatMap((item) => item.refinements.map((refinement) => ({
        ...refinement,
        sourceLabel: item.label,
    })))

    if (refinements.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-[#eadfd5] bg-white px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8b7868]">Applied Filters</p>
                <p className="mt-1 text-sm font-medium text-[#5f5046]">No filters selected yet.</p>
            </div>
        )
    }

    return (
        <section className="rounded-2xl border border-[#f1e8df] bg-white p-4 shadow-[0_10px_28px_rgba(69,42,22,0.04)]">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8b7868]">
                    Applied Filters ({refinements.length})
                </p>
                <ClearRefinements
                    translations={{ resetButtonText: 'Clear All' }}
                    classNames={{
                        button: 'text-xs font-bold text-[#6c4624] underline-offset-4 hover:underline',
                        disabledButton: 'hidden',
                    }}
                />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {refinements.map((refinement) => (
                    <button
                        key={`${refinement.attribute}-${refinement.label}-${refinement.value}`}
                        type="button"
                        onClick={() => refine(refinement)}
                        className="inline-flex max-w-full items-center gap-2 rounded-xl bg-[#f4ebe4] px-3 py-2 text-xs font-semibold text-[#35251a]"
                    >
                        <span className="truncate">{formatRefinementLabel(refinement.label)}</span>
                        <FiX className="h-3.5 w-3.5 shrink-0 text-[#6c4624]" aria-hidden="true" />
                    </button>
                ))}
            </div>
        </section>
    )
}

const SearchInput = ({ value, onChange, placeholder }: {
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
}) => {
    return (
        <label className="flex h-14 items-center gap-3 rounded-xl border border-[#eadfd5] bg-white px-4 shadow-[0_10px_26px_rgba(69,42,22,0.04)]">
            <FiSearch className="h-5 w-5 shrink-0 text-[#8b7868]" aria-hidden="true" />
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-[#2c211a] outline-none placeholder:text-[#9a8a7c]"
            />
        </label>
    )
}

const FacetOptionRow = ({ label, count, isRefined, level = 0, disabled = false, onClick }: {
    label: string,
    count?: number | null,
    isRefined?: boolean,
    level?: number,
    disabled?: boolean,
    onClick: () => void,
}) => {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="grid min-h-[74px] w-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl px-1 text-left transition-colors active:bg-[#fff7ef] disabled:cursor-not-allowed disabled:opacity-45"
            style={{ paddingLeft: `${4 + level * 14}px` }}
        >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-white transition-colors ${isRefined ? 'border-[#6c4624] bg-[#6c4624]' : 'border-[#d7cabf] bg-white'}`}>
                {isRefined && <span className="h-3.5 w-2 rotate-45 border-b-2 border-r-2 border-white" aria-hidden="true" />}
            </span>
            <span className="min-w-0 truncate text-[16px] font-semibold text-[#2c211a]">{formatOptionLabel(label)}</span>
            {typeof count === 'number' && (
                <span className="shrink-0 text-[15px] font-semibold text-[#5f5046]">({count.toLocaleString()})</span>
            )}
        </button>
    )
}

const ResultHint = ({ resultCount, label }: { resultCount: number, label: string }) => {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-[#f4ebe4]/80 px-4 py-3 text-xs font-semibold text-[#4b3322]">
            <FiInfo className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{resultCount.toLocaleString()} {label}</span>
        </div>
    )
}

const ClearFacetButton = ({ facet, className }: { facet: FacetConfig, className?: string }) => {
    const { canRefine, refine } = useClearRefinements({ includedAttributes: facet.clearAttributes })

    return (
        <button
            type="button"
            disabled={!canRefine}
            onClick={refine}
            className={`${className ?? ''} disabled:cursor-not-allowed disabled:opacity-45`}
        >
            Clear
        </button>
    )
}

const useSelectedFacetCounts = () => {
    const { items } = useCurrentRefinements()

    return useMemo(() => {
        return facets.reduce((acc, facet) => {
            acc[facet.id] = items.reduce((count, item) => {
                return count + item.refinements.filter((refinement) => facet.clearAttributes.includes(refinement.attribute)).length
            }, 0)

            return acc
        }, {})
    }, [items])
}

const flattenHierarchicalItems = (items, level = 0) => {
    return items.flatMap((item) => [
        { ...item, level },
        ...(item.data ? flattenHierarchicalItems(item.data, level + 1) : []),
    ])
}

const filterOptions = (items, query) => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return items

    return items.filter((item) => String(item.label).toLowerCase().includes(normalizedQuery))
}

const formatOptionLabel = (label: string) => {
    const parts = String(label || '').split(' > ')
    return parts[parts.length - 1] || label
}

const formatRefinementLabel = (label: string) => {
    const value = String(label || '').replace(/\s*>\s*/g, ' / ')
    return value.length > 28 ? `${value.slice(0, 26)}...` : value
}

export default FilterBottomSheet
