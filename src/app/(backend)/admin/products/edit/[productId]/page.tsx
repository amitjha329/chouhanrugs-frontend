import getColorsList from '@/lib/actions/getColorsList'
import getProductWithId from '@/lib/actions/getProductWithId'
import getSizeList from '@/lib/actions/getSizeList'
import FinalAction from '@/ui/backend/Forms/Product/FinalAction'
import GeneralInformationForm from '@/ui/backend/Forms/Product/GeneralInformationForm'
import HighLightedFeaturesForm from '@/ui/backend/Forms/Product/HighLightedFeaturesForm'
import MainImages from '@/ui/backend/Forms/Product/MainImages'
import ProductStockKeepingInformationForm from '@/ui/backend/Forms/Product/ProductStockKeepingInformationForm'
import ShippingInformationForm from '@/ui/backend/Forms/Product/ShippingInformationForm'
import SpecificationForm from '@/ui/backend/Forms/Product/SpecificationForm'
import VariationForm from '@/ui/backend/Forms/Product/VariationForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "Listing Editor"
}

const CreateNewProduct = async ({ params }: { params: { productId: string } }) => {
  const [productData, colorList, sizeList] = await Promise.all([getProductWithId(params.productId), getColorsList(), getSizeList()])
  return (
    <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
      <div className='card-body'>
        <div className='card-title'>Creating New Product</div>
        <MainImages productId={productData?._id?.toString() ?? ""} productImages={productData?.images ?? []} />
        <GeneralInformationForm productId={productData?._id?.toString() ?? ""} productBaseColor={productData?.productBaseColor != "N/A" ? JSON.parse(productData?.productBaseColor ?? "{}") : "{}"} productBrand={productData?.productBrand ?? ""} productCategory={productData?.productCategory ?? ""} productName={productData?.productName ?? ""} productTags={productData?.tags ?? []} productPattern={JSON.stringify(productData?.productPattern ?? {})} productShape={JSON.stringify(productData?.productShape ?? {})} productUrl={productData?.productURL ?? ""} />
        <SpecificationForm productId={productData?._id?.toString() ?? ""} productCareInstructions={productData?.careInstructions ?? []} productHighlights={productData?.highlights ?? []} productLongDesc={productData?.productDescriptionLong ?? ""} productShortDesc={productData?.productDescriptionShort ?? ""} />
        <ProductStockKeepingInformationForm productId={productData?._id?.toString() ?? ""} productDiscount={productData?.productDiscountPercentage ?? "0%"} productMSRP={productData?.productMSRP ?? 0} productPricePerSqFt={productData?.productPriceSqFt ?? 0} productSellPrice={productData?.productSellingPrice ?? 0} productStockQty={productData?.productStockQuantity ?? 0} />
        <HighLightedFeaturesForm productId={productData?._id?.toString() ?? ""} productCustomizable={productData?.productCustomizable ?? false} productFreedelivery={productData?.productFreeDel ?? false} productHandCrafted={productData?.productHandCrafted ?? false} productReturns={productData?.productReturns ?? false} />
        <VariationForm productId={productData?._id?.toString() ?? ""} productVariations={productData?.variations ?? []} colorList={colorList} sizeList={sizeList} />
        <ShippingInformationForm productId={productData?._id?.toString() ?? ""} productShippingInfo={productData?.productShippingInfo ?? ""} />
        <FinalAction productId={productData?._id?.toString() ?? ""} />
      </div>
    </div>
  )
}

export default CreateNewProduct