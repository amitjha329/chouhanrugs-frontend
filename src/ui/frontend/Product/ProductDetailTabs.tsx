'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useProductContext } from '../Contexts/ProductContext'
import { ProductDataModelWithColorMap } from '@/lib/types/ProductDataModel'

const ProductDetailTabs = () => {
    const { product } = useProductContext()
    // const [productDescriptionLong, setProductDescriptionLong] = useState("")
    let { productDescriptionLong, highlights, careInstructions, productShippingInfo } = product ?? {} as Partial<ProductDataModelWithColorMap>
    useEffect(()=>{},[
        
    ])
    return (
        <section className="container mx-auto">
            <Tab.Group as="div" className="mt-10">
                <Tab.List className="flex space-x-3 rounded-xl p-1">
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full py-2.5 text-lg font-medium leading-5 border-b border-primary outline-none',
                                selected
                                    ? 'border-opacity-100'
                                    : 'border-opacity-10'
                            )
                        }
                    >
                        Description
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full py-2.5 text-lg font-medium leading-5 border-b border-primary outline-none',
                                selected
                                    ? 'border-opacity-100'
                                    : 'border-opacity-10'
                            )
                        }
                    >
                        Highlights
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full py-2.5 text-lg font-medium leading-5 border-b border-primary outline-none',
                                selected
                                    ? 'border-opacity-100'
                                    : 'border-opacity-10'
                            )
                        }
                    >
                        Care
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full py-2.5 text-lg font-medium leading-5 border-b border-primary outline-none',
                                selected
                                    ? 'border-opacity-100'
                                    : 'border-opacity-10'
                            )
                        }
                    >
                        Shipping
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {/* Description */}
                    <Tab.Panel
                        className={clsx(
                            'rounded-xl p-3',
                            ''
                        )}
                        dangerouslySetInnerHTML={{ __html: productDescriptionLong ?? "No Description" }} />
                    {/* Highlights */}
                    <Tab.Panel
                        className={clsx(
                            'rounded-xl p-3',
                            ''
                        )}
                    >
                        <ul>
                            {(highlights ?? ["No Highlights"]).map((highlight, index) => (
                                <li
                                    key={highlight}
                                    className="relative rounded-md p-3 "
                                >
                                    <h3 className="text-sm font-medium leading-5">
                                        {highlight}
                                    </h3>
                                </li>
                            ))}
                        </ul>
                    </Tab.Panel>
                    {/* Care Instructions */}
                    <Tab.Panel
                        className={clsx(
                            'rounded-xl p-3',
                            ''
                        )}
                    >
                        <ul>
                            {(careInstructions ?? ["No Special Care Needed"]).map((careDetail, index) => (
                                <li
                                    key={careDetail}
                                    className="relative rounded-md p-3 "
                                >
                                    <h3 className="text-sm font-medium leading-5">
                                        {careDetail}
                                    </h3>
                                </li>
                            ))}
                        </ul>
                    </Tab.Panel>
                    {/* Shipping Details */}
                    <Tab.Panel
                        className={clsx(
                            'rounded-xl p-3',
                            ''
                        )}
                        dangerouslySetInnerHTML={{ __html: productShippingInfo ?? "Generic Shipping" }} />
                </Tab.Panels>
            </Tab.Group>
        </section>
    )
}

export default ProductDetailTabs