'use client'
import React, { useEffect, useState } from 'react'
import { useProductContext } from '../Contexts/ProductContext'
import { ProductDataModel } from '@/lib/types/ProductDataModel'

const ProductNameBrand = () => {
    const { product } = useProductContext()
    const [productObj, setProductObj] = useState<ProductDataModel>()
    useEffect(() => {
        console.log(product)
        setProductObj(product)
    }, [product])
    return (
        <>
            <h2 className="mb-2 leading-tight tracking-tight font-semibold text-gray-800 text-xl md:text-3xl">{productObj?.productName}</h2>
            <p className="text-gray-500 text-sm">By <a href="#" className="text-primary hover:underline">{productObj?.productBrand}</a></p>
        </>
    )
}

export default ProductNameBrand