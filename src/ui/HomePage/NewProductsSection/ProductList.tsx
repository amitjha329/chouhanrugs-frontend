import { getNewProducts } from '@/backend/serverActions/getNewProducts'
import React from 'react'
import NewProductCard from '@/ui/Product/NewProductCard'


const ProductList = async () => {
    const products = await getNewProducts({ limit: 7 })

    if (products.length === 0) return null
    const [featuredProduct, ...secondaryProducts] = products

    return (
        <div className="mt-5 grid gap-3 lg:mt-7 lg:grid-cols-[minmax(230px,0.72fr)_minmax(0,1.78fr)] lg:items-stretch lg:gap-4">
            {featuredProduct && (
                <NewProductCard
                    {...featuredProduct}
                    key={featuredProduct._id!.toString()}
                    index={0}
                    variant="feature"
                />
            )}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:gap-3">
                {secondaryProducts.map((product, index) => (
                    <NewProductCard {...product} key={product._id!.toString()} index={index + 1} />
                ))}
            </div>
        </div>
    )
}

export { ProductList }
