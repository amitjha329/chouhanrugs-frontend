'use client'
import { ProductDataModelWithColorMap } from '@/lib/types/ProductDataModel'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ProductDataContext = createContext<Partial<{ product: ProductDataModelWithColorMap, variation: string, isVariation: boolean, images: string[], setIsVariation: React.Dispatch<React.SetStateAction<boolean>>, setVariation: React.Dispatch<React.SetStateAction<string>> }>>({})
const ProductContext = ({ children, product }: { children: React.ReactNode, product: ProductDataModelWithColorMap }) => {

    const [variation, setVariation] = useState("")
    const [images, setImages] = useState<string[]>(product.images)
    const [isVariation, setIsVariation] = useState(false)

    useEffect(() => {
        if (isVariation) {
            const variationImage = (product.variations.find(item => item.variationCode == variation)?.variationImages ?? [])
            setImages((variationImage?.length??0) > 0 ? variationImage : product.images)
        }
    }, [isVariation, product, variation])

    const value = useMemo(() => ({
        product, variation, isVariation, images, setVariation, setIsVariation
    }), [images, isVariation, product, variation])

    return <ProductDataContext.Provider value={value}>
        {children}
    </ProductDataContext.Provider>
}

export const useProductContext = () => {
    return useContext(ProductDataContext)
}

export default ProductContext