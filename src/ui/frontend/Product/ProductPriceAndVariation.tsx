'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useCurrencyContext } from '../Contexts/CurrencyContext'
import CustomSizeProduct from './CustomSizeProduct'
import clsx from 'clsx'
import SizeDataModel from '@/lib/types/SizeDataModel'
import ColorDataModel from '@/lib/types/ColorDataModel'
import { useRouter } from 'next/navigation'
import { CustomSize } from '@/lib/types/CartDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useSession } from 'next-auth/react'
import axiosInstance from '@/lib/utilities/axiosInastances'
import { useDataConnectionContext } from '../Contexts/DataConnectionContext'
import { useProductContext } from '../Contexts/ProductContext'
import addProductToCart from '@/lib/actions/addProductToCart'

const ProductPriceAndVariation = ({ searchParams, colorList, sizeList }: {
    searchParams: { [key: string]: string | string[] | undefined },
    colorList: ColorDataModel[],
    sizeList: SizeDataModel[],
}) => {
    const router = useRouter()
    const { product: productObj, setIsVariation, setVariation } = useProductContext()
    const { refreshCartItems } = useDataConnectionContext()
    const { data: session } = useSession()
    const { userCurrency } = useCurrencyContext()
    const [customSizePrice, setCustomSizePrice] = useState(0)
    const [priceFinal, setPriceFinal] = useState(0)
    const [selectedColor, setselectedColor] = useState<string>()
    const [selectedSize, setselectedSize] = useState<string>()
    const [currentVariation, setCurrentVariation] = useState<string>()
    const [customSizeDimension, setSuctomSizeDimensions] = useState<CustomSize>()
    const [quantity, setQuantity] = useState(1)
    const [productColors] = useState(() => {
        const arr = Array()
        productObj?.variations.forEach((variation) => {
            const item = colorList.find(({ name }) => name === variation.variationColor)
            variation.variationColor != null && !arr.some(o => o === item) && arr.push(item)
        })
        return arr
    })
    const [productSizes] = useState(() => {
        const arr = Array()
        productObj?.variations.forEach((variation) => {
            const item = sizeList.find(({ sizeCode }) => sizeCode === variation.variationSize)
            variation.variationSize != null && !arr.some(o => o === item) && arr.push(item)
        })
        return arr
    })
    const productVariationList = useMemo(() => {
        const arr = Array()
        productObj?.variations.forEach((variation) => {
            const item = {
                ...sizeList.find(({ sizeCode }) => sizeCode === variation.variationSize),
                ...colorList.find(({ name }) => name === variation.variationColor),
                ...variation
            }
            console.log(item)
            !arr.some(o => o === item) && arr.push(item)
        })
        return arr
    }, [colorList, productObj?.variations, sizeList])

    useEffect(() => {
        if (currentVariation) {
            if (currentVariation === "customSize") {
                setPriceFinal(Number(((userCurrency?.exchangeRates ?? 1) * Number(customSizePrice)).toFixed(2)))
            } else {
                setPriceFinal(Number(((userCurrency?.exchangeRates ?? 1) * Number(productObj?.variations.find(variation => variation.variationCode === currentVariation)?.variationPrice) - Number(productObj?.variations.find(variation => variation.variationCode === currentVariation)?.variationPrice) * (Number(productObj?.variations.find(variation => variation.variationCode === currentVariation)?.variationDiscount ?? 0) / 100)).toFixed(2)))
            }
            setIsVariation!(true)
            setVariation!(currentVariation)
        } else {
            setPriceFinal(Number(((productObj?.productSellingPrice ?? 0) * (userCurrency?.exchangeRates ?? 1)).toFixed(2)))
        }
    }, [currentVariation, userCurrency, customSizePrice])

    useEffect(() => {
        const varCode = selectedSize != "customSize" ? productVariationList.find(variation => variation.variationSize === selectedSize && variation.variationColor === selectedColor)?.variationCode : "customSize"
        varCode && setCurrentVariation(varCode)
        console.log(productVariationList)
        console.log(selectedColor)
        console.log(selectedSize)
    }, [selectedColor, selectedSize, productVariationList])

    return (
        <>
            <div className="flex items-center space-x-4 my-4">
                <div>
                    <div className="rounded-lg bg-gray-100 flex py-2 px-3 items-center">
                        <span className="text-primary mr-1">{userCurrency?.currencySymbol}</span>
                        <span className="font-bold text-primary text-3xl">
                            {priceFinal}
                        </span>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-green-500 text-xl font-semibold">Save {(currentVariation && currentVariation != "customSize") ? productObj?.variations.find(variation => variation.variationCode === currentVariation)?.variationDiscount + "%" : productObj?.productDiscountPercentage}</p>
                    <p className="text-gray-400 text-base">MSRP :
                        <span className='line-through'>
                            {userCurrency?.currencySymbol}{currentVariation != "customSize" && (userCurrency?.exchangeRates ?? 1) * Number(currentVariation ? productObj?.variations.find(variation => variation.variationCode === currentVariation)?.variationPrice : productObj?.productMSRP) >> 0}
                            {currentVariation == "customSize" && "NA"}
                        </span></p>
                </div>
            </div>
            <p className="text-gray-500 pb-3">{productObj?.productDescriptionShort}</p>
            {
                productObj?.productBaseColor != "N/A" && JSON.parse(productObj?.productBaseColor ?? "{}").colorCode && <div className='flex items-center'>
                    <b>Material Color:</b>
                    <div className='flex flex-col ml-2'>
                        <div onClick={_ => { window.location.reload() }} className='max-w-[1rem] p-4 rounded-full border border-black mx-auto' style={{
                            backgroundColor: JSON.parse(productObj?.productBaseColor ?? "{}")?.colorCode?.hex
                        }} ></div>
                        <div>{JSON.parse(productObj?.productBaseColor ?? "{}").name}</div>
                    </div>
                </div>
            }
            {
                productColors.length > 0 && <div className='my-5'>
                    <div className='pb-2 font-semibold'>Pattern Color Options</div>
                    <div className='flex flex-wrap items-center gap-4'>
                        {
                            productColors.map(color => <div key={color?._id} tabIndex={0} className="cursor-pointer" onClick={_ => {
                                setselectedColor(color.name)
                                !selectedSize && setselectedSize(productVariationList[0].variationSize)
                            }}>
                                <div className={clsx('ring ring-offset-2 mx-auto max-w-[1rem] p-4 rounded-full', color?.name === selectedColor ? "ring-primary" : "ring-gray-200")} style={{
                                    backgroundColor: color?.colorCode?.hex
                                }} />
                                <div>{color.name}</div>
                            </div>)
                        }
                    </div>
                </div>
            }
            {
                (productSizes.length > 0 || productObj?.productCustomizable) && <div className='my-5'>
                    <div className='pb-2 font-semibold'>Size Options</div>
                    <div className='flex flex-wrap gap-2'>
                        {
                            productSizes.map(size => <div key={size._id} className={clsx('border border-black p-1 text-sm transition-all flex flex-col items-center cursor-pointer', { 'bg-secondary text-white': size.sizeCode === selectedSize })} onClick={_ => {
                                setselectedSize(size.sizeCode)
                                !selectedColor && setselectedColor(productVariationList[0].variationColor)
                            }}>
                                <div className='tracking-[0.2em] font-semibold max-sm:text-xs flex'>
                                    <div>{size.sizeCode.split(' ')[0]}</div><div className='text-[10px] ml-2 max-sm:hidden'>{size.sizeCode.split(' ')[1]}</div>
                                </div>
                                <span className='sm:hidden w-full text-center'>{size.sizeCode.split(' ')[1]}</span>
                            </div>)
                        }
                        {
                            productObj?.productCustomizable && <div className={clsx('border border-black p-1 text-sm transition-all flex flex-col items-center cursor-pointer', { 'bg-secondary text-white': "customSize" === selectedSize })} onClick={_ => {
                                selectedSize != "customSize" ? setselectedSize("customSize") : setselectedSize(undefined)
                            }}>
                                <span className='tracking-[0.2em] font-semibold'>Custom Size</span>
                            </div>
                        }
                    </div>
                </div>
            }
            {selectedSize === "customSize" && <CustomSizeProduct priceSqFt={productObj?.productPriceSqFt ?? 0} setPrice={setCustomSizePrice} addToCart={(type, dimensions) => {
                let shape: "Rectangle" | "Round" | "Square" | "Runner"
                switch (type) {
                    case 0:
                        shape = "Rectangle"
                        break;
                    case 1:
                        shape = "Round"
                        break;
                    case 2:
                        shape = "Square"
                        break;
                    case 3:
                        shape = "Runner"
                        break;
                }
                session != null ? addProductToCart(productObj?._id?.toString() ?? "", (session?.user as { id: string }).id, quantity, selectedSize, {
                    shape,
                    unit: "feet",
                    dimensions
                }).then((result) => {
                    if (result.ack) {
                        onPageNotifications("success", "Product Added To Cart").catch(e => console.log(e))
                    } else {
                        onPageNotifications("success", "Failed").catch(e => console.log(e))
                    }
                }).catch(e => console.log(e)).finally(() => { refreshCartItems() }) : router.push('/signin')
            }} />}
            <div className="flex py-4 items-center justify-between gap-2">
                <div className='flex items-center space-x-4'>
                    <select id='quantity_product' className="select select-bordered" onChange={e => setQuantity(Number(e.currentTarget.value))}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option>
                    </select>
                </div>
                {
                    selectedSize != "customSize" && <button type="button" className="h-14 font-semibold rounded-xl btn btn-primary text-white w-full shrink" onClick={e => {
                        session != null ? axiosInstance().post('/api/user/addtocart', {
                            productId: productObj?._id?.toString() ?? "",
                            userId: (session?.user as { id: string }).id,
                            quantity,
                            variationCode: currentVariation
                        }).then((result) => {
                            if (result.data.ack) {
                                onPageNotifications("success", "Product Added To Cart").catch(e => console.log(e))
                            } else {
                                onPageNotifications("success", "Failed").catch(e => console.log(e))
                            }
                        }).catch(e => console.log(e)).finally(() => { refreshCartItems() }) : router.push('/signin')
                    }}>
                        Add to Cart
                    </button>
                }
            </div >
        </>
    )
}

export default ProductPriceAndVariation