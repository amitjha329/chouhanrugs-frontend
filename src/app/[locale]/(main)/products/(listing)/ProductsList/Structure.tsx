// @ts-nocheck
'use client'
import React, { useState } from 'react'
import SideBarSectionLayout from './Filter/SideBarSectionLayout'
import RangeSlider from './Filter/RangeSlider'
import { FaAngleDown } from 'react-icons/fa'
import { ClearRefinements, CurrentRefinements, HierarchicalMenu, RefinementList, ToggleRefinement } from 'react-instantsearch'
import FilterBottomSheet from './Filter/Mobile/FilterBottomSheet'
import Currency from '@/types/Currency'

const StructureListing = ({ children, userCurrency }: {
    children: React.ReactNode,
    userCurrency: Currency
}) => {
    const [filterSheetOpen, setFilterSheetOpen] = useState(false)



    const filterBottomSheetToggle = () => {
        setFilterSheetOpen(!filterSheetOpen)
    }

    const hierarchicalCategoryAttributes = [
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2',
        'hierarchicalCategories.lvl3',
    ]

    return (
        <>
            <div className="flex md:hidden justify-between border">
                <CurrentRefinements classNames={{
                    item: "text-primary rounded-full bg-secondary px-3 py-1 mr-1 min-w-max text-xs",
                    list: "flex p-4",
                    root: "overflow-x-scroll no-scrollbar",
                    delete: "border border-black rounded-full text-xs ml-2 w-5 h-5"
                }} />
                {/* <SelectedFilters allColors={allColors} allSizes={allSizes} brandList={brandList} categories={categories} selectedBrands={selectedBrands} selectedColors={selectedColors} selectedSizes={selectedSizes} allPatterns={allPatterns} allShapes={allShapes} selectedPatterns={selectedPatterns} selectedShapes={selectedShapes} /> */}
                <div className="flex p-4 items-center pl-3 border-l radial-click" onClick={filterBottomSheetToggle}>
                    <span className="text-gray-700">Filter</span>
                    <FaAngleDown className="ml-2 h-5 w-5" />
                </div>
            </div>
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
                        <HierarchicalMenu attributes={hierarchicalCategoryAttributes} limit={100} classNames={{
                            list: "space-y-1",
                            childList: "ml-4 mt-1 space-y-1 border-l border-primary/10 pl-3",
                            item: "rounded-md",
                            selectedItem: "bg-secondary text-primary",
                            parentItem: "font-medium",
                            link: "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm capitalize text-gray-700 hover:bg-secondary",
                            label: "truncate",
                            count: "rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500"
                        }} />
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
            <FilterBottomSheet filterSheetOpen={filterSheetOpen} toggleOpenCallback={filterBottomSheetToggle} userCurrency={userCurrency} />
        </>
    )
}

export default StructureListing
