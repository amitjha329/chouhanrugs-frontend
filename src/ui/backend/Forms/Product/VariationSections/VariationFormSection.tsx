"use client"

import deleteProductVariation from "@/lib/actions/deleteProductVariation"
import saveProductVariations from "@/lib/actions/saveProductVariations"
import { Variation } from "@/lib/types/ProductDataModel"
import stringEmptyOrNull, { stringNotEmptyOrNull } from "@/lib/utilities/stringEmptyOrNull"
import onPageNotifications from "@/ui/common/onPageNotifications"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { MdDeleteOutline } from "react-icons/md"

const VariationFormSection = ({ productId, varitem, variationImage }: { productId: string, varitem: Variation, variationImage: string[] }) => {
    function generateRandomNumber(n: number) {
        return Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
    }
    const generateVariationCode = (str: string) => {
        return str.substring(0, 4).toUpperCase() + generateRandomNumber(10)
    }
    const [price, stPrice] = useState<string>(varitem.variationPrice)
    const [stock, setStock] = useState<string>(varitem.variationStock)
    const [varCode, setVarCode] = useState<string>(stringNotEmptyOrNull(varitem.variationCode) ? varitem.variationCode : generateVariationCode(productId.toUpperCase()))
    const [discount, setDiscount] = useState<string>(varitem.variationDiscount)

    return <div className="flex flex-row ">
        {varitem.variationSize && <div className={clsx('basis-1/5 flex items-center justify-center')}>{varitem.variationSize}</div>}
        {varitem.variationColor && <div className={clsx('basis-1/5 flex items-center justify-center')}>{varitem.variationColor}</div>}
        <div className={clsx('basis-4/5 flex flex-col')}>
            <div className='flex flex-row py-3 pr-3 gap-3'>
                <label className='join w-full'>
                    <span className='join-item px-4 bg-gray-400 py-3'>₹</span>
                    <input type="number" step={0.1} min={0} className='input input-bordered w-full join-item' placeholder="Price" defaultValue={varitem.variationPrice} required onChange={e => stPrice(e.currentTarget.value)} />
                </label>
                <input type="number" step={0.1} min={0} className='input input-bordered w-full' placeholder="Stock" defaultValue={varitem.variationStock} onChange={e => setStock(e.currentTarget.value)} required />
                <input type="text" className='input input-bordered w-full' placeholder="Variation Code" value={varCode} required />
            </div>
            <div className='flex flex-row py-3 pr-3 gap-3'>
                <label className='join w-full'>
                    <span className='join-item px-4 bg-gray-400 py-3'>%</span>
                    <input type="number" step={0.1} min={0} className='input input-bordered w-full join-item' placeholder="Discount" defaultValue={varitem.variationDiscount} required onChange={e => setDiscount(e.currentTarget.value)} />
                </label>
            </div>
            <div className="card-actions justify-end">
                {
                    !stringEmptyOrNull(varitem.variationCode) && <button className='btn btn-error' onClick={() => {
                        deleteProductVariation(productId, varitem.variationCode).then((res) => {
                            if (res.ack) {
                                onPageNotifications("success", "Variation Deleted").then(() => {
                                    window.location.reload()
                                })
                            } else {
                                console.log(res.result)
                            }
                        }).catch(err => console.log(err))
                    }}><MdDeleteOutline /></button>
                }
                <button className="btn btn-primary" onClick={() => {
                    const temp = varitem
                    temp.variationCode = varCode
                    temp.variationDiscount = discount
                    temp.variationImages = variationImage
                    temp.variationPrice = price
                    temp.variationStock = stock
                    saveProductVariations(productId, temp).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "Variation Updated")
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }}>Save</button>
            </div>
        </div>
    </div>
}

export default VariationFormSection