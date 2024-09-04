import getBrandsList from '@/lib/actions/getBrandsList'
import getCategoriesList from '@/lib/actions/getCategoriesList'
import { getProductsListAdmin } from '@/lib/actions/getProductsList'
import getTotalProductsCount from '@/lib/actions/getTotalProductsCount'
import ProductsList from '@/ui/backend/Tables/ProductsList'
import { Metadata } from 'next'
import React from 'react'

export const generateMetadata = (): Metadata => {
  return {
    title: "Product Listing"
  }
}

export const fetchCache = 'force-no-store';

const ProductListPage = async ({ searchParams }: { searchParams: { page: number, brand: string, category: string, status: number } }) => {
  const paginatedProductList = await getProductsListAdmin(true)
  console.log(searchParams)
  const [totalProductCount, initialProductsList, brandsList, categoriesList] = await Promise.all([getTotalProductsCount(searchParams.brand ? [searchParams.brand] : [], searchParams.category ? [searchParams.category] : []), paginatedProductList(Number(searchParams.page ?? 1), 10, {
    ...(searchParams.brand) && { brand: [searchParams.brand] },
    ...(searchParams.category) && { category: [searchParams.category] }
  }, searchParams.status == undefined || searchParams.status == -1 ? undefined : searchParams.status == 1), getBrandsList(), getCategoriesList()])
  return (
    <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
      <div className='card-body'>
        <ProductsList totalProducts={totalProductCount} initialProducts={initialProductsList} currentPage={Number(searchParams.page ?? 1)} brandsList={brandsList} categoriesList={categoriesList} />
      </div>
    </div>
  )
}

export default ProductListPage