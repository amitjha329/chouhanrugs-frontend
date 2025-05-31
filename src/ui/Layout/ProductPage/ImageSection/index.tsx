"use client"
import Image from "next/image"
import React, { useEffect, useRef } from "react"
import clsx from "clsx"
import './ProductImageGallery.scss'
import { useProductContext } from '@/utils/Contexts/ProductContext'

const ImageSection = ({ className, mobile }: { mobile: boolean, className?: string }) => {
    const {
        selectedImageIndex,
        handleThumbnailHover,
        zoomPosition,
        handleImageMouseMove,
        handleImageMouseLeave,
        images
    } = useProductContext() || {}
    const mainImageRef = useRef<HTMLImageElement>(null) as React.RefObject<HTMLImageElement>
    const selectedImage = images?.[selectedImageIndex ?? 0] ?? images?.[0] ?? ""
    // Only show magnifier when mouse is over image
    const showMagnifier = zoomPosition !== null;
    // Default size for magnifier
    const magnifierSize = 340;

    return (
        <>
            <section className={className}>
                <div className={clsx("sm:overflow-visible items-center justify-center flex")} id="image-carousel-container">
                    {/* Hidden input for legacy JS, can be removed if not needed */}
                    {/* <input type="hidden" value={JSON.stringify(images.map(it => `/_next/image?url=${encodeURIComponent(it)}&w=1920&q=100`))} id="imagesProducts" /> */}
                    <div
                        data-image-container
                        className={clsx("rounded-3xl mb-4 relative img-zoom-container md:!h-[500px] max-md:aspect-square max-md:w-full max-md:h-auto overflow-hidden ")}
                        onMouseMove={e => handleImageMouseMove && handleImageMouseMove(e, mainImageRef)}
                        onMouseLeave={handleImageMouseLeave}
                    >
                        <img
                            ref={mainImageRef}
                            src={`/_next/image?url=${encodeURIComponent(selectedImage)}&w=1920&q=100`}
                            alt='image-viewing'
                            data-main-image
                            className="!relative object-cover h-full w-full"
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                        />
                        <div
                            className="img-zoomed z-10"
                            style={{
                                display: showMagnifier ? 'block' : 'none',
                                position: 'absolute',
                                width: magnifierSize,
                                height: magnifierSize,
                                borderRadius: '50%',
                                pointerEvents: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                left: showMagnifier && zoomPosition ? `calc(${zoomPosition.x}% - ${magnifierSize / 2}px)` : undefined,
                                top: showMagnifier && zoomPosition ? `calc(${zoomPosition.y}% - ${magnifierSize / 2}px)` : undefined,
                                backgroundImage: `url("/_next/image?url=${encodeURIComponent(selectedImage)}&w=1920&q=100")`,
                                backgroundRepeat: "no-repeat",
                                backgroundColor: "#fff",
                                backgroundPositionX: zoomPosition ? `${zoomPosition.x}%` : undefined,
                                backgroundPositionY: zoomPosition ? `${zoomPosition.y}%` : undefined,
                                backgroundSize: '250% 250%',
                                border: '2px solid #eee',
                                zIndex: 10,
                            }}
                            data-zoomed-image
                        ></div>
                    </div>
                </div>
                <div className="carousel w-full gap-3 py-3" id="thumbnail-carousel">
                    {
                        images?.map((image, index) => (
                            <div
                                key={image}
                                data-carousel-item
                                data-item-url={image}
                                className={clsx(
                                    "cursor-pointer carousel-item overflow-hidden rounded-lg w-20 h-20 border-primary border",
                                    { 'ring-2 ring-primary shadow ring-offset-1': index === (selectedImageIndex ?? 0) }
                                )}
                                onMouseOver={() => handleThumbnailHover && handleThumbnailHover(index)}
                            >
                                <Image src={image}
                                    alt={`image-${index}`}
                                    height={100}
                                    width={100}
                                    className={clsx("!relative object-cover")}
                                    quality={5}
                                    loading="eager"
                                    decoding="async"
                                />
                            </div>
                        ))
                    }
                </div>
            </section>
        </>
    )
}

export default ImageSection
