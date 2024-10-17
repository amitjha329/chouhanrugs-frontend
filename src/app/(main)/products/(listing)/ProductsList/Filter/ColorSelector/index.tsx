import React, { ChangeEventHandler, useId } from 'react'
import SizeSelectorStyle from './SizeSelector.module.scss'
import FilterAccordion from '../FilterAccordion'
import clsx from 'clsx'
import ColorDataModel from '@/types/ColorDataModel'

const ColorSelector = ({
    className,
    allColorList,
    selectedColors,
    checkHandler,
    showAsAccordion = false,
    accordionTitle = ""
}: {
    className?: string,
    allColorList: ColorDataModel[],
    selectedColors: string[],
    checkHandler: ChangeEventHandler<HTMLInputElement>,
    showAsAccordion: boolean,
    accordionTitle?: string
}) => {
    const id = useId()
    return (
        <>
            {
                showAsAccordion ?
                    <FilterAccordion title={accordionTitle}>
                        <div className={clsx(className, "flex flex-wrap gap-2")}>
                            {
                                allColorList.map((color, index) => {
                                    return <div key={color._id} className={clsx("flex", SizeSelectorStyle.sizes)}>
                                        <input type="checkbox" onChange={checkHandler} value={color.name} id={index + id} defaultChecked={selectedColors?.includes(color.name)} />
                                        <label htmlFor={index + id} className="bg-gray-300">{color.name}</label>
                                    </div>
                                })
                            }
                        </div>
                    </FilterAccordion>
                    :
                    <div className={clsx(className, "flex flex-wrap gap-2")}>
                        {
                            allColorList.map(size => {
                                return <div key={size._id} className={clsx("flex", SizeSelectorStyle.sizes)}>
                                    <input type="checkbox" onChange={checkHandler} value={size.name} id={size._id} defaultChecked={selectedColors?.includes(size.name)} />
                                    <label htmlFor={size._id} className="bg-gray-300">{size.name}</label>
                                </div>
                            })
                        }
                    </div>
            }
        </>
    )
}

export default ColorSelector