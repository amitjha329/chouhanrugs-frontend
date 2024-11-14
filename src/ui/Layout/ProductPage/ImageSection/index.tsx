import Image from "next/image"
import React, { useId } from "react"
import clsx from "clsx"
import './ProductImageGallery.scss'
import Script from 'next/script'

const ImageSection = ({ className, imageArray, mobile = false }: { mobile: boolean, className?: string, imageArray: string[] }) => {
    const generatedId = useId()

    return (
        <>
            <section className={className}>

                <div className={clsx("sm:overflow-visible items-center justify-center flex")}>
                    {
                        Array.isArray(imageArray) && imageArray.map((image, index) => (
                            <div key={image} data-image-container className={clsx(`image-${index}`, "rounded-3xl mb-4 relative img-zoom-container !h-[500px] overflow-hidden ", { "hidden": index > 0 })}
                            >
                                <Image src={image} alt={`image-${index}`} data-main-image id={`${generatedId}-mainImage-${index}`} className="!relative mx-auto object-cover" fill quality={50} fetchPriority="high" priority />
                                <div className="img-zoomed z-10" style={{
                                    backgroundImage: `url("/_next/image?url=${encodeURIComponent(image)}&w=1920&q=75")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundColor: "#fff"
                                }} id={`${generatedId}-zoomed-${index}`} data-zoomed-image></div>
                            </div>
                        ))
                    }
                </div>
                <div className="carousel w-full gap-3 py-3">
                    {
                        imageArray?.map((image, index) => (
                            <div key={image} data-carousel-item className={clsx("cursor-pointer carousel-item overflow-hidden rounded-lg w-20 h-20 border-primary border", { 'ring-2 ring-primary shadow ring-offset-1': index == 0 })}>
                                <Image src={image} alt={`image-${index}`} height={100} width={100} className={clsx("!relative object-cover")} quality={5} />
                            </div>
                        ))
                    }
                </div>
            </section>
            <script id='image-selection-handler' src="/imageHoveZoomHandler.js" />
        </>
    )
}

export default ImageSection
