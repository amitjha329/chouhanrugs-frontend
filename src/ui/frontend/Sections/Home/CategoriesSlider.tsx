'use client'
import getCategoriesList from "@/lib/actions/getCategoriesList"
import useOnScreenObserver from "@/lib/customHooks/useOnScreenObserver"
import CategoriesDataModel from "@/lib/types/CategoriesDataModel"
import capitalize from "@/lib/utilities/capitalize"
import textOverflowMarqueeHelper from "@/lib/utilities/textOverflowMarqueeHelper"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { BiCategoryAlt } from "react-icons/bi"
import CategoriesSliderSkeleton from "../../Skeletons/CategoriesSliderSkeleton"

const CategoriesSlider = () => {
    const [categoriesList, setCategoriesList] = useState<CategoriesDataModel[]>()
    useEffect(() => {
        const elements = document.getElementsByClassName("categoryName")
        textOverflowMarqueeHelper(elements)
    }, [categoriesList])

    const ref = useRef<HTMLDivElement>(null)
    const intersectionObserver = useOnScreenObserver({ element: ref, rootMargin: "-100px" })
    useEffect(() => {
        if (intersectionObserver && !categoriesList) {
            getCategoriesList().then((res) => {
                console.log(res)
                setCategoriesList(res)
            })
        }
    }, [intersectionObserver, categoriesList])
    return (
        <div ref={ref}>
            <section className="md:hidden carousel carousel-center p-4 pb-0 space-x-4 flex">
                <a href="/products/category" className="carousel-item">
                    <div className="card rounded-none w-[100px] carousel-item flex flex-col items-center shadow-md border-[1px] border-gray-200">
                        <div className="bg-[#e3f4fd] min-w-full">
                            {
                                <BiCategoryAlt className="h-10 w-7 my-2 mx-auto" />
                            }
                        </div>
                        <div className="border-t-2 border-gray-500 text-center w-full">
                            <span className="text-xs">All Categories</span>
                        </div>
                    </div>
                </a>
                {
                    !categoriesList && <CategoriesSliderSkeleton />
                }
                {/* <div className="card rounded-none w-[100px] carousel-item flex flex-col items-center shadow-md border-[1px] border-gray-200">
                <div className="bg-[#fde5e3] min-w-full">
                    {// eslint-disable-next-line @next/next/no-img-element
                        <img alt="Offers" src="/images/offer-category.png" className="h-10 my-2 mx-auto object-cover drop-shadow" />
                    }
                </div>
                <div className="border-t-2 border-gray-500 text-center w-full">
                    <span className="text-xs">Offers</span>
                </div>
            </div> */}
                {categoriesList?.map(category => {
                    return (
                        <a key={category._id} href={`/products/category/${category.name}`} className="carousel-item">
                            <div className="card rounded-none w-[100px] carousel-item flex flex-col items-center shadow-md border-[1px] border-gray-200">
                                <div className="bg-[#fcfaf6] min-w-full relative h-14">
                                    <Image alt={category.name} src={category.imgSrc} className="!h-14 mx-auto object-cover drop-shadow" fill />
                                </div>
                                <div className="border-t-2 border-gray-500 text-center w-full max-h-7 categoryName">
                                    <span className="text-xs">{capitalize(category.name, true)}</span>
                                </div>
                            </div>
                        </a>
                    )
                })}
            </section>
        </div>
    )
}

export default CategoriesSlider
