import SizeDataModel from '@/types/SizeDataModel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SizeItems = (props: SizeDataModel) => {
    return (
        <Link href={`/products?size=${props.sizeCode}`} className='flex items-center justify-around md:p-5 md:bg-base-200 rounded-2xl cursor-pointer max-md:flex-col-reverse'>
            <div className='max-md:pt-4'>{props.name}</div>
            <div className='rounded-2xl overflow-hidden h-full'>
                <Image src={props.sizeBanner} alt={props.name} className='!relative !h-40 !w-auto object-cover' height={200} width={200} />
            </div>
        </Link>
    )
}

export default SizeItems