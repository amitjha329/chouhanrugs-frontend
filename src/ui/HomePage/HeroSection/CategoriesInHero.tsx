import { getCategoriesTop } from '@/backend/serverActions/getCategoriesTop'
import Image from '@/ui/components/OptimizedImage'
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
              className="group flex min-w-0 flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40 sm:rounded-xl sm:border sm:border-neutral-200 sm:bg-white sm:shadow-[0_8px_24px_rgba(54,43,30,0.10)] sm:hover:shadow-[0_12px_30px_rgba(54,43,30,0.16)]"
              key={category._id}
            >
              <div className="relative mx-auto h-full w-16 sm:!w-full overflow-hidden rounded-xl bg-neutral-100 aspect-[4/5] sm:max-w-none sm:rounded-none">
                <Image
                  src={category.imgSrc}
                  alt={category.name}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 150px, 180px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex min-h-[48px] items-start justify-center px-1 pt-3 text-center text-xs font-medium leading-4 text-neutral-950 sm:min-h-[56px] sm:items-center sm:px-2 sm:py-2 sm:text-[12px] sm:font-semibold sm:leading-4 sm:text-neutral-900">
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
