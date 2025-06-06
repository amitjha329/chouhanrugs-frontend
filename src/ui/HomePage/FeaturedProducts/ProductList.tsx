import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import React from 'react'

const ProductListHotFeatured = async ({ trendingProducts }: { trendingProducts: ProductDataModelWithColorMap[] }) => {

    return (
        <div className='fluid_conainer grid grid-cols-4 gap-5'>
            {
                trendingProducts.length > 0 && trendingProducts.map(product => {
                    return <ProductCardItem key={product._id?.toString()} {...product} />
                })
            }
        </div>
    )
}

const ProductListHotFeaturedMobile = async ({ trendingProducts }: { trendingProducts: ProductDataModelWithColorMap[] }) => {

    return (
        <div className="carousel carousel-center max-w-full space-x-4 p-4 z-30">
            {
                trendingProducts.length > 0 && trendingProducts
                    .reduce((accumulator: ProductDataModelWithColorMap[][], _, currentIndex, array) => {
                        if (currentIndex % 2 === 0) {
                            accumulator.push(array.slice(currentIndex, currentIndex + 2));
                        }
                        return accumulator;
                    }, []).map(product => {
                        return <div key={product[0]._id?.toString() ?? ""} className='min-w-56 space-y-4'>
                            <ProductCardItem {...product[0]} />
                            {product.length > 1 && <ProductCardItem {...product[1]} />}
                        </div>
                    })
            }
        </div>
    )
}


export { ProductListHotFeatured, ProductListHotFeaturedMobile }