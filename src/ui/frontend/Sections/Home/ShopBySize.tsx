'use client'
import Link from "next/link"
import SectionHeader from "../SectionHeaders"
import Flicked from "../../Sliders/Flicked"
import SizeDataModel from "@/lib/types/SizeDataModel"
import Image from "next/image"
import useOnScreenObserver from "@/lib/customHooks/useOnScreenObserver"
import textOverflowMarqueeHelper from "@/lib/utilities/textOverflowMarqueeHelper"
import { useState, useEffect, useRef } from "react"
import getSizeList from "@/lib/actions/getSizeList"
import ShopBySizeSkeleton from "../../Skeletons/ShopBySizeSkeleton"

const ShopBySize = () => {
    const [sizeList, setSizeList] = useState<SizeDataModel[]>()
    useEffect(() => {
        const elements = document.getElementsByClassName("categoryName")
        textOverflowMarqueeHelper(elements)
    }, [sizeList])

    const ref = useRef<HTMLDivElement>(null)
    const intersectionObserver = useOnScreenObserver({ element: ref, rootMargin: "-100px" })
    useEffect(() => {
        if (intersectionObserver && !sizeList) {
            getSizeList().then((res) => {
                setSizeList(res)
            })
        }
    }, [intersectionObserver, sizeList])
    return (
        <div ref={ref}>
            <section className="container px-4 md:px-0 mx-auto overflow-hidden">
                <SectionHeader sectionTitle="Shop By Size" buttonVisible={true} sectionButtonLink="#" buttonText="See More" />
                {
                    sizeList ? <Flicked options={{
                        dragThreshold: 10,
                        selectedAttraction: 0.01,
                        friction: 0.15,
                        cellAlign: 'left',
                        contain: true,
                        pageDots: false,
                        groupCells: true
                    }} className="px-5">
                        {
                            sizeList.map((size) => {
                                return <Link className="text-center mx-3" key={size._id} href={`/products?size=${size.sizeCode}`}>
                                    {/* <div className="w-80 h-80 max-sm:h-60 max-sm:w-60 bg-cover bg-no-repeat bg-center" style={{
                                backgroundImage: `url(${size.sizeBanner})`
                            }} /> */}
                                    <div className="w-80 h-80 max-sm:h-60 max-sm:w-60 overflow-hidden relative">
                                        <Image src={size.sizeBanner} alt={size.name} className="object-fill w-80 h-80 max-sm:h-60 max-sm:w-60" fill />
                                    </div>
                                    <span className="hover:text-secondary">{size.sizeCode}</span>
                                </Link>
                            })
                        }
                    </Flicked> : <ShopBySizeSkeleton />
                }
            </section>
        </div>
    )
}

export default ShopBySize