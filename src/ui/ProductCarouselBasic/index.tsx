"use client"
import { ProductDataModelWithColorMap } from "@/types/ProductDataModel"
import ProductCardItem from "../Product/ProductCardItem"
import SectionTitle from "../SectionTitle"
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";

const ProductCarouselBasic = ({ products, sectionHeading, isMobile }: { products: ProductDataModelWithColorMap[], sectionHeading: string, isMobile: boolean }) => {
    // Responsive visible count
    const visibleCount = isMobile ? 2 : 4;
    const total = products.length;
    const [startIndex, setStartIndex] = useState(0);
    const maxStartIndex = total > visibleCount ? total - visibleCount : 0;
    const sliderRef = useRef<HTMLDivElement>(null);

    // Reset startIndex if visibleCount or total changes
    useEffect(() => {
        setStartIndex(0);
    }, [visibleCount, total]);

    const goToPrev = () => {
        setStartIndex((prev) => Math.max(prev - visibleCount, 0));
    };
    const goToNext = () => {
        setStartIndex((prev) => Math.min(prev + visibleCount, maxStartIndex));
    };

    // Calculate slider width and transform
    const sliderWidth = `${(100 * total) / visibleCount}%`;
    const itemWidth = `${100 / total}%`;
    const sliderTransform = `translateX(-${startIndex * (100 / total)}%)`;

    return (
        <>
            <div className="fluid_container mx-auto ~py-10/20 ~px-5/0">
                <SectionTitle title={sectionHeading} className="text-center ~pb-10/16" />
                <div className="relative">
                    <button
                        id="slider-prev"
                        className={clsx("p-5 absolute top-1/2 -translate-y-1/2 z-30", { "-left-8": isMobile }, { "-left-14": !isMobile })}
                        aria-label="Previous"
                        onClick={goToPrev}
                        disabled={startIndex === 0}
                    >
                        <div className={clsx("btn btn-circle", { "btn-disabled": startIndex === 0 })}>
                            {'❮'}
                        </div>
                    </button>
                    <div className="overflow-hidden w-full">
                        <div
                            id="slider-track"
                            ref={sliderRef}
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ width: sliderWidth, transform: sliderTransform }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product._id?.toString()}
                                    className="carousel-item flex-shrink-0"
                                    style={{ width: itemWidth }}
                                >
                                    <ProductCardItem {...product} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        id="slider-next"
                        className={clsx("absolute p-5 top-1/2 -translate-y-1/2 z-30", { "-right-8": isMobile }, { "-right-14": !isMobile })}
                        aria-label="Next"
                        onClick={goToNext}
                        disabled={startIndex === maxStartIndex}
                    >
                        <div className={clsx("btn btn-circle", { "btn-disabled": startIndex === maxStartIndex })}>
                            {'❯'}
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}

export default ProductCarouselBasic