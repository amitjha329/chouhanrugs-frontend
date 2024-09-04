'use client'
import Image from 'next/image'
import Link from "next/link"
import { FaChevronCircleRight } from "react-icons/fa"
import Flicked from '../../../Sliders/Flicked'
import CategoriesDataModel from '@/lib/types/CategoriesDataModel'
import useOnScreenObserver from '@/lib/customHooks/useOnScreenObserver'
import textOverflowMarqueeHelper from '@/lib/utilities/textOverflowMarqueeHelper'
import { useState, useEffect, useRef } from 'react'
import { useCurrencyContext } from '@/ui/frontend/Contexts/CurrencyContext'
import { ProductDataModel } from '@/lib/types/ProductDataModel'
import PopularCategoriesSkeleton from '@/ui/frontend/Skeletons/PopularCategoriesSkeleton'
import getCategoryandItsPopularProduct from '@/lib/actions/getCategoryandItsPopularProduct'

const CategoryTopSelling = ({ categoryId }: { categoryId: { _id: string } }) => {
    // const productsList = await getProductsList({ limit: 3 }, { category: [categorydata.name], tags: ["Top Selling"] })

    const { userCurrency } = useCurrencyContext()

    const [categorydata, setCategorydata] = useState<CategoriesDataModel>()
    const [productsList, setProductsList] = useState<ProductDataModel[]>()
    useEffect(() => {
        const elements = document.getElementsByClassName("categoryName")
        textOverflowMarqueeHelper(elements)
    }, [categorydata])

    const ref = useRef<HTMLDivElement>(null)
    const intersectionObserver = useOnScreenObserver({ element: ref, rootMargin: "-100px" })
    useEffect(() => {
        if (intersectionObserver && !categorydata && !productsList) {
            getCategoryandItsPopularProduct(categoryId._id).then((res) => {
                setCategorydata(res.catrgory)
                setProductsList(res.product)
            })
        }
    }, [intersectionObserver, categorydata, categoryId, productsList])

    return <div ref={ref}>
        {
            (categorydata && productsList) ? <section className="container mx-auto my-8 lg:my-24">
                <h2 className="text-xl md:text-3xl p-3 max-sm:hidden">Popular in {categorydata.name}</h2>
                <div className="flex flex-col md:flex-row mx-4 border shadow-xl card card-bordered rounded-none max-sm:mt-10">
                    <div className="basis-1/3 hidden max-[480px]:block lg:block relative aspect-square">
                        <div className="absolute z-[1] px-5 py-2 backdrop-blur bg-primary text-lg text-white mt-3">
                            {`Popular in ${categorydata.name}`}
                        </div>
                        <Image src={categorydata.banner} sizes='(max-width:480px) 91.5vw,(max-width:1024px) 0vw,30vw' alt={`Category banner ${categorydata._id}`} fill className="!relative object-bottom object-cover" quality={20} />
                    </div>
                    <Flicked options={{
                        dragThreshold: 10,
                        imagesLoaded: true,
                        selectedAttraction: 0.01,
                        friction: 0.15,
                        cellAlign: 'left',
                        pageDots: false,
                        groupCells: true,
                        autoPlay: true,
                        pauseAutoPlayOnHover: true
                    }} className="hidden max-[480px]:block mt-2">
                        {
                            productsList.map(productItem => <div key={productItem._id + productItem.productName} className="flex rounded-none cursor-pointer w-full card-side">
                                <figure className="relative basis-1/2 sm:my-8 h-auto"><Image src={productItem.images[productItem.productPrimaryImageIndex]} alt="Album" quality={15} fill /></figure>
                                <div className="card-body basis-1/2 p-0">
                                    <div className="p-5 pb-2 pr-10">
                                        <h2 className="card-title line-clamp-2 text-base">{productItem.productName}</h2>
                                        <p className="line-clamp-2 text-xs">{productItem.productDescriptionShort}</p>
                                        <div className="font-semibold flex item-center">
                                            <span className="text-lg">{userCurrency?.currencySymbol}{(userCurrency?.exchangeRates ?? 1) * productItem.productSellingPrice >> 0}&nbsp;&nbsp;</span>
                                            <span className="line-through text-lg place-self-center text-gray-400">{userCurrency?.currencySymbol}{(userCurrency?.exchangeRates ?? 1) * productItem.productMSRP >> 0}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions action ml-5">
                                        <a href={`/products/${productItem.productURL}`} className="btn btn-sm w-36 btn-primary rounded-none">Shop Now</a>
                                    </div>
                                </div>
                            </div>)
                        }
                        <Link href={`/products/category/${categorydata.name}`} className="card lg:!flex-row-reverse hover:shadow-[inset_0_0px_4px_rgba(0,0,0,0.3)] rounded-none carousel-item w-full cursor-pointer justify-center min-h-[192px]">
                            <div className="card-body w-auto items-center justify-center flex-row">
                                <h2 className="card-title">Explore All</h2> <FaChevronCircleRight className="!h-7 !w-7 text-primary" />
                            </div>
                        </Link>
                    </Flicked>

                    <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:basis-2/3 border-t border-r border-b max-[480px]:hidden">
                        {
                            productsList.map(productItem => <Link href={`/products/${productItem.productURL}`} key={productItem._id + productItem.productName} className="card card-side lg:!flex-row-reverse hover:shadow-[inset_0_0px_4px_rgba(0,0,0,0.3)] rounded-none carousel-item w-full cursor-pointer">
                                <figure className="relative basis-2/5 sm:my-8 h-full sm:h-auto"><Image src={productItem.images[productItem.productPrimaryImageIndex]} alt="Album" fill quality={15} /></figure>
                                <div className="card-body basis-3/5">
                                    <h2 className="card-title text-end md:text-start line-clamp-2">{productItem.productName}</h2>
                                    <p className="text-end md:text-start line-clamp-2">{productItem.productDescriptionShort}</p>
                                    <div className="font-semibold flex item-center">
                                        <span className="text-lg">{userCurrency?.currencySymbol}{(userCurrency?.exchangeRates ?? 1) * productItem.productSellingPrice >> 0}&nbsp;&nbsp;</span>
                                        <span className="line-through text-lg place-self-center text-gray-400">{userCurrency?.currencySymbol}{(userCurrency?.exchangeRates ?? 1) * productItem.productMSRP >> 0}</span>
                                    </div>
                                    <div className="card-actions action justify-end md:justify-start mt-3">
                                        <Link href={`/products/${productItem.productURL}`} className="btn btn-xs rounded-none btn-outline btn-primary">Shop Now</Link>
                                    </div>
                                </div>
                            </Link>)
                        }

                        <Link href={`/products/category/${categorydata.name}`} className="card lg:!flex-row-reverse hover:shadow-[inset_0_0px_4px_rgba(0,0,0,0.3)] rounded-none carousel-item w-full cursor-pointer justify-center">
                            <div className="card-body w-auto items-center justify-center flex-row">
                                <h2 className="card-title">Explore All</h2> <FaChevronCircleRight className="!h-7 !w-7 text-primary" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section> : <PopularCategoriesSkeleton />
        }
    </div>
}

export default CategoryTopSelling