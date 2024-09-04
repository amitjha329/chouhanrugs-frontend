'use client';
import saveProductStockForm from '@/lib/actions/saveProductStockForm';
import onPageNotifications from '@/ui/common/onPageNotifications';
import React, { ChangeEventHandler, useEffect, useState } from 'react'

type propType = {
    productId: string
    productStockQty: number,
    productMSRP: number,
    productDiscount: string,
    productSellPrice: number,
    productPricePerSqFt: number
}

const ProductStockKeepingInformationForm = ({ productId, productDiscount, productMSRP, productPricePerSqFt, productSellPrice, productStockQty }: propType) => {

    const [quantityNew, setQuantityNew] = useState(productStockQty)
    const [MSRPNew, setMSRPNew] = useState(productMSRP)
    const [discountNew, setDiscountNew] = useState(Number(productDiscount.replace('%', '')) / 100)
    const [sellingPriceNew, setSellingPriceNew] = useState(productSellPrice)
    const [priceSqFtNew, setPriceSqFtNew] = useState(productPricePerSqFt)

    const handlePriceCaculation: ChangeEventHandler<HTMLInputElement> = (e) => {
        switch (e.currentTarget.name) {
            case "product_price":
                setMSRPNew(parseFloat(e.currentTarget.value))
                break;
            case "product_discount_percentage":
                (parseFloat(e.currentTarget.value) > 0) ? setDiscountNew(parseFloat(e.currentTarget.value) / 100) : setDiscountNew(1)
                break;
            default:
                return
        }
    }

    useEffect(() => {
        (discountNew != 1) ? setSellingPriceNew(MSRPNew - (MSRPNew * discountNew) >> 0) : setSellingPriceNew(MSRPNew >> 0)
    }, [MSRPNew, discountNew])

    return (
        <div className='card card-body card-bordered shadow-md mb-5'>
            <div className='card-title'>Product Stock Management</div>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Product Stock Quantity</span>
                <input type="number" className='input input-bordered w-full' name="product_quantity" placeholder='Stock Quantity' value={quantityNew} onChange={e => setQuantityNew(Number(e.currentTarget.value))} required />
            </label>

            <label className='input-group input-group-lg input-group-vertical'>
                <span>Product Price/MSRP</span>
                <input type="text" defaultValue={0} className='input input-bordered w-full' name="product_price" value={MSRPNew} placeholder='Price' onChange={(e) => {
                    handlePriceCaculation(e)
                }} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Product Discount Percent</span>
                <input type="number" step={0.1} min={0} defaultValue={Number(productDiscount.replace('%', ''))} className='input input-bordered w-full' name="product_discount_percentage" placeholder="Discount (%)" required onChange={(e) => {
                    handlePriceCaculation(e)
                }} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Discounted Price/Selling Price</span>
                <input type="text" value={sellingPriceNew} className='input input-disabled input-bordered w-full' name="product_selling_price" disabled required />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Product Price/Sq.Ft.</span>
                <input type="number" className='input input-bordered w-full' name="price_sq_ft" placeholder='Price/Sq.Ft.' value={priceSqFtNew} required onChange={(e) => {
                    setPriceSqFtNew(Number(e.currentTarget.value))
                }} />
            </label>
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' onClick={() => {
                    saveProductStockForm(productId, quantityNew, MSRPNew, `${discountNew * 100}%`, sellingPriceNew, priceSqFtNew).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "Stock Information Updated")
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }}>Save</button>
            </div>
        </div>
    )
}

export default ProductStockKeepingInformationForm