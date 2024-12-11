import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import WishListButton from './WishListButton'
import ProductsCardStyle from './WishlistButton.module.scss'

interface CompoProps extends ProductDataModelWithColorMap {
    className?: string,
    sponsered?: boolean
}

const ProductCardItem = (props: CompoProps) => {

    return (
        <div className={clsx('bg-white rounded-xl overflow-hidden w-full text-center relative', props.className, ProductsCardStyle.product_card)}>
            <WishListButton productDetails={props} />
            <Link href={'/products/' + props.productURL} className="" prefetch={false}>
                <div className="relative rounded-2xl overflow-hidden">
                    <Image src={props.images[props.productPrimaryImageIndex]} alt={props.productName} className="!w-full !relative !~h-40/60 object-cover" width={300} height={240} />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{props.productDiscountPercentage}</div>
                    {props.sponsered && <div className='rounded-full text-primary py-1 px-2 text-xs bg-white absolute top-2 left-1/2 -translate-x-1/2'>Sponsored</div>}
                    {props.colorMap && <div className='absolute bottom-2 left-2'>
                        <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                            {
                                props.colorMap.slice(0, 4).map(color => {
                                    return <div className="avatar border border-black" key={color._id?.toString()}>
                                        <div className="w-6 h-6" style={{
                                            backgroundColor: color.colorCode.hex
                                        }}>
                                        </div>
                                    </div>
                                })
                            }
                            {
                                (props.colorMap ?? []).length > 4 && <div className="ml-2 w-6 h-6 avatar  border border-black bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">+</div>
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