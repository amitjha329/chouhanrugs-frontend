'use client'
import React, { ChangeEventHandler, SetStateAction, useState } from 'react'
import CheckBoxSelector from '../CheckBoxSelector'
import { Transition } from '@headlessui/react'
import { BiX } from 'react-icons/bi'
import CategoriesDataModel from '@/lib/types/CategoriesDataModel'
import BrandDataModel from '@/lib/types/BrandDataModel'
import SizeDataModel from '@/lib/types/SizeDataModel'
import ColorDataModel from '@/lib/types/ColorDataModel'
import RangeSlider from '../RangeSlider'
import SizeSelector from '../SizeSelector'
import ColorSelector from '../ColorSelector'
import ShapeDataModel from '@/lib/types/ShapeDataModel'
import PatternDataModel from '@/lib/types/PatternDataModel'
import FilterAccordion from '../FilterAccordion'
import { ClearRefinements, RefinementList, ToggleRefinement } from 'react-instantsearch'

const FilterBottomSheet = ({ filterSheetOpen, toggleOpenCallback }: {
    filterSheetOpen: boolean,
    toggleOpenCallback: React.MouseEventHandler
}) => {
    return (
        <Transition
            className={`fixed z-[99] top-0 left-0 bottom-0 right-0 overflow-hidden`}
            enter="transition-transform duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition-transform duration-300"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
            show={filterSheetOpen}
        >
            <div className="h-full w-full fixed bg-white flex flex-col justify-between">
                <div className="flex justify-between p-5 items-center shadow-md">
                    <div className="text-lg">Filter Options</div>
                    <BiX className="h-7 w-7" onClick={toggleOpenCallback} />
                </div>
                <div className="p-3 flex flex-col justify-start flex-grow overflow-y-auto">
                    <Container showAsAccordion accordionLable='Categories'>
                        <RefinementList attribute="productCategory" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-blue-900 hover:bg-blue-200",
                            count: "color-[grey]"
                        }} />
                    </Container>
                    <Container showAsAccordion accordionLable='Price'>
                        <RangeSlider />
                    </Container>
                    <Container showAsAccordion accordionLable='Customizable'>
                        <ToggleRefinement attribute='productCustomizable' label='Customizable' classNames={{
                            checkbox: "toggle",
                            label: "w-full label",
                            labelText: "label-text",
                            root: "flex items-center justify-between"
                        }} />
                    </Container>
                    <Container showAsAccordion accordionLable='Size'>
                        <RefinementList attribute="variations.variationSize" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-blue-900 hover:bg-blue-200",
                            count: "color-[grey]",
                        }} />
                    </Container>
                    <Container showAsAccordion accordionLable='Brands'>
                        <RefinementList attribute="productBrand" showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-blue-900 hover:bg-blue-200",
                            count: "color-[grey]"
                        }} />
                    </Container>
                    <Container showAsAccordion accordionLable='Shape'>
                        <RefinementList attribute="productShape.name" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-blue-900 hover:bg-blue-200",
                            count: "color-[grey]"
                        }} />
                    </Container>
                    <Container showAsAccordion accordionLable='Pattern'>
                        <RefinementList attribute="productPattern.name" showMoreLimit={100} limit={5} showMore classNames={{
                            checkbox: "checkbox",
                            label: "label cursor-pointer",
                            labelText: "label-text capitalize",
                            showMore: "border flex w-full p-4 justify-between items-center text-left text-md font-normal text-blue-900 hover:bg-blue-200",
                            count: "color-[grey]"
                        }} />
                    </Container>
                    {/* <CheckBoxSelector dataArray={categories} selectedItem={selectedCategories} checkHandler={catCheckHandle} showAsAccordion={true} accordionTitle="Categories" />
                    <div className="border rounded  p-5 mb-5 flex items-center justify-between">
                        <label className="text-[#233876]">Customizable</label>
                        <div className="form-control">
                            <input type="checkbox" onChange={customizableCheckHandle} className="checkbox" />
                        </div>
                    </div>
                    <RangeSlider />
                    <SizeSelector allSizeList={allSizes} selectedSizes={selectedSizes} checkHandler={sizeCheckHandle} showAsAccordion={true} accordionTitle="Sizes" />
                    <ColorSelector allColorList={allColors} selectedColors={selectedColors} checkHandler={colorCheckHandle} showAsAccordion={true} accordionTitle="Colors" />
                    <CheckBoxSelector dataArray={brandList} selectedItem={selectedBrands} checkHandler={brandCheckHandle} showAsAccordion={true} accordionTitle="Brands" />
                    <CheckBoxSelector dataArray={allShapes} selectedItem={selectedShapes} checkHandler={handleShapeCheck} showAsAccordion accordionTitle='Shapes' />
                    <CheckBoxSelector dataArray={allPatterns} selectedItem={selectedPatterns} checkHandler={handlePatternCheck} showAsAccordion accordionTitle='Patterns' /> */}
                </div>
                <div className="flex p-3 border-t join join-horizontal gap-4">
                    <ClearRefinements aria-labelledby='Clear' aria-label='Clear' about='Clear' title='Clear' classNames={{
                        button: "join-item btn btn-outline grow",
                        disabledButton: "disabled:btn-outline"
                    }} />
                    <button className="join-item btn grow btn-primary" onClick={toggleOpenCallback}>Close</button>
                </div>
            </div>
        </Transition>
    )
}

const Container = ({ children, showAsAccordion, accordionLable }: { showAsAccordion?: boolean, children: React.ReactNode, accordionLable?: string }) => {
    return <>
        {
            showAsAccordion ?
                <FilterAccordion title={accordionLable ?? ""}>
                    {children}
                </FilterAccordion> : children
        }
    </>
}

export default FilterBottomSheet