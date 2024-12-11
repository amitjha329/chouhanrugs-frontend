// @ts-nocheck
'use client'
import { Disclosure, Transition } from "@headlessui/react"
import { ChangeEventHandler } from "react"
import { BiChevronsDown } from "react-icons/bi"
import FilterAccordion from "./FilterAccordion"
import CategoriesDataModel from "@/types/CategoriesDataModel"
import ColorDataModel from "@/types/ColorDataModel"
import SizeDataModel from "@/types/SizeDataModel"
import BrandDataModel from "@/types/BrandDataModel"
import PatternDataModel from "@/types/PatternDataModel"
import ShapeDataModel from "@/types/ShapeDataModel"
import customTypeCheck from "@/utils/customTypeCheck"

const CheckBoxSelector = ({ dataArray, checkHandler, showAsAccordion = undefined, accordionTitle = "", showMinFive = undefined, selectedItem = [] }: {
    showAsAccordion?: any,
    accordionTitle?: string,
    showMinFive?: any,
    checkHandler: ChangeEventHandler<HTMLInputElement>,
    dataArray: CategoriesDataModel[] | ColorDataModel[] | SizeDataModel[] | BrandDataModel[] | ShapeDataModel[] | PatternDataModel[],
    selectedItem: string[]
}) => {
    return (
        <>
            {
                showAsAccordion && !showMinFive ?
                    <FilterAccordion title={accordionTitle ?? ""}>
                        {
                            dataArray.map(data =>
                                <div key={data._id} className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text capitalize">{data.name}</span>
                                        <input type="checkbox" onChange={checkHandler} value={data.name} className="checkbox" defaultChecked={selectedItem.includes(data.name)} />
                                    </label>
                                </div>
                            )
                        }
                    </FilterAccordion>
                    :
                    <>
                        {
                            !showMinFive && dataArray.map(data =>
                                <div key={data._id} className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text capitalize">{data.name}</span>
                                        <input type="checkbox" onChange={checkHandler} value={data.name} className="checkbox" defaultChecked={selectedItem.includes(data.name)} />
                                    </label>
                                </div>
                            )
                        }
                    </>
            }
            {
                showAsAccordion && showMinFive && <>
                    {
                        dataArray.map((data, index) => {
                            return index <= 4 ? <div key={data._id} className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text capitalize flex items-center">
                                        {customTypeCheck<ColorDataModel>(data as ColorDataModel, "colorCode") && <span className='h-3 w-3 mr-2 rounded-full block' style={{
                                            content: '',
                                            backgroundColor: (data as ColorDataModel).colorCode.hex
                                        }}> </span>}
                                        {data.name}
                                    </span>
                                    <input type="checkbox" onChange={checkHandler} value={data.name} className="checkbox" defaultChecked={selectedItem.includes(data.name)} />
                                </label>
                            </div> : null
                        })
                    }
                    <Disclosure as="div">
                        {({ open }) => (
                            <>
                                <Disclosure.Button className={`${open ? 'border-b' : ''} flex w-full py-4 justify-between items-center text-left text-md font-normal text-blue-900 hover:bg-blue-200`}>
                                    <span className="ml-5">Show All</span>
                                    <BiChevronsDown className={`
                                    ${open ? 'rotate-180 transform' : ''} h-5 w-5 mr-5 text-blue-500 transition-transform
                                    `} />
                                </Disclosure.Button>
                                <Transition
                                    show={open}
                                    enter="transition duration-150 ease-out"
                                    enterFrom="transform scale-y-0 opacity-0"
                                    enterTo="transform scale-y-100 opacity-100"
                                    leave="transition duration-150 ease-out"
                                    leaveFrom="transform scale-y-100 opacity-100"
                                    leaveTo="transform scale-y-0 opacity-0"
                                >
                                    <Disclosure.Panel className={`${open ? 'rounded-b-md' : ''} `} static>
                                        {
                                            dataArray.map((data, index) => {
                                                return index > 4 ? <div key={data._id} className="form-control">
                                                    <label className="label cursor-pointer">
                                                        <span className="label-text capitalize flex items-center">
                                                            {customTypeCheck<ColorDataModel>(data as ColorDataModel, "colorCode") && <span className='h-3 w-3 mr-2 rounded-full block' style={{
                                                                content: '',
                                                                backgroundColor: (data as ColorDataModel).colorCode.hex
                                                            }}> </span>}
                                                            {data.name}
                                                        </span>
                                                        <input type="checkbox" onChange={checkHandler} value={data.name} className="checkbox" defaultChecked={selectedItem.includes(data.name)} />
                                                    </label>
                                                </div> : null
                                            })
                                        }
                                    </Disclosure.Panel>
                                </Transition>
                            </>
                        )}
                    </Disclosure>
                </>
            }
        </>
    )
}

export default CheckBoxSelector