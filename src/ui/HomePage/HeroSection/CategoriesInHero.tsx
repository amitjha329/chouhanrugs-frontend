import { getCategoriesTop } from '@/backend/serverActions/getCategoriesTop'
import Image from 'next/image'
import React from 'react'

const CategoriesInHero = async () => {
  const categories = await getCategoriesTop()
  return (
    <>
      {
        categories.map((category) => {
          return (
            <div className='space-y-2 ~min-h-32/40' key={category._id}>
              <div className='~w-16/24 ~h-20/28 overflow-hidden rounded-xl border-white border-2 relative mx-auto'>
                <Image src={category.imgSrc} alt={category.name} height={112} width={96} className='object-cover' priority />
              </div>
              <div className='text-xs max-w-24 text-center'>{category.name}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default CategoriesInHero