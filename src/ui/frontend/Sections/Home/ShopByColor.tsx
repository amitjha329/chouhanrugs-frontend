'use client'
import React, { useEffect, useRef, useState } from 'react'
import Flicked from '../../Sliders/Flicked'
import Link from 'next/link'
import Image from 'next/image'
import getColorsList from '@/lib/actions/getColorsList'
import ColorDataModel from '@/lib/types/ColorDataModel'
import useOnScreenObserver from '@/lib/customHooks/useOnScreenObserver'
import textOverflowMarqueeHelper from '@/lib/utilities/textOverflowMarqueeHelper'
import ShopByColorSkeleton from '../../Skeletons/ShopByColorSkeleton'

const ShopByColor = () => {
    const [colorList, setColorList] = useState<ColorDataModel[]>()
    useEffect(() => {
        const elements = document.getElementsByClassName("categoryName")
        textOverflowMarqueeHelper(elements)
    }, [colorList])

    const ref = useRef<HTMLDivElement>(null)
    const intersectionObserver = useOnScreenObserver({ element: ref, rootMargin: "-100px" })
    useEffect(() => {
        if (intersectionObserver && !colorList) {
            getColorsList().then((res) => {
                setColorList(res)
            })
        }
    }, [intersectionObserver, colorList])
    return (
        <div ref={ref}>
            <section className="container mx-auto mt-5 overflow-hidden">
                <h2 className="text-lg md:text-xl font-bold mx-5 mb-3">Shop By Color</h2>
                {
                    colorList ? <Flicked options={{
                        dragThreshold: 10,
                        selectedAttraction: 0.01,
                        friction: 0.15,
                        pageDots: false,
                        groupCells: true,
                        cellAlign: 'left',
                        contain: true
                    }} className="px-5">
                        {
                            colorList.map((color) => {
                                return (
                                    <Link className="text-center mx-5" key={color.name} href={`/products?color=${color.name}`}>
                                        <div className="relative min-w-[7.5rem] min-h-[7.5rem] md:min-w-fit md:min-h-fit p-1">
                                            <div className="w-7 h-7 absolute bottom-1 right-1 md:relative border border-black md:w-44 md:h-44 bg-cover bg-no-repeat bg-center rounded-full md:hover:opacity-0 transition-opacity" style={{
                                                backgroundColor: color.colorCode.hex
                                            }} />
                                            <Image fill alt={color.name} src={color.sampleImg} className="!w-28 !h-28 md:!absolute !top-1/2 !left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                                        </div>
                                        <div className="font-bold">{color.name}</div>
                                    </Link>
                                )
                            })
                        }
                    </Flicked> : <ShopByColorSkeleton />
                }
            </section>
        </div>
    )
}

export default ShopByColor