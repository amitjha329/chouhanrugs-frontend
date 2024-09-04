'use client'
import React, { useEffect, useRef, useState } from 'react'
import getProductsIdList from '@/lib/actions/getProductsIdList';
import Flicked from '@/ui/frontend/Sliders/Flicked';
import OATProductsCard from '@/ui/frontend/Cards/OATProductsCard';
import useOnScreenObserver from '@/lib/customHooks/useOnScreenObserver';
import ProductSliderSkeleton from '@/ui/frontend/Skeletons/ProductSliderSkeleton';
import { useProductContext } from '@/ui/frontend/Contexts/ProductContext';

const ProductSliderClient = ({ tagname, title }: { tagname?: string, title: string }) => {

    const singleRootRef = useRef<HTMLDivElement>(null)

    const ref = useRef<HTMLDivElement>(null)
    const { product } = useProductContext()
    const [productIdList, setProductIdList] = useState<{
        _id: string;
    }[]>()
    const intersectionObserver = useOnScreenObserver({ element: singleRootRef, rootMargin: "-100px" })
    useEffect(() => {
        if (intersectionObserver && !productIdList) {
            getProductsIdList({
                limit: 10,
                prevPage: false
            }, {
                ...(product?.productCategory) && { category: [product?.productCategory] },
                ...(tagname) && { tags: [tagname] }
            }).then((res) => {
                console.log(res)
                setProductIdList(res)
            })
        }
    }, [product, intersectionObserver, productIdList, tagname])

    return (<div ref={ref}>
        <section className="sm:container mx-auto no-scrollbar my-5 max-sm:mx-4">
            <h2 className="text-lg font-medium md:text-3xl p-3">{title}</h2>
            <div ref={singleRootRef}>
                {
                    productIdList ? <Flicked options={{
                        groupCells: true,
                        dragThreshold: 10,
                        selectedAttraction: 0.01,
                        friction: 0.15,
                        cellAlign: 'left',
                        contain: true
                    }} >
                        {productIdList.length > 0 && productIdList.map(product => {
                            return (
                                <OATProductsCard key={product._id.toString()} productId={product._id} root={singleRootRef} />
                            )
                        })}
                    </Flicked> : <ProductSliderSkeleton />
                }
            </div>
        </section>
    </div>
    )
}

export default ProductSliderClient