"use client"
import CategoriesDataModel from '@/lib/types/CategoriesDataModel'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button, Dialog, DialogTrigger, OverlayArrow, Popover } from 'react-aria-components'
import { BiCaretDown } from 'react-icons/bi'

const CategoryPopOver = ({ category, categoryList }: { category: CategoriesDataModel, categoryList: CategoriesDataModel[] }) => {
    const [popOverOpen, setPopOverOpen] = useState(false)
    return (
        <DialogTrigger isOpen={popOverOpen} onOpenChange={setPopOverOpen}>
            <Button className="cursor-pointer py-1 px-2 text-sm font-medium btn btn-ghost btn-sm text-current hover:btn-primary hover:text-black capitalize" onPress={e => setPopOverOpen(!popOverOpen)}>{category.name} <BiCaretDown /></Button>
            <Popover isOpen={popOverOpen} onOpenChange={setPopOverOpen}>
                <OverlayArrow>
                    <svg width={12} height={12} viewBox="0 0 12 12">
                        <path d="M0 0 L6 6 L12 0" />
                    </svg>
                </OverlayArrow>
                {/* <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-200"
                                                    enterFrom="opacity-0 translate-y-1"
                                                    enterTo="opacity-100 translate-y-0"
                                                    leave="transition ease-in duration-150"
                                                    leaveFrom="opacity-100 translate-y-0"
                                                    leaveTo="opacity-0 translate-y-1"> */}
                <Dialog className="mt-3">
                    <div className="flex-col flex bg-white shadow-lg" onClick={e => setPopOverOpen(false)}>
                        {
                            categoryList.map(cat => cat.parent == category.name && <Link className="py-3 px-5  hover:bg-gray-300 transition-all border-b" key={cat._id} href={`/products/category/${cat.name}`}>{cat.name}</Link>)
                        }
                        <Link className="py-3 px-5  hover:bg-gray-300 transition-all border-b" key={category._id} href={`/products/category/${category.name}`}>View All</Link>
                    </div>
                </Dialog>
                {/* </Transition> */}
            </Popover>
        </DialogTrigger>
    )
}

export default CategoryPopOver