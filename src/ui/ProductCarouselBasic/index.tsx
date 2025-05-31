import { ProductDataModelWithColorMap } from "@/types/ProductDataModel"
import ProductCardItem from "../Product/ProductCardItem"
import SectionTitle from "../SectionTitle"
import clsx from "clsx";

const ProductCarouselBasic = ({ products, sectionHeading, isMobile }: { products: ProductDataModelWithColorMap[], sectionHeading: string, isMobile: boolean }) => {
    // Responsive visible count
    const visibleCount = isMobile ? 2 : 4;

    return (
        <>
            <div className="fluid_container mx-auto ~py-10/20 ~px-5/0">
                <SectionTitle title={sectionHeading} className="text-center ~pb-10/16" />
                <div className="relative">
                    <button
                        id="slider-prev"
                        className={clsx("p-5 absolute top-1/2 -translate-y-1/2 z-30", { "-left-8": isMobile }, { "-left-14": !isMobile })}
                        aria-label="Previous">
                        <div className="btn btn-circle">
                            {'❮'}
                        </div>
                    </button>
                    <div className="overflow-hidden w-full">
                        <div
                            id="slider-track"
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ width: `${(100 * products.length) / visibleCount}%` }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product._id?.toString()}
                                    className="carousel-item flex-shrink-0"
                                    style={{ width: `${100 / products.length}%` }}
                                >
                                    <ProductCardItem {...product} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        id="slider-next"
                        className={clsx("absolute p-5 top-1/2 -translate-y-1/2 z-30", { "-right-8": isMobile }, { "-right-14": !isMobile })}
                        aria-label="Next">
                        <div
                            className="btn btn-circle">
                            {'❯'}
                        </div>
                    </button>

                </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script id="product-carousel-script" src="/ProductCarouselBasicSlider.js"></script>
        </>
    )
}

export default ProductCarouselBasic