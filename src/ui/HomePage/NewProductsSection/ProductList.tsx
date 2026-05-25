import React from 'react'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'

const ProductList = ({ products }: { products: ProductDataModelWithColorMap[] }) => {
    if (products.length === 0) return null

    const featuredIndex = Math.min(5, products.length - 1)
    const featuredProduct = products[featuredIndex]
    const leftProducts = products.slice(1, featuredIndex)
    const rightProducts = products.slice(featuredIndex + 1)
    const mobileGroups = products
        .slice(0, 6)
        .reduce((accumulator: ProductDataModelWithColorMap[][], _, currentIndex, array) => {
            if (currentIndex % 2 === 0) {
                accumulator.push(array.slice(currentIndex, currentIndex + 2))
            }
            return accumulator
        }, [])

    return (
        <>
            <div className="carousel carousel-center max-w-full space-x-3 px-1 pb-1 pt-1 md:hidden">
                {mobileGroups.map((group, groupIndex) => (
                    <div
                        key={(group[0]?._id ?? group[0]?.objectID ?? groupIndex).toString()}
                        className="carousel-item w-[10.75rem] flex-none flex-col gap-3"
                    >
                        {group.map((product, indexWithinGroup) => {
                            const absoluteIndex = groupIndex * 2 + indexWithinGroup
                            return (
                                <ProductCardItem
                                    key={(product._id ?? product.objectID ?? absoluteIndex).toString()}
                                    {...product}
                                    index={absoluteIndex}
                                    density="compact"
                                    imageWrapperClassName="aspect-[4/5]"
                                    titleClassName="text-[12px] leading-[16px]"
                                    imageSizes="172px"
                                />
                            )
                        })}
                    </div>
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
                            imageWrapperClassName="aspect-[4/5]"
                            imageSizes="(max-width: 1280px) 16vw, 14vw"
                        />
                    ))}
                </div>

                <ProductCardItem
                    {...featuredProduct}
                    index={featuredIndex}
                    className="h-full"
                    density="compact"
                    imageWrapperClassName="aspect-[4/5]"
                    contentWrapperClassName="px-3.5 pb-3.5 pt-2.5 lg:px-4 lg:pb-4"
                    titleClassName="text-[13px] leading-[17px] sm:text-[14px] sm:leading-[19px]"
                    imageSizes="(max-width: 1280px) 22vw, 20vw"
                    ctaLabel="View"
                    showRating={false}
                />

                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                    {rightProducts.map((product, index) => (
                        <ProductCardItem
                            key={(product._id ?? product.objectID ?? index).toString()}
                            {...product}
                            index={featuredIndex + index + 1}
                            density="compact"
                            imageWrapperClassName="aspect-[4/5]"
                            imageSizes="(max-width: 1280px) 16vw, 14vw"
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export { ProductList }
