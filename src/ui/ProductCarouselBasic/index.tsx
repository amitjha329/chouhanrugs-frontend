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
    const viewportRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
    const touchStartX = useRef<number | null>(null);

    // Reset startIndex if visibleCount or total changes
    useEffect(() => {
        setStartIndex(0);
    }, [visibleCount, total]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleScroll = () => {
            const itemOffsets = itemRefs.current
                .map((item, index) => item ? { index, left: item.offsetLeft } : null)
                .filter((item): item is { index: number, left: number } => item !== null);

            if (itemOffsets.length === 0) return;

            const nextIndex = itemOffsets.reduce((closest, current) => {
                const currentDistance = Math.abs(current.left - viewport.scrollLeft);
                const closestDistance = Math.abs(closest.left - viewport.scrollLeft);
                return currentDistance < closestDistance ? current : closest;
            }, itemOffsets[0]).index;

            setStartIndex(Math.min(nextIndex, maxStartIndex));
        };

        viewport.addEventListener('scroll', handleScroll, { passive: true });
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, [maxStartIndex, total]);

    const scrollToIndex = (index: number) => {
        const targetIndex = Math.max(0, Math.min(index, maxStartIndex));
        const viewport = viewportRef.current;
        const target = itemRefs.current[targetIndex];

        if (!viewport || !target) {
            setStartIndex(targetIndex);
            return;
        }

        viewport.scrollTo({
            left: target.offsetLeft,
            behavior: 'smooth',
        });
        setStartIndex(targetIndex);
    };

    const goToPrev = () => {
        scrollToIndex(startIndex - visibleCount);
    };
    const goToNext = () => {
        scrollToIndex(startIndex + visibleCount);
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
                    <div
                        ref={viewportRef}
                        className="-mx-1.5 overflow-x-auto scroll-smooth px-1.5 sm:-mx-2 sm:px-2 no-scrollbar"
                    >
                        <div
                            id="slider-track"
                            className="flex gap-3 sm:gap-4"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {products.map((product, index) => (
                                <div
                                    key={product._id?.toString()}
                                    ref={(node) => {
                                        itemRefs.current[index] = node;
                                    }}
                                    className={clsx(
                                        "carousel-item flex-shrink-0 scroll-ml-1.5 sm:scroll-ml-2",
                                        isMobile ? "basis-[calc((100%_-_0.75rem)/2)]" : "basis-[calc((100%_-_4rem)/5)]"
                                    )}
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
