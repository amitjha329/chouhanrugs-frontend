import { getNewProducts } from '@/backend/serverActions/getNewProducts'
import React from 'react'
import NewProductCard from '@/ui/Product/NewProductCard'


const ProductList = async () => {
    const products = await getNewProducts({ limit: 8 })

    if (products.length === 0) return null

    return (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5">
            {products.map((product, index) => (
                <NewProductCard {...product} key={product._id!.toString()} index={index} />
            ))}
        </div>
    )
}

export { ProductList }
