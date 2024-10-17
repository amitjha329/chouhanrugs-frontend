import React, { ChangeEventHandler, useId } from 'react'
import SizeSelectorStyle from './SizeSelector.module.scss'
import clsx from 'clsx'
import FilterAccordion from '../FilterAccordion'
import SizeDataModel from '@/types/SizeDataModel'

const SizeSelector = ({
    className,
    allSizeList,
    selectedSizes,
    checkHandler,
    showAsAccordion = false,
    accordionTitle = ""
}: {
    className?: string,
    allSizeList: SizeDataModel[],
    selectedSizes: string[],
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
                                allSizeList.map((size, index) => {
                                    return <div key={size._id} className={clsx("flex", SizeSelectorStyle.sizes)}>
                                        <input type="checkbox" onChange={checkHandler} value={size.sizeCode} id={index + id} defaultChecked={selectedSizes?.includes(size.sizeCode)} />
                                        <label htmlFor={index + id} className="bg-gray-300">{size.sizeCode}</label>
                                    </div>
                                })
                            }
                        </div>
                    </FilterAccordion> : <div className={clsx(className, "flex flex-wrap gap-2")}>
                        {
                            allSizeList.map(size => {
                                return <div key={size._id} className={clsx("flex", SizeSelectorStyle.sizes)}>
                                    <input type="checkbox" onChange={checkHandler} value={size.sizeCode} id={size._id} defaultChecked={selectedSizes?.includes(size.sizeCode)} />
                                    <label htmlFor={size._id} className="bg-gray-300">{size.sizeCode}</label>
                                </div>
                            })
                        }
                    </div>
            }
        </>
    )
}

export default SizeSelector