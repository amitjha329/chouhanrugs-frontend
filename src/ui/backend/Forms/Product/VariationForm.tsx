'use client'
import ColorDataModel from '@/lib/types/ColorDataModel'
import { Variation } from '@/lib/types/ProductDataModel'
import SizeDataModel from '@/lib/types/SizeDataModel'
import { Listbox } from '@headlessui/react'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import VariationImageSection from './VariationSections/VariationImageSection'
import VariationFormSection from './VariationSections/VariationFormSection'

type propType = {
    productId: string
    productVariations: Variation[],
    colorList: ColorDataModel[], sizeList: SizeDataModel[]
}

const VariationForm = ({ productId, productVariations, colorList, sizeList }: propType) => {
    const checkIfAllImagesAreEmpty = () => {
        let foundImage = false
        selectedColorImages.forEach(i => { (!foundImage) ? foundImage = (i.images.length > 0) : null })
        return foundImage
    }
    const [selectedSizes, setSelectedSizes] = useState<SizeDataModel[]>(() => {
        const arr = Array()
        productVariations.forEach((variation) => {
            const item = sizeList.find(({ sizeCode }: { sizeCode: string }) => sizeCode === variation.variationSize)
            item && variation.variationSize != null && !arr.some(o => o === item) && arr.push(item)
        })
        return arr
    })
    const [selectedColors, setSelectedColors] = useState<ColorDataModel[]>(() => {
        const arr = Array<ColorDataModel>()
        productVariations.forEach((variation) => {
            const item = colorList.find(({ name }: { name: string }) => name === variation.variationColor)
            item && variation.variationColor != null && !arr.some(o => o === item) && arr.push(item)
        })
        return arr
    })
    const [selectedColorImages, setSelectedColorImages] = useState<Array<{
        color: string,
        colorCode: string,
        images: string[]
    }>>(() => {
        const arr = Array<{
            color: string,
            colorCode: string,
            images: string[]
        }>()
        productVariations.forEach((variation) => {
            const item = colorList.find(({ name }: { name: string }) => name === variation.variationColor)
            item && variation.variationColor != null && !arr.some(o => o.color === item.name) && arr.push({ color: item.name, colorCode: item.colorCode.hex, images: variation.variationImages })
        })
        return arr
    })

    const updateColorImages = (images: string[], color: string) => {
        setSelectedColorImages((prev) => {
            const final = prev.map(i => i.color === color ? { ...i, images } : i)
            return final
        })
    }

    const updateSelectedColorImages = (color: ColorDataModel, _: number, __: ColorDataModel[], images?: string[]) => {
        setSelectedColorImages((prev) => {
            const newArr = prev
            if (prev.find(i => i.color === color.name) == undefined) {
                newArr.push({ color: color.name, colorCode: color.colorCode.hex, images: [] })
                return newArr
            }
            return newArr
        })
    }
    const variations = useMemo(() => {
        const totalLength = selectedSizes.length * selectedColors.length
        const arr: Variation[] = []
        totalLength > 0 && selectedColors.forEach((color) => {
            selectedSizes.forEach((size) => {
                arr.push({
                    variationCode: productVariations.find(item => item.variationColor == color.name && item.variationSize == size.sizeCode)?.variationCode ?? "",
                    variationColor: color.name,
                    variationDiscount: productVariations.find(item => item.variationColor == color.name && item.variationSize == size.sizeCode)?.variationDiscount ?? "",
                    variationImages: productVariations.find(item => item.variationColor == color.name && item.variationSize == size.sizeCode)?.variationImages ?? [],
                    variationPrice: productVariations.find(item => item.variationColor == color.name && item.variationSize == size.sizeCode)?.variationPrice ?? "",
                    variationSize: size.sizeCode,
                    variationStock: productVariations.find(item => item.variationColor == color.name && item.variationSize == size.sizeCode)?.variationStock ?? ""
                })
            })
        });
        (selectedColors.length > 0 && selectedSizes.length == 0) && selectedColors.forEach((color) => {
            arr.push({
                variationCode: productVariations.find(item => item.variationColor == color.name)?.variationCode ?? "",
                variationColor: color.name,
                variationDiscount: productVariations.find(item => item.variationColor == color.name)?.variationDiscount ?? "",
                variationImages: productVariations.find(item => item.variationColor == color.name)?.variationImages ?? [],
                variationPrice: productVariations.find(item => item.variationColor == color.name)?.variationPrice ?? "",
                variationSize: null,
                variationStock: productVariations.find(item => item.variationColor == color.name)?.variationStock ?? ""
            })
        });
        (selectedSizes.length > 0 && selectedColors.length == 0) && selectedSizes.forEach((size) => {
            arr.push({
                variationCode: productVariations.find(item => item.variationSize == size.sizeCode)?.variationCode ?? "",
                variationColor: null,
                variationDiscount: productVariations.find(item => item.variationSize == size.sizeCode)?.variationDiscount ?? "",
                variationImages: productVariations.find(item => item.variationSize == size.sizeCode)?.variationImages ?? [],
                variationPrice: productVariations.find(item => item.variationSize == size.sizeCode)?.variationPrice ?? "",
                variationSize: size.sizeCode,
                variationStock: productVariations.find(item => item.variationSize == size.sizeCode)?.variationStock ?? ""
            })
        })
        selectedColors.map(updateSelectedColorImages)
        return arr
    }, [selectedSizes, selectedColors, productVariations])
    // useEffect(() => {
    //     const arr = Array<{
    //         color: string,
    //         colorCode: string,
    //         images: string[]
    //     }>()
    //     productVariations.forEach((variation) => {
    //         const item = colorList.find(({ name }: { name: string }) => name === variation.variationColor)
    //         item && variation.variationColor != null && !arr.some(o => o.color === item.name) && arr.push({ color: item.name, colorCode: item.colorCode.hex, images: variation.variationImages })
    //     })
    //     setSelectedColorImages(arr)
    // }, [])
    const variationListComponent = useMemo(() => {
        return variations.map((varitem, index) => {
            const imgs = selectedColorImages.find(it => it.color == varitem.variationColor)
            return <VariationFormSection key={varitem.variationCode + index} varitem={varitem} productId={productId} variationImage={imgs?.images ?? []} />
        })
    }, [productId, variations, selectedColorImages])

    // const VariationImages = useMemo(() => selectedColorImages.map(({ color, images, colorCode }) => <VariationImageSection key={color} title={`Images For ${color}`} varImage={images} productId={productId} color={color} colorCode={colorCode} setImagesArray={updateColorImages} />), [productId, selectedColorImages])

    return (
        <div className='card card-bordered card-body shadow-md mb-5'>
            <div className='card-title'>Product Variations</div>
            <div className="card card-normal bg-gray-100">
                <div className='card-body'>
                    <div className='card-title'>Size Variation</div>
                    <label className='input-group input-group-lg input-group-vertical relative'>
                        <span>Available Size Options</span>
                        <Listbox value={selectedSizes} onChange={setSelectedSizes} multiple as={Fragment}>
                            <Listbox.Button className="input input-bordered w-full">
                                {selectedSizes.length > 0 && (
                                    <ul className='flex flex-row gap-3'>
                                        {selectedSizes.map((tag) => (
                                            <li key={tag._id} className="bg-blue-400 !rounded-md px-3 text-white" >{tag.name}</li>
                                        ))}
                                    </ul>
                                )}
                                <div className="pointer-events-none absolute right-0 top-12 flex items-center pr-2">
                                    <BiChevronDown
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                            </Listbox.Button>
                            <Listbox.Options className="flex items-start gap-3 flex-row px-7 py-3 border-b border-l border-r flex-wrap">
                                {sizeList.map((tag) => (
                                    <Listbox.Option key={tag._id} value={tag} className="!rounded-md bg-gray-400 text-primary-content px-3">
                                        {tag.name}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    </label>
                </div>
            </div>
            <div className="card card-normal bg-gray-100">
                <div className='card-body'>
                    <div className='card-title'>Color Variation</div>
                    <label className='input-group input-group-lg input-group-vertical relative'>
                        <span>Available Color Options</span>
                        <Listbox value={selectedColors} onChange={setSelectedColors} multiple as={Fragment}>
                            <Listbox.Button className="input input-bordered w-full">
                                {selectedColors.length > 0 && (
                                    <ul className='flex flex-row gap-3'>
                                        {selectedColors.map((tag) => (
                                            <li key={tag._id} className="bg-blue-400 !rounded-md px-3 text-white" >{tag.name}</li>
                                        ))}
                                    </ul>
                                )}
                                <div className="pointer-events-none absolute right-0 top-12 flex items-center pr-2">
                                    <BiChevronDown
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                            </Listbox.Button>
                            <Listbox.Options className="flex items-start gap-3 flex-row px-7 py-3 border-b border-l border-r flex-wrap">
                                {colorList.map((tag) => (
                                    <Listbox.Option key={tag._id} value={tag} className="!rounded-md bg-gray-400 text-primary-content px-3">
                                        {tag.name}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    </label>
                </div>
            </div>
            {
                // VariationImages
                selectedColorImages.map(({ color, images, colorCode }) => <VariationImageSection key={color} title={`Images For ${color}`} varImage={images} productId={productId} color={color} colorCode={colorCode} setImagesArray={updateColorImages} />)
            }
            {
                variationListComponent
            }
        </div>
    )
}




export default VariationForm