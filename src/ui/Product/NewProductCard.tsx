import { ProductDataModel } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface itemProps extends ProductDataModel {
  className?: string
}

const NewProductCard = (product: itemProps) => {
  return (
    <div className={clsx('card items-center justify-around z-30 bg-base-100 card-body p-4', product.className)} key={product._id?.toString() ?? ""}>
      <Image src={product.images[product.productPrimaryImageIndex]} alt={product.productName} width={200} height={135} />
      <div className='text-clip line-clamp-2 text-xs max-w-40 text-center'>
        {product.productName}
      </div>
      <div className='flex gap-2 text-xs'>
        <span className='text-primary'>$ {product.productSellingPrice}</span>
        <span className='line-through text-gray-500'>$ {product.productMSRP}</span>
      </div>
      <div className="rating rating-xs">
        <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
        <input
          type="radio"
          name="rating-5"
          className="mask mask-star-2 bg-orange-400"
          defaultChecked />
        <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
        <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
        <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
      </div>
    </div>
  )
}

export default NewProductCard