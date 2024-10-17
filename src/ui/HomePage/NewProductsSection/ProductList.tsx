import { getNewProducts } from '@/backend/serverActions/getNewProducts'
import Image from 'next/image'
import React from 'react'
import cushion_pillow from '../../../../static_assets/cushion.webp'
import NewProductCard from '@/ui/Product/NewProductCard'
import { ProductDataModel } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Link from 'next/link'


const ProductList = async () => {
    const products = await getNewProducts({ limit: 8 })

    return (
        <>
            {
                products.map(product => {
                    return <NewProductCard {...product} key={product._id!.toString()} />
                })
            }
            <div className='col-span-2 card card-body flex-row items-center justify-around z-30 bg-base-100'>
                <div className='flex flex-col items-center ~gap-4/7'>
                    <span className='~text-lg/xl font-semibold'>Cushion &amp; Pillow</span>
                    <Link href={'/products/categories/Cushion%20&%20Pillow'} className='btn btn-sm btn-secondary'>View All</Link>
                </div>
                <Image src={cushion_pillow} alt='Cushion Pillow' className='drop-shadow-2xl' height={250} width={200} />
            </div>

        </>
    )
}

const ProductListMobile = async () => {
    const products = await getNewProducts({ limit: 8 })

    return (
        <div className="carousel carousel-center max-w-full space-x-4 p-4 z-30">
            {
                products
                    .reduce((accumulator: ProductDataModel[][], _, currentIndex, array) => {
                        if (currentIndex % 2 === 0) {
                            accumulator.push(array.slice(currentIndex, currentIndex + 2));
                        }
                        return accumulator;
                    }, []).map(product => {
                        return <div key={product[0]._id!.toString()} className='min-w-56 space-y-4'>
                            <NewProductCard {...product[0]} />
                            <NewProductCard {...product[1]} />
                        </div>
                    })
            }
        </div>
    )
}

export { ProductList, ProductListMobile }