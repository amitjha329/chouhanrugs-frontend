import Image from 'next/image'
import React from 'react'
import bg_section from '../../../../static_assets/1370e2249338920089a9a7217d235002.webp'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import { ProductList, ProductListMobile } from './ProductList'
import clsx from 'clsx'
import SectionTitle from '@/ui/SectionTitle'
import handmade_bags from '../../../../static_assets/bags.webp'
import Link from 'next/link'

const NewProductsSection = async () => {
  const header = await headers()
  const isMobile = getDevice({ headers: header }) == "mobile"

  return (
    <div className='relative'>
      <Image className='z-10 object-cover' src={bg_section} alt='banner' fill priority />
      <div className='h-full w-full z-10 bg-secondary/80 absolute'></div>
      <SectionTitle className='z-30 absolute ~top-5/10 left-1/2 -translate-x-1/2' title='New Products' />
      <div className={clsx('fluid_container mx-auto ~pb-10/20 ~pt-20/40', { "grid grid-cols-4 gap-5": !isMobile })}>
        <div className='col-span-2 card card-body flex-row items-center justify-around z-30 bg-base-100 ~sm/md:~mx-5/0'>
          <div className={clsx('flex flex-col max-w-fit ~gap-4/7', { "items-center": !isMobile })}>
            <span className='~text-lg/xl font-semibold'>Rugs &amp; Runners</span>
            <Link href={'/products/categories/Rugs%20&%20Runners'} className='btn btn-sm btn-secondary'>View All</Link>
          </div>
          <Image src={handmade_bags} alt='Handmade Bags' className='drop-shadow-2xl h-auto ~sm/2xl:~w-32/52' height={250} width={200} />
        </div>
        {
          !isMobile ? <ProductList /> : <ProductListMobile />
        }
      </div>
    </div>
  )
}

export default NewProductsSection