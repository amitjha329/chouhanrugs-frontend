import React from 'react'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'

const ProductList = ({ products }: { products: ProductDataModelWithColorMap[] }) => {
    if (products.length === 0) return null

    const featuredIndex = Math.min(5, products.length - 1)
    const featuredProduct = products[featuredIndex]
    const leftProducts = products.slice(1, featuredIndex)
    const rightProducts = products.slice(featuredIndex + 1)

    return (
        <>
            <div className="grid gap-3 md:hidden">
                {products.slice(0, 5).map((product, index) => (
                    <ProductCardItem
                        key={(product._id ?? product.objectID ?? index).toString()}
                        {...product}
                        index={index}
                        density="compact"
                        imageWrapperClassName={index === 0 ? 'aspect-[1/1.04]' : 'aspect-[1/0.92]'}
                        titleClassName={index === 0 ? 'text-[12px] sm:text-[13px] sm:leading-[18px]' : undefined}
                        showRating={index !== 0}
                        imageSizes={index === 0 ? '(max-width: 768px) 100vw' : '(max-width: 768px) 50vw'}
                    />
                ))}
            </div>

            <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)_minmax(0,1fr)] md:items-stretch md:gap-4 xl:gap-5">
                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                    {leftProducts.map((product, index) => (
                        <ProductCardItem
                            key={(product._id ?? product.objectID ?? index).toString()}
                            {...product}
                            index={index}
                            density="compact"
                            imageWrapperClassName="aspect-[1/0.96]"
                            imageSizes="(max-width: 1280px) 16vw, 14vw"
                        />
                    ))}
                </div>

                <ProductCardItem
                    {...featuredProduct}
                    index={featuredIndex}
                    className="h-full"
                    density="compact"
                    imageWrapperClassName="h-full min-h-[430px] lg:min-h-[470px]"
                    contentWrapperClassName="px-3.5 pb-3.5 pt-2.5 lg:px-4 lg:pb-4"
                    titleClassName="text-[13px] leading-[17px] sm:text-[14px] sm:leading-[19px]"
                    imageSizes="(max-width: 1280px) 22vw, 20vw"
                    ctaLabel="View"
                    showRating={false}
                    fillHeight
                />

                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                    {rightProducts.map((product, index) => (
                        <ProductCardItem
                            key={(product._id ?? product.objectID ?? index).toString()}
                            {...product}
                            index={featuredIndex + index + 1}
                            density="compact"
                            imageWrapperClassName="aspect-[1/0.96]"
                            imageSizes="(max-width: 1280px) 16vw, 14vw"
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export { ProductList }
