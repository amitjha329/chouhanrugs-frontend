import Image from "next/image"
import React, { useId } from "react"
import clsx from "clsx"
import './ProductImageGallery.scss'
import Script from 'next/script'

const ImageSection = ({ className, imageArray }: { mobile: boolean, className?: string, imageArray: string[] }) => {
    return (
        <>
            <section className={className}>
                <div className={clsx("sm:overflow-visible items-center justify-center flex")} id="image-carousel-container">
                    <input type="hidden" value={JSON.stringify(imageArray.map(it => `/_next/image?url=${encodeURIComponent(it)}&w=1920&q=100`))} id="imagesProducts" />
                    <div data-image-container className={clsx("rounded-3xl mb-4 relative img-zoom-container md:!h-[500px] max-md:aspect-square max-md:w-full max-md:h-auto overflow-hidden ")}
                    >
                        <img src={imageArray[0] ?? ""} alt='image-viewing' data-main-image className="!relative object-cover h-full w-full" fetchPriority="high" />
                        <div className="img-zoomed z-10" style={{
                            backgroundImage: `url("/_next/image?url=${encodeURIComponent(imageArray[0])}&w=1920&q=75")`,
                            backgroundRepeat: "no-repeat",
                            backgroundColor: "#fff"
                        }} data-zoomed-image></div>
                    </div>
                </div>
                <div className="carousel w-full gap-3 py-3" id="thumbnail-carousel">
                    {
                        imageArray?.map((image, index) => (
                            <div key={image} data-carousel-item data-item-url={image} className={clsx("cursor-pointer carousel-item overflow-hidden rounded-lg w-20 h-20 border-primary border", { 'ring-2 ring-primary shadow ring-offset-1': index == 0 })}>
                                <Image src={image} alt={`image-${index}`} height={100} width={100} className={clsx("!relative object-cover")} quality={5} />
                            </div>
                        ))
                    }
                </div>
            </section>
            <Script id='image-selection-handler' src="/imageHoveZoomHandler.js" />
        </>
    )
}

export default ImageSection
