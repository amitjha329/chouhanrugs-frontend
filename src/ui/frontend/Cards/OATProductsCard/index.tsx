'use client'
import { HiStar } from "react-icons/hi";
import ProductsCardStyle from './ProductsCard.module.scss'
import Image from 'next/image'
import { MouseEventHandler, useState, useEffect, useRef, RefObject } from "react";
import clsx from "clsx";
import { useCurrencyContext } from "../../Contexts/CurrencyContext";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import addProductToWishlist from "@/lib/actions/addProductToWishlist";
import { useSession } from "next-auth/react";
import onPageNotifications from "@/ui/common/onPageNotifications";
import { useDataConnectionContext } from "../../Contexts/DataConnectionContext";
import { ProductDataModelWithColorMap } from "@/lib/types/ProductDataModel";
import deleteProductFromWishlist from "@/lib/actions/deleteProductFromWishlist";
import useOnScreenObserver from "@/lib/customHooks/useOnScreenObserver";
import getProductWithId from "@/lib/actions/getProductWithId";
import ProductCardSkeleton from "../../Skeletons/ProductCardSkeleton";

type propTypes = {
    itemClasses?: string,
    parentClasses?: string,
    productId: string,
    root: RefObject<Element>
}

const OATProductsCard = ({ productId, itemClasses, parentClasses, root }: propTypes) => {
    const [wishAnimate, setWishAnimate] = useState(false)
    const [productDetails, setProductDetails] = useState<ProductDataModelWithColorMap|null>()
    const { userCurrency } = useCurrencyContext()
    const { wishlistItems, refreshWishList } = useDataConnectionContext()
    const { data: session } = useSession()
    const router = useRouter()

    const ref = useRef<HTMLDivElement>(null)
    const intersectionObserver = useOnScreenObserver({ element: ref, rootMargin: "-100px", root })
    useEffect(() => {
        if (intersectionObserver && !productDetails) {
            getProductWithId(productId).then((res) => {
                console.log(res)
                setProductDetails(res)
            })
        }
    }, [intersectionObserver, productDetails, productId])

    const quickViewButton: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        router.push(`/products/${productDetails?.productURL}`)
    }

    const addToWishlist: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        !wishlistItems.includes(productDetails?._id?.toString() ?? "") ? addProductToWishlist(productDetails?._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Added To Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() }) : deleteProductFromWishlist(productDetails?._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Removed From Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() })
        setWishAnimate(!wishAnimate)
    }

    useEffect(() => {
        setWishAnimate(wishlistItems.includes(productDetails?._id?.toString() ?? ""))
    }, [wishlistItems])


    return (
        <div ref={ref}>
            {
                productDetails ? <div id={`product_${productDetails?._id}`} className={clsx("flex flex-col items-center cursor-pointer m-3 ", parentClasses ?? '')}>
                    <a href={`/products/${productDetails?.productURL}`}>
                        <div className={clsx("card card-compact glass min-h-[300px] md:min-h-[500px] overflow-hidden rounded-none shadow-md p-0", itemClasses ?? '', ProductsCardStyle.product_card)}>
                            <div className="w-40 h-40 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-hidden relative">
                                <Image src={productDetails?.images[productDetails?.productPrimaryImageIndex] ?? ""} alt={productDetails?.productName ?? ""} fill className="!relative" onContextMenu={_ => { _.preventDefault() }} />
                                <div className={clsx("flex text-xs md:text-base items-center mr-2 mt-2 p-1 md:p-3 px-2 md:px-4 text-black bg-[#fcf0d8] top-0 absolute rounded-full border md:border-black", ProductsCardStyle.rating)}>
                                    {productDetails?.productReviews.average} <HiStar
                                        className='h-5 w-5 text-amber-400 flex-shrink-0'
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className={clsx("flex text-xs items-center ml-2 mt-2 p-1 md:p-3 text-black md:border border-black bg-white top-0 absolute rounded-full", wishAnimate ? ` ${ProductsCardStyle.active} ${ProductsCardStyle.animate}` : "", ProductsCardStyle.wish_button)} onClick={addToWishlist}>
                                    <svg
                                        width="35px"
                                        height="25px"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g fill="none" fillRule="evenodd">
                                            <path
                                                className={ProductsCardStyle.heart_stroke}
                                                d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z"
                                                fill="#e20000"
                                            />
                                            <path
                                                className={ProductsCardStyle.heart_full}
                                                d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z"
                                                fill="#e20000"
                                            />
                                            <path
                                                className={ProductsCardStyle.heart_lines}
                                                d="M26,4 L30.6852129,0.251829715"
                                                stroke="#e20000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                            <path
                                                className={ProductsCardStyle.heart_lines}
                                                d="M2.314788,4 L7.00000086,0.251829715"
                                                stroke="#e20000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                transform="matrix(-1 0 0 1 10.314788 1)"
                                            />
                                            <path
                                                className={ProductsCardStyle.heart_lines}
                                                d="M27,12 L33,12"
                                                stroke="#e20000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                            <path
                                                className={ProductsCardStyle.heart_lines}
                                                d="M0,12 L6,12"
                                                stroke="#e20000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                transform="matrix(-1 0 0 1 7 1)"
                                            />
                                            <path
                                                className={ProductsCardStyle.heart_lines}
                                                d="M24,19 L28.6852129,22.7481703"
                                                stroke="#e20000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                            <path
                                                className={ProductsCardStyle.heart_lines}
                                                d="M4.314788,19 L9.00000086,22.7481703"
                                                stroke="#e20000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                transform="matrix(-1 0 0 1 14.314788 1)"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <div className="absolute bottom-0 left-0 ml-2 mb-2 p-3">
                                    <div className="relative mb-3">
                                        {
                                            productDetails?.colorMap?.map((color, index) => index <= 4 && <span key={color.colorCode.hex} className="h-6 w-6 absolute rounded-full border border-white" style={{ backgroundColor: color.colorCode.hex, left: index * 10 }}></span>)
                                        }
                                        {
                                            productDetails?.colorMap && productDetails?.colorMap.length > 5 && <span className="h-6 w-6 absolute rounded-full border border-white text-black bg-white" style={{ left: 10 }}>++</span>
                                        }
                                    </div>
                                </div>
                                {
                                    parseFloat(productDetails?.productDiscountPercentage ?? "0") > 0 && <div className="mask mask-hexagon bg-red-500 text-white flex text-xs items-center absolute bottom-0 right-0 mr-2 mb-2 p-3">
                                        {productDetails?.productDiscountPercentage}
                                    </div>
                                }
                            </div>
                            <div className="card-body items-center w-40 md:w-80">
                                <h2 className="md:card-title !font-bold ellipsize line-clamp-1 max-md:line-clamp-2 !text-base max-md:!text-sm">{productDetails?.productName}</h2>
                                <p className="text-xs text-center ellipsize line-clamp-2">{productDetails?.productDescriptionShort}</p>
                                <div className="font-semibold flex item-center">
                                    <span className="text-base">{userCurrency?.currencySymbol}{(userCurrency?.exchangeRates ?? 1) * Number(productDetails?.productSellingPrice) >> 0}&nbsp;&nbsp;</span>
                                    <span className="line-through text-base place-self-center text-gray-400">{userCurrency?.currencySymbol}{(userCurrency?.exchangeRates ?? 1) * Number(productDetails?.productMSRP) >> 0}</span>
                                </div>
                            </div>
                            <div className="card-actions w-full md:justify-end p-0 max-md:hidden">
                                <button className="btn btn-outline btn-primary w-full rounded-none btn-sm md:btn-md text-white " onClick={quickViewButton}><FaEye size="20" className="mr-2" />Quick View</button>
                            </div>
                        </div>
                    </a>
                </div> : <ProductCardSkeleton />
            }
        </div>
    )
}

export default OATProductsCard