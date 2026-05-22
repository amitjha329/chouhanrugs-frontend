"use client"
import { ProductDataModelWithColorMap } from "@/types/ProductDataModel"
import ProductCardItem from "../Product/ProductCardItem"
import SectionTitle from "../SectionTitle"
import clsx from "clsx";
import { useState, useEffect, useRef, memo, type TouchEvent } from "react";

const ProductCarouselBasic = memo(function ProductCarouselBasic({ 
    products, 
    sectionHeading, 
    isMobile 
}: { 
    products: ProductDataModelWithColorMap[], 
    sectionHeading: string, 
    isMobile: boolean 
}) {
    // Responsive visible count
    const visibleCount = isMobile ? 2 : 5;
    const total = products.length;
    const [startIndex, setStartIndex] = useState(0);
    const maxStartIndex = total > visibleCount ? total - visibleCount : 0;
    const sliderRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);

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

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (!isMobile) return;
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (!isMobile || touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(deltaX) < 40) return;
        if (deltaX < 0) {
            goToNext();
        } else {
            goToPrev();
        }
    };

    // Calculate slider width and transform
    const sliderWidth = `${(100 * total) / visibleCount}%`;
    const itemWidth = `${100 / total}%`;
    const sliderTransform = `translateX(-${startIndex * (100 / total)}%)`;

    return (
        <>
            <div className="fluid_container mx-auto ~px-5/0 ~py-8/14">
                <SectionTitle title={sectionHeading} className="text-center ~pb-6/10" />
                <div className="relative">
                    <button
                        id="slider-prev"
                        className={clsx("absolute top-1/2 z-30 -translate-y-1/2 rounded-full p-2", { "-left-5": isMobile }, { "-left-12": !isMobile })}
                        aria-label="Previous"
                        onClick={goToPrev}
                        disabled={startIndex === 0}
                    >
                        <div className={clsx("btn btn-circle btn-sm border-primary/15 bg-white text-primary shadow-md hover:bg-primary hover:text-primary-content", { "btn-disabled": startIndex === 0 })}>
                            {'❮'}
                        </div>
                    </button>
                    <div className="-mx-1.5 overflow-hidden px-1.5 sm:-mx-2 sm:px-2">
                        <div
                            id="slider-track"
                            ref={sliderRef}
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ width: sliderWidth, transform: sliderTransform }}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {products.map((product, index) => (
                                <div
                                    key={product._id?.toString()}
                                    className="carousel-item flex-shrink-0 px-1.5 sm:px-2"
                                    style={{ width: itemWidth }}
                                >
                                    <ProductCardItem {...product} index={index} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        id="slider-next"
                        className={clsx("absolute top-1/2 z-30 -translate-y-1/2 rounded-full p-2", { "-right-5": isMobile }, { "-right-12": !isMobile })}
                        aria-label="Next"
                        onClick={goToNext}
                        disabled={startIndex === maxStartIndex}
                    >
                        <div className={clsx("btn btn-circle btn-sm border-primary/15 bg-white text-primary shadow-md hover:bg-primary hover:text-primary-content", { "btn-disabled": startIndex === maxStartIndex })}>
                            {'❯'}
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
})

export default ProductCarouselBasic
