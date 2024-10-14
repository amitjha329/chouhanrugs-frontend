'use client'

import { ProductDataModelWithColorMap } from "@/types/ProductDataModel"
import ProductContext from "@/utils/Contexts/ProductContext"

export function ProductDataContextProvider({ product, children }: Readonly<{ children: React.ReactNode, product: ProductDataModelWithColorMap }>) {
    return <ProductContext product={product}>{children}</ProductContext>
}