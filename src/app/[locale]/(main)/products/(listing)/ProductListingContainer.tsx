'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import {
    FiFilter,
    FiX,
    FiChevronRight,
    FiArrowLeft,
    FiGrid,
    FiDollarSign,
    FiEdit3,
    FiMaximize,
    FiDroplet,
    FiShoppingBag,
    FiCircle,
    FiBox,
    FiSliders,
} from 'react-icons/fi'
import { Slider, SliderOutput, SliderThumb, SliderTrack, Label } from 'react-aria-components'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import { DEFAULT_USD_CURRENCY } from '@/lib/defaultCurrency'
import type { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import type CategoriesDataModel from '@/types/CategoriesDataModel'

// --- Types ---
type FacetKind = 'hierarchical' | 'list' | 'toggle' | 'range'

type FacetConfig = {
    id: string
    title: string
    searchPlaceholder?: string
    kind: FacetKind
    attribute: string
    icon: React.ComponentType<{ className?: string }>
}

const FACETS_CONFIG: FacetConfig[] = [
    {
        id: 'price',
        title: 'Price',
        kind: 'range',
        attribute: 'productSellingPrice',
        icon: FiDollarSign,
    },
    {
        id: 'customizable',
        title: 'Customizable',
        kind: 'toggle',
        attribute: 'productCustomizable',
        icon: FiEdit3,
    },
    {
        id: 'size',
        title: 'Size',
        searchPlaceholder: 'Search size',
        kind: 'list',
        attribute: 'variations.variationSize',
        icon: FiMaximize,
    },
    {
        id: 'color',
        title: 'Color',
        searchPlaceholder: 'Search color',
        kind: 'list',
        attribute: 'variations.variationColor',
        icon: FiDroplet,
    },
    {
        id: 'brand',
        title: 'Brands',
        searchPlaceholder: 'Search brand',
        kind: 'list',
        attribute: 'productBrand',
        icon: FiShoppingBag,
    },
    {
        id: 'shape',
        title: 'Shape',
        searchPlaceholder: 'Search shape',
        kind: 'list',
        attribute: 'productShape.name',
        icon: FiCircle,
    },
    {
        id: 'pattern',
        title: 'Pattern',
        searchPlaceholder: 'Search pattern',
        kind: 'list',
        attribute: 'productPattern.name',
        icon: FiBox,
    },
]

type CategoryTreeNode = {
    name: string
    path: string
    slug?: string
    level: number
    children: CategoryTreeNode[]
}

// --- Category Tree Builder ---
const buildCategoryTree = (categories: CategoriesDataModel[] = []): CategoryTreeNode[] => {
    const nodes = categories
        .filter((category) => category?.active !== false && category?.name)
        .map((category) => {
            const ancestors = category.parent?.split('>').filter(Boolean) ?? []
            const path = [...ancestors, category.name].join(' > ')
            const parentPath = ancestors.join(' > ')

            return {
                name: category.name,
                path,
                slug: category.slug,
                parentPath,
                level: ancestors.length,
                children: [],
            }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

    const byParent = new Map<string, any[]>()

    nodes.forEach((node) => {
        const key = node.parentPath || '__root__'
        byParent.set(key, [...(byParent.get(key) ?? []), node])
    })

    const attachChildren = (node: any): CategoryTreeNode => ({
        name: node.name,
        path: node.path,
        slug: node.slug,
        level: node.level,
        children: (byParent.get(node.path) ?? []).map(attachChildren),
    })

    return (byParent.get('__root__') ?? []).map(attachChildren)
}

export default function ProductListingContainer({
    products,
    facets,
    totalHits,
    totalPages,
    currentPage,
    categories,
    categoryPath = '',
    children,
}: {
    products: ProductDataModelWithColorMap[]
    facets: Record<string, Record<string, number>>
    totalHits: number
    totalPages: number
    currentPage: number
    categories: CategoriesDataModel[]
    categoryPath?: string
    children?: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])

    // --- Active Filters parsing ---
    const activeFilters = useMemo(() => {
        const filters: { id: string; name: string; value: string; label: string }[] = []
        searchParams.forEach((val, key) => {
            if (key === 'page' || key === 'search') return
            const values = val.split(',').filter(Boolean)
            values.forEach((v) => {
                const config = FACETS_CONFIG.find((f) => f.id === key || f.attribute === key)
                const title = config ? config.title : key
                filters.push({
                    id: key,
                    name: title,
                    value: v,
                    label: `${title}: ${v}`,
                })
            })
        })
        return filters
    }, [searchParams])

    const handleClearFilters = () => {
        const params = new URLSearchParams()
        // Retain the search query if present
        const search = searchParams.get('search')
        if (search) params.set('search', search)
        
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const handleRemoveFilterItem = (id: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const val = params.get(id)
        if (!val) return

        const updated = val
            .split(',')
            .filter((v) => v !== value)
            .join(',')

        if (updated) {
            params.set(id, updated)
        } else {
            params.delete(id)
        }
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const toggleFilterValue = (id: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const val = params.get(id)
        let values = val ? val.split(',').filter(Boolean) : []

        if (values.includes(value)) {
            values = values.filter((v) => v !== value)
        } else {
            values.push(value)
        }

        if (values.length > 0) {
            params.set(id, values.join(','))
        } else {
            params.delete(id)
        }
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const toggleCustomizable = (checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        if (checked) {
            params.set('customizable', 'true')
        } else {
            params.delete('customizable')
        }
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const handlePriceChangeEnd = (val: number[]) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('price', `${val[0]}-${val[1]}`)
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(page + 1))
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    // Convert facet counts to sorted lists
    const sizeOptions = useMemo(() => Object.entries(facets['variations.variationSize'] || {}).map(([v, c]) => ({ value: v, count: c })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)), [facets])
    const colorOptions = useMemo(() => Object.entries(facets['variations.variationColor'] || {}).map(([v, c]) => ({ value: v, count: c })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)), [facets])
    const brandOptions = useMemo(() => Object.entries(facets['productBrand'] || {}).map(([v, c]) => ({ value: v, count: c })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)), [facets])
    const shapeOptions = useMemo(() => Object.entries(facets['productShape.name'] || {}).map(([v, c]) => ({ value: v, count: c })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)), [facets])
    const patternOptions = useMemo(() => Object.entries(facets['productPattern.name'] || {}).map(([v, c]) => ({ value: v, count: c })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)), [facets])

    return (
        <>
            {/* Mobile Bottom Sheet Filter Toggle Trigger */}
            <div className="container mx-auto px-3 pb-1 pt-3 sm:px-0 md:hidden">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-3 py-2.5 text-[#3f2a1b] shadow-[0_6px_14px_rgba(79,52,28,0.06)] transition active:scale-[0.99]"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7efe5] text-[#6c4624]">
                                <FiFilter className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <span className="text-[13px] font-semibold leading-none">Filters</span>
                            {activeFilters.length > 0 && (
                                <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#5b3315] px-1.5 text-[10px] font-bold leading-none text-white">
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex items-start gap-2 overflow-hidden">
                            <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 pr-1">
                                {activeFilters.map((filter) => (
                                    <button
                                        key={`${filter.id}-${filter.value}`}
                                        type="button"
                                        onClick={() => handleRemoveFilterItem(filter.id, filter.value)}
                                        className="flex min-w-max items-center gap-1 rounded-full border border-[#eadfd5] bg-[#f6eee5] px-2.5 py-1.5 text-[11px] font-medium text-[#4b3322] shadow-[0_3px_8px_rgba(79,52,28,0.04)]"
                                    >
                                        <span>{filter.value}</span>
                                        <FiX className="h-3.5 w-3.5 text-[#7a4a1d]" />
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="shrink-0 rounded-full px-1 py-1.5 text-[11px] font-semibold text-[#6c4624] underline decoration-[#c7ab93] underline-offset-4"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop layout */}
            <div className="container flex flex-row mx-auto ~py-5/10 px-3 sm:px-0 gap-x-4 no-scrollbar items-start">
                {/* Desktop Sidebar Filters */}
                <div className="basis-1/6 hidden lg:block flex-grow-0 sticky bottom-0">
                    <div className="flex bg-secondary p-5 mb-5 items-center justify-between">
                        <div>Reset Filter</div>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            disabled={activeFilters.length === 0}
                            className="btn disabled:btn-outline"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="bg-secondary p-5 mb-5 flex items-center justify-between">
                        <span className="label-text">Customizable</span>
                        <input
                            type="checkbox"
                            checked={searchParams.get('customizable') === 'true'}
                            onChange={(e) => toggleCustomizable(e.target.checked)}
                            className="toggle"
                        />
                    </div>

                    <SideBarSection title="Categories">
                        <CategoryTreeFilter categoryTree={categoryTree} selectedPath={categoryPath} />
                    </SideBarSection>

                    <SideBarSection title="Price">
                        <PriceRangeSlider
                            userCurrency={DEFAULT_USD_CURRENCY}
                            activePrice={searchParams.get('price')}
                            onChangeEnd={handlePriceChangeEnd}
                        />
                    </SideBarSection>

                    <SideBarSection title="Sizes">
                        <ListFacetFilter
                            options={sizeOptions}
                            activeValues={searchParams.get('size')?.split(',').filter(Boolean) ?? []}
                            onToggle={(v) => toggleFilterValue('size', v)}
                        />
                    </SideBarSection>

                    <SideBarSection title="Colors">
                        <ListFacetFilter
                            options={colorOptions}
                            activeValues={searchParams.get('color')?.split(',').filter(Boolean) ?? []}
                            onToggle={(v) => toggleFilterValue('color', v)}
                        />
                    </SideBarSection>

                    <SideBarSection title="Brands">
                        <ListFacetFilter
                            options={brandOptions}
                            activeValues={searchParams.get('brand')?.split(',').filter(Boolean) ?? []}
                            onToggle={(v) => toggleFilterValue('brand', v)}
                        />
                    </SideBarSection>

                    <SideBarSection title="Shapes">
                        <ListFacetFilter
                            options={shapeOptions}
                            activeValues={searchParams.get('shape')?.split(',').filter(Boolean) ?? []}
                            onToggle={(v) => toggleFilterValue('shape', v)}
                        />
                    </SideBarSection>

                    <SideBarSection title="Pattern">
                        <ListFacetFilter
                            options={patternOptions}
                            activeValues={searchParams.get('pattern')?.split(',').filter(Boolean) ?? []}
                            onToggle={(v) => toggleFilterValue('pattern', v)}
                        />
                    </SideBarSection>
                </div>

                {/* Main Content Area */}
                <div className="lg:basis-5/6 w-full flex flex-col gap-6">
                    {children}

                    {searchParams.get('search') && (
                        <div className="w-full text-start font-semibold text-lg">
                            Showing Results for &quot;{searchParams.get('search')}&quot;
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ~gap-3/7">
                        {products.map((product, index) => (
                            <ProductCardItem
                                key={(product._id || product.objectID).toString()}
                                index={index}
                                {...product}
                            />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="w-full min-h-[500px] flex items-center justify-center">
                            <span className="text-2xl sm:text-5xl font-extrabold opacity-50 text-center">
                                OOPS! <br /> Nothing Found.
                            </span>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>

            {/* Mobile Bottom Sheet Filters Dialog */}
            {mobileFiltersOpen && (
                <MobileFiltersSheet
                    onClose={() => setMobileFiltersOpen(false)}
                    activeFilters={activeFilters}
                    facets={facets}
                    categoryTree={categoryTree}
                    categoryPath={categoryPath}
                    searchParams={searchParams}
                    totalHits={totalHits}
                    toggleFilterValue={toggleFilterValue}
                    toggleCustomizable={toggleCustomizable}
                    handlePriceChangeEnd={handlePriceChangeEnd}
                    handleClearFilters={handleClearFilters}
                />
            )}
        </>
    )
}

// --- Helper UI Components ---

function SideBarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border border-secondary p-5 mb-5 rounded-md bg-white">
            <h3 className="font-semibold text-lg border-b border-primary/10 pb-2 mb-4 text-[#332215]">{title}</h3>
            {children}
        </div>
    )
}

function CategoryTreeFilter({
    categoryTree,
    selectedPath,
}: {
    categoryTree: CategoryTreeNode[]
    selectedPath: string
}) {
    return (
        <div className="space-y-1">
            {categoryTree.map((node) => (
                <CategoryTreeItem key={node.path} node={node} selectedPath={selectedPath} />
            ))}
        </div>
    )
}

function CategoryTreeItem({
    node,
    selectedPath,
}: {
    node: CategoryTreeNode
    selectedPath: string
}) {
    const isSelected = selectedPath === node.path
    const isInSelectedBranch = Boolean(selectedPath && selectedPath.startsWith(`${node.path} > `))
    const linkHref = `/products/category/${node.slug || encodeURIComponent(node.name)}`

    return (
        <div>
            <a
                href={linkHref}
                className={clsx(
                    'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm capitalize transition-colors',
                    isSelected
                        ? 'border-[#b98454] bg-[#6c4624] text-white shadow-[0_10px_20px_rgba(108,70,36,0.16)]'
                        : isInSelectedBranch
                        ? 'border-[#ead7c2] bg-[#fbf4ec] text-[#6c4624]'
                        : 'border-transparent text-gray-700 hover:bg-secondary'
                )}
                style={{ paddingLeft: `${12 + node.level * 14}px` }}
            >
                <span className="truncate font-medium">{node.name}</span>
                {(isSelected || isInSelectedBranch) && (
                    <span className={clsx('h-2.5 w-2.5 shrink-0 rounded-full', isSelected ? 'bg-white' : 'bg-[#b98454]')} />
                )}
            </a>
            {node.children.length > 0 && (
                <div className={clsx('mt-1 space-y-1 border-l pl-1', isSelected || isInSelectedBranch ? 'border-[#d8b28f]' : 'border-primary/10')}>
                    {node.children.map((child) => (
                        <CategoryTreeItem key={child.path} node={child} selectedPath={selectedPath} />
                    ))}
                </div>
            )}
        </div>
    )
}

function PriceRangeSlider({
    userCurrency,
    activePrice,
    onChangeEnd,
}: {
    userCurrency: typeof DEFAULT_USD_CURRENCY
    activePrice: string | null
    onChangeEnd: (val: number[]) => void
}) {
    // Static price range boundaries in USD
    const min = 0
    const max = 2000

    const currentRange = useMemo(() => {
        if (!activePrice) return [min, max]
        const [pMin, pMax] = activePrice.split('-').map(Number)
        return [isNaN(pMin) ? min : pMin, isNaN(pMax) ? max : pMax]
    }, [activePrice])

    const [value, setValue] = useState(currentRange)

    useEffect(() => {
        setValue(currentRange)
    }, [currentRange])

    return (
        <Slider
            aria-label="Price"
            minValue={min}
            maxValue={max}
            value={value}
            onChange={setValue}
            onChangeEnd={onChangeEnd}
            className="grid w-full grid-cols-[1fr_auto] flex-col items-center gap-3"
        >
            <Label className="text-sm font-semibold text-[#2c211a]">Price Range</Label>
            <SliderOutput className="text-sm font-semibold text-[#6c4624]">
                {({ state }) =>
                    state.values
                        .map(
                            (_, i) =>
                                `${userCurrency.currencySymbol} ` +
                                (Number(state.getThumbValueLabel(i)) * (userCurrency.exchangeRates ?? 1) << 0)
                        )
                        .join(' - ')}
            </SliderOutput>
            <SliderTrack className="group col-span-2 flex h-8 items-center">
                {({ state, isDisabled }) => (
                    <>
                        <div
                            className={clsx(
                                'h-[5px] w-full rounded-full',
                                isDisabled ? 'bg-[#eee6dd]' : 'bg-[#dccfc4]'
                            )}
                        />
                        {state.values.map((_, i) => (
                            <SliderThumb
                                key={i}
                                index={i}
                                className={({ isDragging, isDisabled }) =>
                                    clsx(
                                        'mt-8 h-6 w-6 rounded-full border-2 border-[#6c4624] bg-white shadow-[0_4px_12px_rgba(108,70,36,0.22)] outline-none ring-offset-2 transition-transform focus-visible:ring-2 focus-visible:ring-[#6c4624]/35',
                                        isDisabled && 'border-[#cdb9a7]',
                                        isDragging && 'scale-110 bg-[#f4ebe4]'
                                    )
                                }
                            />
                        ))}
                    </>
                )}
            </SliderTrack>
        </Slider>
    )
}

function ListFacetFilter({
    options,
    activeValues,
    onToggle,
}: {
    options: { value: string; count: number }[]
    activeValues: string[]
    onToggle: (value: string) => void
}) {
    const [showMore, setShowMore] = useState(false)
    const limit = 5
    const visibleOptions = showMore ? options : options.slice(0, limit)

    if (options.length === 0) return <div className="text-xs text-gray-400">No filter options available</div>

    return (
        <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
            {visibleOptions.map((opt) => {
                const isChecked = activeValues.includes(opt.value)
                return (
                    <label key={opt.value} className="label cursor-pointer flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => onToggle(opt.value)}
                                className="checkbox"
                            />
                            <span className="label-text capitalize truncate max-w-[120px]">{opt.value}</span>
                        </div>
                        <span className="text-xs text-gray-400">({opt.count})</span>
                    </label>
                )
            })}
            {options.length > limit && (
                <button
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    className="border flex w-full p-2 justify-between items-center text-left text-xs font-normal text-primary hover:bg-accent rounded"
                >
                    {showMore ? 'Show Less' : `Show More (${options.length - limit})`}
                </button>
            )}
        </div>
    )
}

function Pagination({
    totalPages,
    currentPage,
    onPageChange,
}: {
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
}) {
    const pages = Array.from({ length: totalPages }, (_, i) => i)
    const isFirstPage = currentPage === 0
    const isLastPage = currentPage === totalPages - 1

    return (
        <nav aria-label="Product pagination" className="mt-6 flex items-center justify-end gap-2">
            <button
                type="button"
                className="btn max-sm:btn-sm btn-outline btn-primary"
                disabled={isFirstPage}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Prev
            </button>
            <div className="join">
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={clsx(
                            'btn max-sm:btn-sm btn-outline btn-primary join-item',
                            page === currentPage && 'btn-disabled'
                        )}
                        disabled={page === currentPage}
                        onClick={() => onPageChange(page)}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>
            <button
                type="button"
                className="btn max-sm:btn-sm btn-outline btn-primary"
                disabled={isLastPage}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </nav>
    )
}

// --- Mobile Bottom Sheet Filters Implementation ---

function MobileFiltersSheet({
    onClose,
    activeFilters,
    facets,
    categoryTree,
    categoryPath,
    searchParams,
    totalHits,
    toggleFilterValue,
    toggleCustomizable,
    handlePriceChangeEnd,
    handleClearFilters,
}: {
    onClose: () => void
    activeFilters: any[]
    facets: Record<string, Record<string, number>>
    categoryTree: CategoryTreeNode[]
    categoryPath: string
    searchParams: any
    totalHits: number
    toggleFilterValue: (id: string, value: string) => void
    toggleCustomizable: (checked: boolean) => void
    handlePriceChangeEnd: (val: number[]) => void
    handleClearFilters: () => void
}) {
    const [activeScreen, setActiveScreen] = useState<string | null>(null)
    const activeFacet = FACETS_CONFIG.find((f) => f.id === activeScreen)

    return (
        <div className="fixed inset-0 z-[10050] md:hidden">
            <button
                type="button"
                aria-label="Close filters"
                className="absolute inset-0 bg-[#21140d]/45 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Product filters"
                className="absolute inset-x-0 bottom-0 flex h-[88dvh] flex-col overflow-hidden rounded-t-2xl border border-[#eadfd5] bg-[#fffdf9] shadow-[0_-18px_46px_rgba(33,20,13,0.20)]"
            >
                <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[#dccfc4]" />

                {activeScreen === 'categories' ? (
                    <MobileCategoryScreen
                        categoryTree={categoryTree}
                        categoryPath={categoryPath}
                        onBack={() => setActiveScreen(null)}
                        onClose={onClose}
                    />
                ) : activeFacet ? (
                    <MobileFacetOptionsScreen
                        facet={activeFacet}
                        facets={facets}
                        searchParams={searchParams}
                        onBack={() => setActiveScreen(null)}
                        onClose={onClose}
                        toggleFilterValue={toggleFilterValue}
                        toggleCustomizable={toggleCustomizable}
                        handlePriceChangeEnd={handlePriceChangeEnd}
                    />
                ) : (
                    <MobileMainScreen
                        onClose={onClose}
                        onScreenSelect={setActiveScreen}
                        activeFilters={activeFilters}
                        handleClearFilters={handleClearFilters}
                        totalHits={totalHits}
                        searchParams={searchParams}
                    />
                )}
            </aside>
        </div>
    )
}

function MobileMainScreen({
    onClose,
    onScreenSelect,
    activeFilters,
    handleClearFilters,
    totalHits,
    searchParams,
}: {
    onClose: () => void
    onScreenSelect: (id: string) => void
    activeFilters: any[]
    handleClearFilters: () => void
    totalHits: number
    searchParams: any
}) {
    return (
        <>
            <header className="flex items-center justify-between gap-3 border-b border-[#f1e8df] px-4 pb-3 pt-4">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4ebe4] text-[#6c4624]">
                        <FiSliders className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h2 className="text-lg font-bold leading-none text-[#20160f]">Filters</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClearFilters}
                        disabled={activeFilters.length === 0}
                        className="text-xs font-bold text-[#4b3322] underline-offset-4 hover:underline disabled:opacity-40"
                    >
                        Clear All
                    </button>
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                    >
                        <FiX className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 pb-3 pt-3">
                {activeFilters.length > 0 ? (
                    <section className="rounded-xl border border-[#f1e8df] bg-white p-3 shadow-[0_8px_22px_rgba(69,42,22,0.04)] mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8b7868] mb-2">
                            Applied Filters ({activeFilters.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {activeFilters.map((f) => (
                                <span
                                    key={`${f.id}-${f.value}`}
                                    className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#f4ebe4] px-2.5 py-1.5 text-[11px] font-semibold text-[#35251a]"
                                >
                                    <span className="truncate">{f.value}</span>
                                </span>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="rounded-xl border border-dashed border-[#eadfd5] bg-white px-3 py-2.5 mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8b7868]">Applied Filters</p>
                        <p className="mt-0.5 text-xs font-medium text-[#5f5046]">No filters selected yet.</p>
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-[#f1e8df] bg-white shadow-[0_10px_24px_rgba(69,42,22,0.04)]">
                    <button
                        type="button"
                        onClick={() => onScreenSelect('categories')}
                        className="flex min-h-[54px] w-full items-center justify-between gap-3 border-b border-[#f1e8df] px-3.5 text-left active:bg-[#fff7ef]"
                    >
                        <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff7ef] text-[#6c4624]">
                                <FiGrid className="h-4 w-4" />
                            </span>
                            <span className="truncate text-[13px] font-bold text-[#20160f]">Categories</span>
                        </span>
                        <FiChevronRight className="h-4 w-4 text-[#6c4624]" />
                    </button>

                    {FACETS_CONFIG.map((facet) => {
                        const Icon = facet.icon
                        const activeVal = searchParams.get(facet.id)
                        const count = activeVal ? activeVal.split(',').filter(Boolean).length : 0

                        return (
                            <button
                                key={facet.id}
                                type="button"
                                onClick={() => onScreenSelect(facet.id)}
                                className="flex min-h-[54px] w-full items-center justify-between gap-3 border-b border-[#f1e8df] px-3.5 text-left last:border-b-0 active:bg-[#fff7ef]"
                            >
                                <span className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff7ef] text-[#6c4624]">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span>
                                        <span className="block truncate text-[13px] font-bold text-[#20160f]">{facet.title}</span>
                                        {count > 0 && (
                                            <span className="mt-0.5 block text-[11px] font-semibold text-[#8b7868]">
                                                {count} selected
                                            </span>
                                        )}
                                    </span>
                                </span>
                                <FiChevronRight className="h-4 w-4 text-[#6c4624]" />
                            </button>
                        )
                    })}
                </div>
            </main>

            <footer className="border-t border-[#f1e8df] bg-[#fffdf9]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_26px_rgba(69,42,22,0.07)] backdrop-blur">
                <button
                    type="button"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#6c4624] px-3 text-xs font-bold text-white shadow-[0_10px_18px_rgba(108,70,36,0.24)]"
                    onClick={onClose}
                >
                    Show Results ({totalHits.toLocaleString()})
                </button>
            </footer>
        </>
    )
}

function MobileCategoryScreen({
    categoryTree,
    categoryPath,
    onBack,
    onClose,
}: {
    categoryTree: CategoryTreeNode[]
    categoryPath: string
    onBack: () => void
    onClose: () => void
}) {
    return (
        <>
            <header className="flex items-center justify-between gap-3 border-b border-[#f1e8df] px-4 pb-3 pt-4">
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                    >
                        <FiArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="truncate text-lg font-bold leading-none text-[#20160f]">Categories</h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                >
                    <FiX className="h-5 w-5" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 pb-3 pt-3">
                <CategoryTreeFilter categoryTree={categoryTree} selectedPath={categoryPath} />
            </main>
        </>
    )
}

function MobileFacetOptionsScreen({
    facet,
    facets,
    searchParams,
    onBack,
    onClose,
    toggleFilterValue,
    toggleCustomizable,
    handlePriceChangeEnd,
}: {
    facet: FacetConfig
    facets: Record<string, Record<string, number>>
    searchParams: any
    onBack: () => void
    onClose: () => void
    toggleFilterValue: (id: string, value: string) => void
    toggleCustomizable: (checked: boolean) => void
    handlePriceChangeEnd: (val: number[]) => void
}) {
    const [searchVal, setSearchVal] = useState('')

    const options = useMemo(() => {
        return Object.entries(facets[facet.attribute] || {})
            .map(([v, c]) => ({ value: v, count: c }))
            .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
    }, [facets, facet.attribute])

    const filteredOptions = useMemo(() => {
        const query = searchVal.trim().toLowerCase()
        if (!query) return options
        return options.filter((opt) => opt.value.toLowerCase().includes(query))
    }, [options, searchVal])

    const activeVals = searchParams.get(facet.id)?.split(',').filter(Boolean) ?? []

    return (
        <>
            <header className="flex items-center justify-between gap-3 border-b border-[#f1e8df] px-4 pb-3 pt-4">
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                    >
                        <FiArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="truncate text-lg font-bold leading-none text-[#20160f]">{facet.title}</h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#20160f]"
                >
                    <FiX className="h-5 w-5" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 pb-3 pt-3">
                {facet.kind === 'range' && (
                    <div className="rounded-xl border border-[#f1e8df] bg-white p-3.5 shadow-[0_10px_24px_rgba(69,42,22,0.04)]">
                        <PriceRangeSlider
                            userCurrency={DEFAULT_USD_CURRENCY}
                            activePrice={searchParams.get('price')}
                            onChangeEnd={handlePriceChangeEnd}
                        />
                    </div>
                )}

                {facet.kind === 'toggle' && (
                    <div className="flex items-center justify-between p-3.5 bg-white border border-[#f1e8df] rounded-xl shadow-[0_10px_24px_rgba(69,42,22,0.04)]">
                        <span className="text-[13px] font-bold text-[#20160f]">{facet.title}</span>
                        <input
                            type="checkbox"
                            checked={searchParams.get('customizable') === 'true'}
                            onChange={(e) => toggleCustomizable(e.target.checked)}
                            className="toggle"
                        />
                    </div>
                )}

                {facet.kind === 'list' && (
                    <div className="space-y-3">
                        {facet.searchPlaceholder && (
                            <label className="flex h-11 items-center gap-2.5 rounded-lg border border-[#eadfd5] bg-white px-3 shadow-[0_8px_20px_rgba(69,42,22,0.04)]">
                                <span className="text-[#8b7868]">🔍</span>
                                <input
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    placeholder={facet.searchPlaceholder}
                                    className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#2c211a] outline-none placeholder:text-[#9a8a7c]"
                                />
                            </label>
                        )}
                        <div className="space-y-1 max-h-[350px] overflow-y-auto no-scrollbar">
                            {filteredOptions.map((opt) => {
                                const isChecked = activeVals.includes(opt.value)
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => toggleFilterValue(facet.id, opt.value)}
                                        className="grid min-h-[50px] w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg px-1 text-left active:bg-[#fff7ef]"
                                    >
                                        <span
                                            className={clsx(
                                                'flex h-6 w-6 shrink-0 items-center justify-center rounded border text-white transition-colors',
                                                isChecked ? 'border-[#6c4624] bg-[#6c4624]' : 'border-[#d7cabf] bg-white'
                                            )}
                                        >
                                            {isChecked && <span className="h-3 w-1.5 rotate-45 border-b-2 border-r-2 border-white" />}
                                        </span>
                                        <span className="min-w-0 truncate text-[13px] font-semibold text-[#2c211a]">
                                            {opt.value}
                                        </span>
                                        <span className="shrink-0 text-xs font-semibold text-[#5f5046]">
                                            ({opt.count.toLocaleString()})
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-[#f1e8df] bg-[#fffdf9]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_26px_rgba(69,42,22,0.07)] backdrop-blur">
                <button
                    type="button"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#6c4624] px-3 text-xs font-bold text-white shadow-[0_10px_18px_rgba(108,70,36,0.24)]"
                    onClick={onBack}
                >
                    Apply
                </button>
            </footer>
        </>
    )
}
