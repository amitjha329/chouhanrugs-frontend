import { getNewProducts } from '@/backend/serverActions/getNewProducts'
import React from 'react'
import NewProductCard from '@/ui/Product/NewProductCard'


const ProductList = async () => {
    const products = await getNewProducts({ limit: 8 })

    if (products.length === 0) return null

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {products.map((product, index) => (
                <NewProductCard {...product} key={product._id!.toString()} index={index} />
            ))}
        </div>
    )
}

export { ProductList }
