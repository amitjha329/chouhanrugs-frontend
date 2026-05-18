import { getCategoriesTop } from '@/backend/serverActions/getCategoriesTop'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CategoriesInHero = async () => {
  const categories = await getCategoriesTop()
  return (
    <>
      {
        categories.map((category) => {
          return (
            <Link
              href={`/products/category/${encodeURIComponent(category.slug ?? category.name)}`}
              className="group flex min-w-[124px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(54,43,30,0.10)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(54,43,30,0.16)] focus:outline-none focus:ring-2 focus:ring-primary/40 sm:min-w-0"
              key={category._id}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={category.imgSrc}
                  alt={category.name}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 124px, (max-width: 1024px) 150px, 180px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex min-h-[56px] items-center justify-center px-2 py-2 text-center text-[12px] font-semibold leading-4 text-neutral-900">
                {category.name}
              </div>
            </Link>
          )
        })
      }
    </>
  )
}

export default CategoriesInHero
