'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { BsExclamation, BsTrash } from 'react-icons/bs'
import { useCurrencyContext } from '../Contexts/CurrencyContext'
import CartDataModel from '@/lib/types/CartDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import deleteProductFromCart from '@/lib/actions/deleteProductFromCart'
import increaseDeacreaseCartItem from '@/lib/actions/increaseDeacreaseCartItem'
import { stringNotEmptyOrNull } from '@/lib/utilities/stringEmptyOrNull'

const CartItem = ({ item }: { item: CartDataModel, }) => {

    const [quantity, setQuantity] = useState(item.quantity)
    const { userCurrency } = useCurrencyContext()

    const incrementQuantity = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1)
            increaseDeacreaseCartItem(item._id, 1).then(() => {
                window.location.reload()
            })
        } else {
            onPageNotifications("info", "Large Quantity Can Only Be Ordered Using Bulk Request")
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
            increaseDeacreaseCartItem(item._id, -1).then(() => {
                window.location.reload()
            })
        } else {
            removeCartItem(item._id)
        }
    }

    const removeCartItem = async (id: string) => {
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
            window.location.reload()
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
        })
    }

    const calculateProductPrice = (): number => {
        var priceInitial = 0
        if (stringNotEmptyOrNull(item.variationCode) && item.variationCode != "customSize") {
            const variationindex = item.cartProduct[0].variations.findIndex(ff => ff.variationCode == item.variationCode!)
            priceInitial = (Number(item.cartProduct[0].variations[variationindex].variationPrice) - Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationPrice) * (Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationDiscount ?? 0) / 100)) >> 0
        } else if (item.variationCode == "customSize") {
            switch (item.customSize?.shape) {
                case "Rectangle":
                case "Runner":
                case "Square":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1)
                    break;
                case "Round":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI)
                    break;
            }
        } else {
            priceInitial = item.cartProduct[0].productSellingPrice
        }
        return priceInitial * (userCurrency?.exchangeRates ?? 1) * quantity
    }

    // useEffect(() => {
    //     productSubtotalItem = quantity * item.cartProduct[0].productPrimaryImageIndex
    // }, [quantity])

    return (
        <>
            {
                item.cartProduct[0] ? <div className="flex items-center justify-between hover:bg-gray-100 mb-2 ">
                    <a href={`/products/${item.cartProduct[0].productURL}`} className="flex">
                        {" "}
                        {/* product */}
                        <div className="w-fit">
                            <Image
                                height={96}
                                width={96}
                                quality={10}
                                className="sm:h-24 sm:w-24 object-scale-down w-20 h-20"
                                src={item.cartProduct[0].images[item.cartProduct[0].productPrimaryImageIndex]}
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col justify-start ml-4 flex-grow">
                            <span className="font-bold text-sm max-sm:text-xs max-w-[250px]">{item.cartProduct[0].productName}</span>
                            <span className="opacity-80 max-sm:text-sm">Brand: {item.cartProduct[0].productBrand}</span>
                            <div className='flex gap-2'>
                                {
                                    item.variationCode && <>
                                        {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationSize != null && <span className="opacity-80 text-xs">Size: {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationSize}</span>}
                                        {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationColor != null && <span className="opacity-80 text-xs">Color: {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationColor}</span>}
                                    </>
                                }
                                {
                                    item.variationCode == "customSize" && <div className='flex flex-col'>
                                        <div className='flex gap-2'>
                                            <span className="opacity-80 text-xs">Size: Custom Size</span>
                                            <span className="opacity-80 text-xs">Shape: {item.customSize?.shape}</span>
                                        </div>
                                        {
                                            item.customSize?.shape == "Round" && <span className="opacity-80 text-xs">Diameter: {item.customSize?.dimensions.diameter?.toFixed(2)}</span>
                                        }
                                        {
                                            item.customSize?.shape == "Rectangle" && <>
                                                <span className="opacity-80 text-xs">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                                <span className="opacity-80 text-xs">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                                            </>
                                        }
                                        {
                                            item.customSize?.shape == "Runner" && <>
                                                <span className="opacity-80 text-xs">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                                <span className="opacity-80 text-xs">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                                            </>
                                        }
                                        {
                                            item.customSize?.shape == "Square" && <span className="opacity-80 text-xs">Size: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                        }
                                    </div>
                                }
                            </div>
                            <span className="font-semibold text-sm">{userCurrency?.currencySymbol} {calculateProductPrice().toFixed(2)}</span>
                        </div>
                    </a>
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-3 justify-center">
                        <svg
                            className="fill-current text-gray-600 w-3 cursor-pointer"
                            viewBox="0 0 448 512"
                            onClick={_ => decrementQuantity()}
                        >
                            <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                        <input
                            className="mx-2 input input-sm input-bordered border text-center w-16"
                            type="text"
                            value={quantity}
                            readOnly
                        />
                        <svg
                            className="fill-current text-gray-600 w-3 cursor-pointer"
                            viewBox="0 0 448 512"
                            onClick={_ => incrementQuantity()}
                        >
                            <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                    </div>
                    <span className="text-center font-semibold text-sm hidden sm:block" id='productQuantity'>
                        {userCurrency?.currencySymbol} {calculateProductPrice().toFixed(2)}
                    </span>
                    <div className='hidden sm:flex shrink items-center justify-center w-20 sm:px-[1.875rem] sm:py-16 btn btn-error btn-outline rounded-none' onClick={_ => { removeCartItem(item._id) }}>
                        <BsTrash className='w-5 h-5' />
                    </div>
                </div> :
                    <div className="flex items-center justify-between hover:bg-gray-100 mb-2 ">
                        <div className="flex">
                            {" "}
                            {/* product */}
                            <div className="w-fit">
                                <BsExclamation
                                    height={96}
                                    width={96}
                                    className="sm:h-24 sm:w-24 object-scale-down w-20 h-20"
                                />
                            </div>
                            <div className="flex flex-col justify-start ml-4 flex-grow">
                                <span className="font-bold text-sm max-sm:text-xs max-w-[250px]">Product no Longer Available</span>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 justify-center">
                            <svg
                                className="fill-current text-gray-600 w-3 cursor-pointer"
                                viewBox="0 0 448 512"
                                onClick={_ => { }}
                            >
                                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                            </svg>
                            <input
                                className="mx-2 input input-sm input-bordered border text-center w-16"
                                type="text"
                                value={quantity}
                                readOnly
                            />
                            <svg
                                className="fill-current text-gray-600 w-3 cursor-pointer"
                                viewBox="0 0 448 512"
                                onClick={_ => { }}
                            >
                                <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                            </svg>
                        </div>
                        <div className='hidden sm:flex shrink items-center justify-center w-20 sm:px-[1.875rem] sm:py-16 btn btn-error btn-outline rounded-none' onClick={_ => { removeCartItem(item._id) }}>
                            <BsTrash className='w-5 h-5' />
                        </div>
                    </div>
            }

            <div className='divider'></div>
        </>
    )
}

export default CartItem