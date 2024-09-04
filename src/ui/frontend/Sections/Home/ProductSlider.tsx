import getProductsList from '@/lib/actions/getProductsList';
import React from 'react'
import Flicked from '../../Sliders/Flicked';
import ProductsCard from '../../Cards/ProductsCard';

const ProductSlider = async ({ tagname, title, category }: { tagname?: string, title: string, category?: string }) => {
    const data = await getProductsList({
        limit: 10,
        prevPage: false
    }, {
        ...(category) && { category: [category] },
        ...(tagname) && { tags: [tagname] }
    })

    return (
        <section className="sm:container mx-auto no-scrollbar my-5 max-sm:mx-4">
            <h2 className="text-lg font-medium md:text-3xl p-3">{title}</h2>
            <Flicked options={{
                groupCells: true,
                dragThreshold: 10,
                selectedAttraction: 0.01,
                friction: 0.15,
                cellAlign: 'left',
                contain: true
            }} >
                {data.length > 0 && data.map(product => {
                    return (
                        <ProductsCard key={product._id?.toString()} productDetails={product} />
                    )
                })}
            </Flicked>
        </section>
    )
}

export default ProductSlider