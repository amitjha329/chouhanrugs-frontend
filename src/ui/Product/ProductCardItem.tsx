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
    const productVariations = props.variations ?? []

    // Calculate least selling price (after discount) among all variations and the main product
    let leastSellingPrice: string;
    if (productVariations.length > 0) {
        leastSellingPrice = Number(
            productVariations.reduce((min, variation) => {
                const price = Number(variation.variationPrice ?? '0');
                const discount = Number(variation.variationDiscount ?? '0');
                const sellingPrice = price - (discount / 100) * price;
                if (isNaN(sellingPrice) || sellingPrice < 0) {
                    return min;
                }
                return Math.min(min, sellingPrice);
            }, Number.POSITIVE_INFINITY)
        ).toFixed(2);
    } else {
        leastSellingPrice = Number(props.productSellingPrice).toFixed(2);
    }

    // Calculate least MSRP among all variations and the main product
    let leastMSRP: string;
    if (productVariations.length > 0) {
        leastMSRP = Number(
            productVariations.reduce((min, variation) => {
                const msrp = Number(variation.variationPrice ?? '0');
                if (isNaN(msrp) || msrp < 0) {
                    return min;
                }
                return Math.min(min, msrp);
            }, Number.POSITIVE_INFINITY)
        ).toFixed(2);
    } else {
        leastMSRP = Number(props.productMSRP).toFixed(2);
    }

    return (
        <div className={clsx('bg-white rounded-xl overflow-hidden w-full text-center relative mr-3', props.className, ProductsCardStyle.product_card)}>
            <WishListButton productDetails={props} />
            <Link href={'/products/' + props.productURL} className="" prefetch={false}>
                <div className="relative rounded-2xl overflow-hidden">
                    <Image 
                        src={props.images[props.productPrimaryImageIndex]} 
                        alt={props.productName} 
                        className="!w-full !relative !~h-52/60 object-cover" 
                        width={400} 
                        height={320}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAHxAAAgICAgMBAAAAAAAAAAAAAQIDBAARBSESMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCN4jmLdTjWnnidZ7PkyhWGt+vz7zGMBH//2Q=="
                        loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{props.productDiscountPercentage}</div>
                    {props.sponsered && <div className='rounded-full text-primary py-1 px-2 text-xs bg-white absolute max-md:bottom-2 md:top-2 left-1/2 -translate-x-1/2'>Sponsored</div>}
                    {props.colorMap && props.colorMap.length > 0 && <div className='absolute bottom-2 left-2'>
                        <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                            {
                                props.colorMap.slice(0, 3).map(color => (
                                    <div className="avatar border border-black" key={color._id?.toString()}>
                                        <div className="w-6 h-6" style={{ backgroundColor: color.colorCode.hex }}></div>
                                    </div>
                                ))
                            }
                            {props.colorMap.length > 3 && (
                                <div className="ml-2 w-6 h-6 avatar border border-black bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                    +{props.colorMap.length - 3}
                                </div>
                            )}
                        </div>
                    </div>}
                </div>
                <div className="p-4">
                    <div className="font-light text-gray-500 text-center max-md:text-xs">{props.productCategory}</div>
                    <div className="text-xs font-medium text-gray-800 mt-1 line-clamp-2">{props.productName}</div>
                    <div className="flex items-center mt-2 justify-center max-md:text-sm">
                        <div className="text-primary">$ {leastSellingPrice}</div>
                        <div className="text-gray-500 line-through ml-2 max-md:text-xs">$ {leastMSRP}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCardItem