// @ts-nocheck
'use client'
import React, { useState } from 'react'
import SideBarSectionLayout from './Filter/SideBarSectionLayout'
import RangeSlider from './Filter/RangeSlider'
import { FiFilter } from 'react-icons/fi'
import { ClearRefinements, CurrentRefinements, RefinementList, ToggleRefinement, useCurrentRefinements, useHierarchicalMenu, useInstantSearch } from 'react-instantsearch'
import FilterBottomSheet from './Filter/Mobile/FilterBottomSheet'
import Currency from '@/types/Currency'
import CategoriesDataModel from '@/types/CategoriesDataModel'

const MobileListingToolbar = ({ onOpen }: { onOpen: () => void }) => {
    const { items } = useCurrentRefinements()
    const activeFilterCount = items.length
    const hasAppliedFilters = activeFilterCount > 0

    return (
        <div className="container mx-auto px-3 pb-1 pt-3 sm:px-0 md:hidden">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-3 py-2.5 text-[#3f2a1b] shadow-[0_6px_14px_rgba(79,52,28,0.06)] transition active:scale-[0.99]"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7efe5] text-[#6c4624]">
                            <FiFilter className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-[13px] font-semibold leading-none">Filters</span>
                        {hasAppliedFilters && (
                            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#5b3315] px-1.5 text-[10px] font-bold leading-none text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {hasAppliedFilters && (
                    <div className="flex items-start gap-2 overflow-hidden">
                        <CurrentRefinements
                            classNames={{
                                root: 'min-w-0 flex-1 overflow-x-auto no-scrollbar',
                                list: 'flex items-center gap-2 pr-1',
                                item: 'flex min-w-max items-center gap-1 rounded-full border border-[#eadfd5] bg-[#f6eee5] px-2.5 py-1.5 text-[11px] font-medium text-[#4b3322] shadow-[0_3px_8px_rgba(79,52,28,0.04)]',
                                label: 'hidden',
                                category: 'flex items-center gap-1',
                                categoryLabel: 'leading-none',
                                delete: 'inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] leading-none text-[#7a4a1d]',
                            }}
                        />
                        <ClearRefinements
                            translations={{ resetButtonText: 'Clear All' }}
                            classNames={{
                                button: 'shrink-0 rounded-full px-1 py-1.5 text-[11px] font-semibold text-[#6c4624] underline decoration-[#c7ab93] underline-offset-4',
                                disabledButton: 'hidden',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

const StructureListing = ({ children, userCurrency, categories = [] }: {
    children: React.ReactNode,
    userCurrency: Currency,
    categories?: CategoriesDataModel[]
}) => {
    const [filterSheetOpen, setFilterSheetOpen] = useState(false)



    const filterBottomSheetToggle = () => {
        setFilterSheetOpen(!filterSheetOpen)
    }

    const categoryTree = buildCategoryTree(categories)

    return (
        <>
            <MobileListingToolbar onOpen={filterBottomSheetToggle} />
            <div className="container flex flex-row mx-auto ~py-5/10 px-3 sm:px-0 gap-x-4 no-scrollbar items-start">
                <div className="basis-1/6 hidden lg:block flex-grow-0 sticky bottom-0">
                    <div className="flex bg-secondary p-5 mb-5 items-center justify-between">
                        <div>Reset Filter</div>
                        <ClearRefinements aria-label='Clear' classNames={{
                            button: "btn",
                            disabledButton: "disabled:btn-outline"
                        }} />
                    </div>
                    {/* <div className="bg-gray-100 p-5 mb-5 flex items-center justify-between">
                        {/* <label className="border-gray-400">Customizable</label>
                        <div className="form-control">
                            <input type="checkbox" onChange={handleCustomizableCheck} className="checkbox" />
                        </div> */}
                    <ToggleRefinement attribute='productCustomizable' label='Customizable' classNames={{
                        checkbox: "toggle",
                        label: "w-full label",
                        labelText: "label-text",
                        root: "bg-secondary p-5 mb-5 flex items-center justify-between"
                    }} />
                    <SideBarSectionLayout title="Categories">
                        <CategoryTreeFilter categoryTree={categoryTree} />
                    </SideBarSectionLayout>
                    <SideBarSectionLayout title="Price">
                        <RangeSlider userCurrency={userCurrency} />
                        {/* <RangeInput attribute='productSellingPrice'  /> */}
                    </SideBarSectionLayout>
                    <SideBarSectionLayout title="Sizes">
                        {/* <CheckBoxSelector dataArray={allSizes} selectedItem={selectedSizes} checkHandler={handleSizeCheck} showAsAccordion={true} showMinFive={true} /> */}
                        <RefinementList attribute="variations.variationSize" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-primary hover:bg-accent",
                            count: "color-[grey]"
                        }} />
                    </SideBarSectionLayout>
                    <SideBarSectionLayout title="Colors">
                        {/* <RefinementList attribute="variations.variationColor" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-primary hover:bg-accent",
                            count: "color-[grey]"
                        }} /> */}
                        {/* <CheckBoxSelector dataArray={allColors} selectedItem={selectedColors} checkHandler={handleColorCheck} showAsAccordion={true} showMinFive={true} /> */}
                        <RefinementList attribute="variations.variationColor" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-primary hover:bg-accent",
                            count: "color-[grey]"
                        }} />
                        <></>
                    </SideBarSectionLayout>
                    <SideBarSectionLayout title="Brands">
                        {/* <CheckBoxSelector dataArray={brandList} selectedItem={selectedBrands} checkHandler={handleBrandCheck} /> */}
                        <RefinementList attribute="productBrand" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-primary hover:bg-accent",
                            count: "color-[grey]"
                        }} />
                    </SideBarSectionLayout>
                    <SideBarSectionLayout title="Shapes">
                        {/* <CheckBoxSelector dataArray={allShapes} selectedItem={selectedShapes} checkHandler={handleShapeCheck} /> */}
                        <RefinementList attribute="productShape.name" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-primary hover:bg-accent",
                            count: "color-[grey]"
                        }} />
                    </SideBarSectionLayout>
                    <SideBarSectionLayout title="Pattern">
                        {/* <CheckBoxSelector dataArray={allPatterns} selectedItem={selectedPatterns} checkHandler={handlePatternCheck} /> */}
                        <RefinementList attribute="productPattern.name" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-primary hover:bg-accent",
                            count: "color-[grey]"
                        }} />
                    </SideBarSectionLayout>
                </div>
                {children}
            </div>
            <FilterBottomSheet filterSheetOpen={filterSheetOpen} toggleOpenCallback={filterBottomSheetToggle} userCurrency={userCurrency} categoryTree={categoryTree} />
        </>
    )
}

const hierarchicalCategoryAttributes = [
    'hierarchicalCategories.lvl0',
    'hierarchicalCategories.lvl1',
    'hierarchicalCategories.lvl2',
    'hierarchicalCategories.lvl3',
]

const CategoryTreeFilter = ({ categoryTree }: { categoryTree: CategoryTreeNode[] }) => {
    const { refine } = useHierarchicalMenu({
        attributes: hierarchicalCategoryAttributes,
        limit: 100,
        showParentLevel: true,
    })
    const { indexUiState } = useInstantSearch()
    const selectedPath = indexUiState?.hierarchicalMenu?.['hierarchicalCategories.lvl0']?.[0]

    return (
        <div className="space-y-1">
            {categoryTree.map((node) => (
                <CategoryTreeItem key={node.path} node={node} selectedPath={selectedPath} onSelect={refine} />
            ))}
        </div>
    )
}

const CategoryTreeItem = ({ node, selectedPath, onSelect }: {
    node: CategoryTreeNode,
    selectedPath?: string,
    onSelect: (path: string) => void,
}) => {
    const isSelected = selectedPath === node.path
    const isInSelectedBranch = Boolean(selectedPath && selectedPath.startsWith(`${node.path} > `))

    return (
        <div>
            <button
                type="button"
                onClick={() => onSelect(node.path)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm capitalize transition-colors ${isSelected
                    ? 'border-[#b98454] bg-[#6c4624] text-white shadow-[0_10px_20px_rgba(108,70,36,0.16)]'
                    : isInSelectedBranch
                        ? 'border-[#ead7c2] bg-[#fbf4ec] text-[#6c4624]'
                        : 'border-transparent text-gray-700 hover:bg-secondary'}`}
                style={{ paddingLeft: `${12 + node.level * 14}px` }}
            >
                <span className="truncate font-medium">{node.name}</span>
                {(isSelected || isInSelectedBranch) && (
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${isSelected ? 'bg-white' : 'bg-[#b98454]'}`} />
                )}
            </button>
            {node.children.length > 0 && (
                <div className={`mt-1 space-y-1 border-l pl-1 ${isSelected || isInSelectedBranch ? 'border-[#d8b28f]' : 'border-primary/10'}`}>
                    {node.children.map((child) => (
                        <CategoryTreeItem key={child.path} node={child} selectedPath={selectedPath} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    )
}

export type CategoryTreeNode = {
    name: string,
    path: string,
    level: number,
    children: CategoryTreeNode[],
}

export const buildCategoryTree = (categories: CategoriesDataModel[] = []): CategoryTreeNode[] => {
    const nodes = categories
        .filter((category) => category?.active !== false && category?.name)
        .map((category) => {
            const ancestors = category.parent?.split('>').filter(Boolean) ?? []
            const path = [...ancestors, category.name].join(' > ')
            const parentPath = ancestors.join(' > ')

            return {
                name: category.name,
                path,
                parentPath,
                level: ancestors.length,
                children: [],
            }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

    const byParent = new Map<string, CategoryTreeNode[]>()

    nodes.forEach((node) => {
        const key = node.parentPath || '__root__'
        byParent.set(key, [...(byParent.get(key) ?? []), node])
    })

    const attachChildren = (node: CategoryTreeNode): CategoryTreeNode => ({
        ...node,
        children: (byParent.get(node.path) ?? []).map(attachChildren),
    })

    return (byParent.get('__root__') ?? []).map(attachChildren)
}

export default StructureListing
