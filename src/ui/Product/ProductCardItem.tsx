import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ProductsCardStyle from './WishlistButton.module.scss'

interface CompoProps extends ProductDataModelWithColorMap {
    className?: string
}

const ProductCardItem = (props: CompoProps) => {
    return (
        <div className={clsx('bg-white rounded-xl overflow-hidden w-full text-center', props.className)}>
            <Link href={'/products/' + props.productURL} className="">
                <div className="relative rounded-2xl overflow-hidden">
                    <Image src={props.images[props.productPrimaryImageIndex]} alt={props.productName} className="!w-full !relative !~h-40/60 object-cover" width={300} height={240} />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{props.productDiscountPercentage}</div>
                    <div className={clsx("flex text-xs items-center ml-2 mt-2 p-1 md:p-3 text-black md:border border-black bg-white top-0 absolute rounded-full"
                        // wishAnimate ? ` ${ProductsCardStyle.active} ${ProductsCardStyle.animate}` : "", ProductsCardStyle.wish_button
                    )}
                    // onClick={addToWishlist}
                    >
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
                    {props.colorMap && <div className='absolute bottom-2 left-2'>
                        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                            {
                                props.colorMap.slice(0, 4).map(color => {
                                    return <div className="avatar" key={color._id?.toString()}>
                                        <div className="w-12 h-12" style={{
                                            backgroundColor: color.colorCode.hex
                                        }}>
                                        </div>
                                    </div>
                                })
                            }
                            {
                                (props.colorMap ?? []).length > 4 && <div className="ml-2 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">+</div>
                            }
                        </div>
                    </div>}
                </div>
                <div className="p-4">
                    <div className="font-light text-gray-500 text-center">{props.productCategory}</div>
                    <div className="text-sm font-medium text-gray-800 mt-1 line-clamp-2">{props.productName}</div>
                    <div className="flex items-center mt-2 justify-center">
                        <div className="text-primary">$ {props.productSellingPrice}</div>
                        <div className="text-gray-500 line-through ml-2">$ {props.productMSRP}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCardItem